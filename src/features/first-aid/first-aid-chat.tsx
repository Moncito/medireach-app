"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { MessageBubble, TypingIndicator } from "@/features/symptom-checker/message-bubble";
import { useAuth } from "@/features/auth/auth-provider";
import {
  createConversation,
  updateConversation,
  type StoredMessage,
} from "@/lib/firebase/conversations";
import {
  Send,
  Sparkles,
  RotateCcw,
  HeartPulse,
  Flame,
  Scissors,
  Bug,
  WifiOff,
} from "lucide-react";
import { AnonymousSaveBanner } from "@/components/ui/anonymous-save-banner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: "first-aid-ai";
  timestamp: number;
}

interface UsageInfo {
  remaining: number;
  limit: number;
}

const suggestedPrompts = [
  {
    icon: Flame,
    label: "Burn treatment",
    prompt: "Someone just got a burn from boiling water on their hand. What should I do?",
  },
  {
    icon: HeartPulse,
    label: "CPR basics",
    prompt: "How do I perform CPR on an adult who collapsed and isn't breathing?",
  },
  {
    icon: Scissors,
    label: "Deep cut",
    prompt: "I cut my finger deeply with a knife and it's bleeding a lot. How do I stop it?",
  },
  {
    icon: Bug,
    label: "Insect sting",
    prompt: "I got stung by a bee and the area is swelling. What should I do?",
  },
];

export function FirstAidChat() {
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
    fetch("/api/first-aid")
      .then((r) => r.json())
      .then((data) => setUsage({ remaining: data.remaining, limit: data.limit }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const saveConversation = useCallback(
    async (allMessages: Message[]) => {
      if (!user?.uid || user.isAnonymous) return;
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      const stored: StoredMessage[] = allMessages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.source ? { source: m.source } : {}),
        timestamp: m.timestamp,
      }));

      try {
        if (!conversationIdRef.current) {
          conversationIdRef.current = await createConversation(user.uid, stored, "first-aid");
        } else {
          await updateConversation(user.uid, conversationIdRef.current, stored);
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

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const genericError = "I'm sorry, I'm having trouble right now. Please try again in a moment.";
    let apiError: string | null = null;

    try {
      const res = await fetch("/api/first-aid", {
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
        if (errorData?.usage) setUsage(errorData.usage);
        apiError = errorData?.error || null;
        throw new Error(apiError || genericError);
      }

      const data = await res.json();
      if (data.usage) setUsage(data.usage);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        source: "first-aid-ai",
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveConversation(finalMessages);
    } catch (err) {
      const errorContent = apiError || genericError;
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: errorContent, timestamp: Date.now() },
      ]);
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
    <div className="rounded-2xl border border-border/60 bg-white overflow-hidden">
      {/* Chat area */}
      <div className="h-[420px] flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-5">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-coral/10 to-accent-coral/5 flex items-center justify-center mb-4">
                <HeartPulse className="w-7 h-7 text-accent-coral" />
              </div>
              <h2 className="font-heading text-lg text-foreground mb-1.5">
                First Aid AI Assistant
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-5">
                Ask me anything about first aid — from treating burns to
                performing CPR. I&apos;ll give you clear, step-by-step
                instructions.
              </p>

              <div className="grid grid-cols-2 gap-2.5 w-full">
                {suggestedPrompts.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.label}
                      onClick={() => sendMessage(prompt.prompt)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-white/80 text-left text-sm hover:shadow-soft hover:border-border transition-all duration-200"
                    >
                      <Icon className="w-4 h-4 text-accent-coral flex-shrink-0" />
                      <span className="text-foreground font-medium text-xs">
                        {prompt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  source={msg.source}
                  isLatest={i === messages.length - 1}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border/60 bg-white/80 px-4 lg:px-6 py-3">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-white shadow-soft p-2 focus-within:border-accent-coral/30 focus-within:shadow-glow/5 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a first aid question..."
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
          <div className="flex items-center justify-between mt-1.5 px-1">
            <p className="text-[11px] text-muted/50">
              Not a substitute for emergency medical services.
            </p>
            {usage && (
              <div className="flex items-center gap-2 text-[11px]">
                {usage.remaining === 0 ? (
                  <span className="flex items-center gap-1 text-red-500 font-medium">
                    <WifiOff className="w-3 h-3" />
                    AI limit reached
                  </span>
                ) : (
                  <>
                    <span className={usage.remaining <= 10 ? "text-amber-500 font-medium" : "text-muted/50"}>
                      {usage.remaining}/{usage.limit} AI queries
                    </span>
                    <div className="w-12 h-1.5 rounded-full bg-surface overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          usage.remaining === 0
                            ? "bg-red-400"
                            : usage.remaining <= 10
                            ? "bg-amber-400"
                            : "bg-accent-mint"
                        }`}
                        style={{ width: `${(usage.remaining / usage.limit) * 100}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {user?.isAnonymous && <AnonymousSaveBanner />}
        </div>
      </div>
    </div>
  );
}
