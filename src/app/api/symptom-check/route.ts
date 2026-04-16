import { NextRequest, NextResponse } from "next/server";
import {
  symptomModel,
  symptomModelFallback,
  extractSeverity,
  cleanResponse,
} from "@/lib/gemini";
import { triageLocally } from "@/lib/triage-engine";
import { consumeRateLimit, checkRateLimit, refundRateLimit } from "@/lib/rate-limit";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.ip ||
    "anonymous"
  );
}

function isQuotaError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return msg.includes("429") || msg.includes("quota") || msg.includes("rate limit") || msg.includes("resource exhausted");
}

export async function GET(req: NextRequest) {
  // Usage check endpoint — returns remaining quota without consuming
  const ip = getClientIP(req);
  const usage = checkRateLimit(ip);
  return NextResponse.json({
    remaining: usage.remaining,
    limit: usage.limit,
    resetAt: usage.resetAt,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    if (messages.length > 50) {
      return NextResponse.json(
        { error: "Conversation too long. Please start a new session." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const ip = getClientIP(req);

    // --- Layer 1: Rule-based triage (no API call) ---
    const localResult = triageLocally(
      lastMessage.content,
      messages.length - 1
    );

    if (localResult) {
      // Still return current usage info alongside the response
      const usage = checkRateLimit(ip);
      return NextResponse.json({
        message: localResult.message,
        severity: localResult.severity,
        source: localResult.source,
        usage: { remaining: usage.remaining, limit: usage.limit },
      });
    }

    // --- Layer 2: AI (rate-limited) ---
    const rateCheck = consumeRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error:
            "You've reached the daily AI query limit. Rule-based triage is still available. Your limit resets at midnight UTC.",
          usage: { remaining: 0, limit: rateCheck.limit },
        },
        { status: 429 }
      );
    }

    const chat = symptomModel.startChat({
      history: messages.slice(0, -1).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    let responseText: string;

    try {
      const result = await chat.sendMessage(lastMessage.content);
      responseText = result.response.text();
    } catch (primaryError) {
      if (isQuotaError(primaryError)) {
        console.warn("Primary model quota hit, trying fallback...");
        try {
          const fallbackChat = symptomModelFallback.startChat({
            history: messages.slice(0, -1).map((m) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.content }],
            })),
          });
          const fallbackResult = await fallbackChat.sendMessage(
            lastMessage.content
          );
          responseText = fallbackResult.response.text();
        } catch (fallbackError) {
          if (isQuotaError(fallbackError)) {
            refundRateLimit(ip);
            return NextResponse.json(
              {
                error:
                  "AI service is temporarily at capacity. Please wait a minute and try again, or describe common symptoms (headache, fever, cold) for instant rule-based triage.",
                retryable: true,
                usage: {
                  remaining: rateCheck.remaining + 1,
                  limit: rateCheck.limit,
                },
              },
              { status: 503 }
            );
          }
          refundRateLimit(ip);
          throw fallbackError;
        }
      } else {
        refundRateLimit(ip);
        throw primaryError;
      }
    }

    const severity = extractSeverity(responseText);
    const cleaned = cleanResponse(responseText);

    return NextResponse.json({
      message: cleaned,
      severity,
      source: "ai" as const,
      usage: { remaining: rateCheck.remaining, limit: rateCheck.limit },
    });
  } catch (error) {
    console.error("Symptom check error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
