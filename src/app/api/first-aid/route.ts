import { NextRequest, NextResponse } from "next/server";
import {
  firstAidModel,
  firstAidModelFallback,
  cleanResponse,
} from "@/lib/gemini";
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

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return msg.includes("429") || msg.includes("503") || msg.includes("quota") || msg.includes("rate limit") || msg.includes("resource exhausted") || msg.includes("service unavailable") || msg.includes("high demand") || msg.includes("overloaded");
}

export async function GET(req: NextRequest) {
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

    const rateCheck = consumeRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error:
            "You've reached the daily AI query limit. Your limit resets at midnight UTC.",
          usage: { remaining: 0, limit: rateCheck.limit },
        },
        { status: 429 }
      );
    }

    let responseText: string;

    try {
      const chat = firstAidModel.startChat({
        history: messages.slice(0, -1).map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
      });

      try {
        const result = await chat.sendMessage(lastMessage.content);
        responseText = result.response.text();
      } catch (primaryError) {
        if (isRetryableError(primaryError)) {
          console.warn("First Aid primary model unavailable or rate-limited, trying fallback...", (primaryError as Error).message);
          try {
            const fallbackChat = firstAidModelFallback.startChat({
              history: messages.slice(0, -1).map((m) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.content }],
              })),
            });
            const fallbackResult = await fallbackChat.sendMessage(lastMessage.content);
            responseText = fallbackResult.response.text();
          } catch (fallbackError) {
            if (isRetryableError(fallbackError)) {
              refundRateLimit(ip);
              return NextResponse.json(
                {
                  error:
                    "AI service is temporarily at capacity. Please wait a minute and try again.",
                  retryable: true,
                  usage: {
                    remaining: rateCheck.remaining + 1,
                    limit: rateCheck.limit,
                  },
                },
                { status: 503 }
              );
            }
            throw fallbackError;
          }
        } else {
          throw primaryError;
        }
      }
    } catch (error) {
      refundRateLimit(ip);
      throw error;
    }

    const cleaned = cleanResponse(responseText);

    return NextResponse.json({
      message: cleaned,
      source: "first-aid-ai" as const,
      usage: { remaining: rateCheck.remaining, limit: rateCheck.limit },
    });
  } catch (error) {
    console.error("First aid AI error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
