"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { getConversation, type Conversation } from "@/lib/firebase/conversations";
import { MessageBubble } from "@/features/symptom-checker/message-bubble";
import { TransitionLink } from "@/components/ui/transition-provider";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  Loader2,
} from "lucide-react";

export function ConversationDetail({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    getConversation(user.uid, conversationId)
      .then((convo) => {
        if (!convo) {
          setError("Conversation not found");
        } else {
          setConversation(convo);
        }
      })
      .catch(() => setError("Failed to load conversation"))
      .finally(() => setLoading(false));
  }, [user, conversationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-muted animate-spin" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <p className="text-sm text-muted mb-4">{error ?? "Something went wrong"}</p>
        <TransitionLink
          href="/history"
          className="inline-flex items-center gap-2 text-sm text-accent-coral hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-xl px-4 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <TransitionLink
            href="/history"
            className="p-2 -ml-2 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </TransitionLink>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-foreground truncate">
              {conversation.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {conversation.messageCount} messages
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {conversation.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages (read-only) */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        <div className="space-y-5 max-w-3xl mx-auto">
          {conversation.messages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg.role}
              content={msg.content}
              severity={msg.severity ?? undefined}
              source={msg.source}
              isLatest={false}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/60 bg-white/80 backdrop-blur-xl px-4 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-muted/50">
            This is a past conversation — read only.
          </p>
          <TransitionLink
            href="/symptom-checker"
            className="text-xs font-medium text-accent-coral hover:text-accent-coral/80 transition-colors"
          >
            Start new check →
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
