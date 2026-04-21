"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { MessageBubble, TypingIndicator } from "./message-bubble";
import { useAuth } from "@/features/auth/auth-provider";
import {
  createConversation,
  updateConversation,
  type StoredMessage,
} from "@/lib/firebase/conversations";
import type { Severity } from "@/lib/gemini";
import {
  Send,
  Sparkles,
  RotateCcw,
  Thermometer,
  Brain,
  Bone,
  Eye,
  Zap,
  Cpu,
  WifiOff,
} from "lucide-react";
import { AnonymousSaveBanner } from "@/components/ui/anonymous-save-banner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  severity?: Severity;
  source?: "emergency" | "rules" | "ai";
  timestamp: number;
}

interface UsageInfo {
  remaining: number;
  limit: number;
}

const suggestedPrompts = [
  {
    icon: Thermometer,
    label: "Fever & chills",
    prompt: "I've been having a fever of about 101°F with chills since yesterday",
  },
  {
    icon: Brain,
    label: "Headache",
    prompt: "I've had a persistent headache for the past 3 days that won't go away",
  },
  {
    icon: Bone,
    label: "Joint pain",
    prompt: "My knee has been hurting and swelling up after exercise",
  },
  {
    icon: Eye,
    label: "Eye irritation",
    prompt: "My eyes have been red and itchy for a few days now",
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchUsage = useCallback(() => {
    fetch("/api/symptom-check")
      .then((r) => r.json())
      .then((data) => setUsage({ remaining: data.remaining, limit: data.limit }))
      .catch(() => {});
  }, []);

  // Fetch initial usage quota
  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  /** Persist conversation to Firestore (fire-and-forget) */
  const saveConversation = useCallback(
    async (allMessages: Message[], latestSeverity?: Severity) => {
      if (!user?.uid || user.isAnonymous) return;
      if (isSavingRef.current) return; // prevent concurrent saves
      isSavingRef.current = true;
      const stored: StoredMessage[] = allMessages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.severity ? { severity: m.severity } : {}),
        ...(m.source ? { source: m.source } : {}),
        timestamp: m.timestamp,
      }));

      try {
        if (!conversationIdRef.current) {
          conversationIdRef.current = await createConversation(user.uid, stored, "symptom-checker");
        } else {
          await updateConversation(
            user.uid,
            conversationIdRef.current,
            stored,
            latestSeverity
          );
        }
      } catch (err) {
        // Non-critical: conversation history is a convenience feature
        if (process.env.NODE_ENV !== "production") {
          console.debug("[saveConversation] failed:", err, { uid: user?.uid, conversationId: conversationIdRef.current });
        }
      } finally {
        isSavingRef.current = false;
      }
    },
    [user]
  );

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/symptom-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (errorData?.usage) {
          setUsage(errorData.usage);
        }
        throw new Error(
          errorData?.error ||
            "Failed to get response. Please try again."
        );
      }

      const data = await res.json();

      // Update usage if returned
      if (data.usage) {
        setUsage(data.usage);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        severity: data.severity,
        source: data.source,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Save to Firestore (non-blocking)
      saveConversation(finalMessages, data.severity);
    } catch (err) {
      const errorContent =
        err instanceof Error && err.message !== "Failed to get response. Please try again."
          ? err.message
          : "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: errorContent,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleReset() {
    setMessages([]);
    setInput("");
    conversationIdRef.current = null;
    isSavingRef.current = false;
    inputRef.current?.focus();
    fetchUsage();
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        {!hasMessages ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-coral/10 to-accent-coral/5 flex items-center justify-center mb-5">
              <Sparkles className="w-8 h-8 text-accent-coral" />
            </div>
            <h2 className="font-heading text-heading text-foreground mb-2">
              AI Symptom Checker
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              Describe your symptoms and I&apos;ll help you understand what
              might be going on. I&apos;ll ask follow-up questions if needed to
              provide better guidance.
            </p>

            {/* Hybrid engine indicator */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-[11px]">
              <span className="flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 px-3 py-1 font-medium">
                <Zap className="w-3 h-3" /> Emergency Detection — Instant
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-accent-mint/10 text-accent-mint px-3 py-1 font-medium">
                <Cpu className="w-3 h-3" /> Rule-based Triage — Fast
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-accent-lavender/10 text-accent-lavender px-3 py-1 font-medium">
                <Sparkles className="w-3 h-3" /> Gemini AI — Deep Analysis
              </span>
            </div>

            {/* Suggested prompts */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {suggestedPrompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={prompt.label}
                    onClick={() => sendMessage(prompt.prompt)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-white/80 text-left text-sm hover:shadow-soft hover:border-border transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 text-accent-coral flex-shrink-0" />
                    <span className="text-foreground font-medium">
                      {prompt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-muted/60 mt-6">
              This is not a substitute for professional medical advice.
            </p>
          </div>
        ) : (
          /* Messages */
          <div className="space-y-5 max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                severity={msg.severity ?? undefined}
                source={msg.source}
                isLatest={i === messages.length - 1}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border/60 bg-white/80 backdrop-blur-xl px-4 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-white shadow-soft p-2 focus-within:border-accent-coral/30 focus-within:shadow-glow/5 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms..."
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-light outline-none disabled:opacity-50"
              />
              <div className="flex items-center gap-1.5">
                {hasMessages && (
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-colors disabled:opacity-30"
                    title="New conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-accent-coral text-white hover:bg-accent-coral/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[11px] text-muted/50">
              MediReach AI can make mistakes. Always verify with a professional.
            </p>
            {usage && (
              <UsageIndicator remaining={usage.remaining} limit={usage.limit} />
            )}
          </div>
          {user?.isAnonymous && <AnonymousSaveBanner />}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Usage Indicator                                                   */
/* ------------------------------------------------------------------ */

function UsageIndicator({
  remaining,
  limit,
}: {
  remaining: number;
  limit: number;
}) {
  const pct = (remaining / limit) * 100;
  const isLow = remaining <= 10;
  const isDepleted = remaining === 0;

  return (
    <div className="flex items-center gap-2 text-[11px]">
      {isDepleted ? (
        <span className="flex items-center gap-1 text-red-500 font-medium">
          <WifiOff className="w-3 h-3" />
          AI limit reached
        </span>
      ) : (
        <>
          <span className={isLow ? "text-amber-500 font-medium" : "text-muted/50"}>
            {remaining}/{limit} AI queries
          </span>
          <div className="w-12 h-1.5 rounded-full bg-surface overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDepleted
                  ? "bg-red-400"
                  : isLow
                  ? "bg-amber-400"
                  : "bg-accent-mint"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
