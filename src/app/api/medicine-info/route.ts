import { NextRequest, NextResponse } from "next/server";
import {
  medicineModel,
  medicineModelFallback,
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
  return (
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("resource exhausted") ||
    msg.includes("service unavailable") ||
    msg.includes("high demand") ||
    msg.includes("overloaded")
  );
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

    const MAX_MESSAGE_LENGTH = 2000;
    if (messages.some((m: Message) => typeof m.content !== "string" || m.content.length > MAX_MESSAGE_LENGTH)) {
      return NextResponse.json(
        { error: "Message content is too long. Please keep messages under 2000 characters." },
        { status: 400 }
      );
    }

    if (messages.some((m: Message) => m.role !== "user" && m.role !== "assistant")) {
      return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
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

    const chatHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    try {
      const chat = medicineModel.startChat({ history: chatHistory });

      try {
        const result = await chat.sendMessage(lastMessage.content);
        responseText = result.response.text();
      } catch (primaryError) {
        if (isRetryableError(primaryError)) {
          console.warn(
            "Medicine primary model unavailable or rate-limited, trying fallback...",
            (primaryError as Error).message
          );
          try {
            const fallbackChat = medicineModelFallback.startChat({ history: chatHistory });
            const fallbackResult = await fallbackChat.sendMessage(
              lastMessage.content
            );
            responseText = fallbackResult.response.text();
          } catch (fallbackError) {
            if (isRetryableError(fallbackError)) {
              void refundRateLimit(ip);
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
      void refundRateLimit(ip);
      throw error;
    }

    const cleaned = cleanResponse(responseText);

    if (!cleaned.trim()) {
      void refundRateLimit(ip);
      return NextResponse.json(
        {
          error: "AI service returned an empty response. Please try again.",
          retryable: true,
          usage: { remaining: rateCheck.remaining + 1, limit: rateCheck.limit },
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      message: cleaned,
      source: "medicine-ai" as const,
      usage: { remaining: rateCheck.remaining, limit: rateCheck.limit },
    });
  } catch (error) {
    console.error("Medicine AI error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
