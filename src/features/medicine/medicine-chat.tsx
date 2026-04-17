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
  Pill,
  Zap,
  AlertTriangle,
  Baby,
  WifiOff,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: "medicine-ai";
  timestamp: number;
  isError?: boolean;
}

interface UsageInfo {
  remaining: number;
  limit: number;
}

const suggestedPrompts = [
  {
    icon: Pill,
    label: "Ibuprofen vs Tylenol",
    prompt: "What's the difference between ibuprofen and acetaminophen? When should I use each one?",
  },
  {
    icon: Zap,
    label: "Drug interactions",
    prompt: "Can I take ibuprofen and acetaminophen together? Are there any risks?",
  },
  {
    icon: AlertTriangle,
    label: "Side effects",
    prompt: "What are the common side effects of omeprazole (Prilosec) and when should I be concerned?",
  },
  {
    icon: Baby,
    label: "Children's dosing",
    prompt: "How do I figure out the right dose of children's acetaminophen for my child?",
  },
];

export function MedicineChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchUsage = useCallback(() => {
    fetch("/api/medicine-info")
      .then((r) => r.json())
      .then((data) => setUsage({ remaining: data.remaining, limit: data.limit }))
      .catch((err) => {
        console.warn("Failed to fetch medicine usage:", err);
      });
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
      const stored: StoredMessage[] = allMessages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.source ? { source: m.source } : {}),
        timestamp: m.timestamp,
      }));

      try {
        if (!conversationIdRef.current) {
          conversationIdRef.current = await createConversation(user.uid, stored, "medicine-info");
        } else {
          await updateConversation(user.uid, conversationIdRef.current, stored);
        }
      } catch (err) {
        console.warn("Failed to save medicine conversation:", err);
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
      const res = await fetch("/api/medicine-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => !m.isError)
            .map((m) => ({
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
        source: "medicine-ai",
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveConversation(finalMessages);
    } catch {
      const errorContent = apiError || genericError;
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: errorContent, timestamp: Date.now(), isError: true },
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
  }

  const isRateLimited = usage !== null && usage.remaining <= 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-white overflow-hidden flex flex-col" style={{ height: "min(600px, 65vh)" }}>
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-surface/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-lavender/10 flex items-center justify-center">
            <Pill className="w-4 h-4 text-accent-lavender" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Medicine AI</p>
            <p className="text-[11px] text-muted">Ask about medications, dosages & interactions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {usage && (
            <span className="text-[11px] text-muted tabular-nums">
              {usage.remaining}/{usage.limit} left
            </span>
          )}
          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
              title="New conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-lavender/10 flex items-center justify-center mb-3">
              <Pill className="w-6 h-6 text-accent-lavender" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1">
              Medicine Information
            </h3>
            <p className="text-sm text-muted max-w-sm mb-5">
              Ask about medications, dosages, side effects, or drug interactions.
              I&apos;ll provide helpful information to discuss with your healthcare provider.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {suggestedPrompts.map((s) => {
                const SIcon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.prompt)}
                    disabled={isRateLimited}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface hover:bg-surface/80 border border-border/40 text-left transition-colors disabled:opacity-50"
                  >
                    <SIcon className="w-4 h-4 text-accent-lavender flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                source={m.source}
              />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/60 p-3 bg-surface/30">
        {isRateLimited ? (
          <div className="flex items-center gap-2 justify-center py-2 text-sm text-muted">
            <WifiOff className="w-4 h-4" />
            <span>Daily AI limit reached. Resets at midnight UTC.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                user?.isAnonymous
                  ? "Sign in to save conversations..."
                  : "Ask about a medication..."
              }
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border/60 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-light outline-none focus:border-accent-lavender/50 focus:ring-2 focus:ring-accent-lavender/10 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-lavender text-white flex items-center justify-center hover:bg-accent-lavender/90 disabled:opacity-40 disabled:hover:bg-accent-lavender transition-colors"
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-pulse" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
