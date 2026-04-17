"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import {
  listConversations,
  deleteConversation,
  type ConversationPreview,
  type ConversationType,
} from "@/lib/firebase/conversations";
import { TransitionLink } from "@/components/ui/transition-provider";
import { cn } from "@/lib/utils";
import {
  Clock,
  MessageSquare,
  Trash2,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Phone,
  Sparkles,
  Loader2,
  Stethoscope,
  ChevronRight,
  X,
  HeartPulse,
  Pill,
} from "lucide-react";

const severityMeta: Record<
  string,
  { label: string; icon: typeof ShieldCheck; className: string; dot: string; iconBg: string }
> = {
  low: {
    label: "Low Severity",
    icon: ShieldCheck,
    className: "text-accent-mint",
    dot: "bg-accent-mint",
    iconBg: "bg-accent-mint/10 text-accent-mint",
  },
  moderate: {
    label: "Moderate",
    icon: AlertCircle,
    className: "text-amber-500",
    dot: "bg-amber-500",
    iconBg: "bg-amber-50 text-amber-500",
  },
  high: {
    label: "High Severity",
    icon: AlertTriangle,
    className: "text-orange-500",
    dot: "bg-orange-500",
    iconBg: "bg-orange-50 text-orange-500",
  },
  emergency: {
    label: "Emergency",
    icon: Phone,
    className: "text-red-500",
    dot: "bg-red-500",
    iconBg: "bg-red-50 text-red-500",
  },
};

export function ConversationList() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ConversationType | "all">("all");

  const load = useCallback(async () => {
    if (!user?.uid || user.isAnonymous) {
      setLoading(false);
      return;
    }
    try {
      const list = await listConversations(user.uid);
      setConversations(list);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!user?.uid) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteConversation(user.uid, id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      setDeleteError("Failed to delete conversation. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-muted animate-spin" />
      </div>
    );
  }

  if (user?.isAnonymous) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-accent-lavender/10 flex items-center justify-center mb-4">
          <Clock className="w-7 h-7 text-accent-lavender" />
        </div>
        <h3 className="font-heading text-lg text-foreground mb-1">
          Sign in to save history
        </h3>
        <p className="text-sm text-muted max-w-sm">
          Guest accounts don&apos;t save conversation history. Create an account
          to keep track of your symptom checks.
        </p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-accent-coral/10 flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-accent-coral" />
        </div>
        <h3 className="font-heading text-lg text-foreground mb-1">
          No conversations yet
        </h3>
        <p className="text-sm text-muted max-w-sm mb-5">
          Start a symptom check and your conversations will appear here for
          future reference.
        </p>
        <TransitionLink
          href="/symptom-checker"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-coral text-white text-sm font-medium hover:bg-accent-coral/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Start Symptom Check
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {([
          { key: "all" as const, label: "All", icon: MessageSquare },
          { key: "symptom-checker" as const, label: "Symptom Checks", icon: Stethoscope },
          { key: "first-aid" as const, label: "First Aid", icon: HeartPulse },
          { key: "medicine-info" as const, label: "Medicine", icon: Pill },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors",
              filter === key
                ? "bg-dark text-white"
                : "bg-surface text-muted hover:text-foreground"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {deleteError && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="text-red-400 hover:text-red-600 ml-3">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {(() => {
        const filtered = conversations.filter((c) => filter === "all" || c.type === filter);
        if (filtered.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-sm text-muted">No conversations match this filter.</p>
              <button
                onClick={() => setFilter("all")}
                className="mt-3 text-xs text-accent-coral hover:underline"
              >
                Show all conversations
              </button>
            </div>
          );
        }
        return filtered.map((convo) => (
          <ConversationCard
            key={convo.id}
            conversation={convo}
            onDelete={() => handleDelete(convo.id)}
            isDeleting={deletingId === convo.id}
          />
        ));
      })()}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Conversation Card                                                 */
/* ------------------------------------------------------------------ */

function ConversationCard({
  conversation,
  onDelete,
  isDeleting,
}: {
  conversation: ConversationPreview;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const sev = conversation.highestSeverity;
  const meta = sev ? severityMeta[sev] : null;
  const SevIcon = meta?.icon;

  return (
    <div className="group rounded-2xl border border-border/60 bg-white hover:border-border hover:shadow-soft transition-all duration-200 overflow-hidden">
      <TransitionLink
        href={`/history/${conversation.id}`}
        className="flex items-center gap-4 p-4 sm:p-5"
      >
        {/* Left icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            conversation.type === "first-aid"
              ? "bg-accent-coral/10 text-accent-coral"
              : conversation.type === "medicine-info"
              ? "bg-accent-lavender/10 text-accent-lavender"
              : meta ? meta.iconBg : "bg-accent-lavender/10 text-accent-lavender"
          )}
        >
          {conversation.type === "first-aid" ? (
            <HeartPulse className="w-5 h-5" />
          ) : conversation.type === "medicine-info" ? (
            <Pill className="w-5 h-5" />
          ) : SevIcon ? (
            <SevIcon className="w-5 h-5" />
          ) : (
            <Stethoscope className="w-5 h-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate leading-snug">
            {conversation.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            {meta && (
              <span className={cn("flex items-center gap-1 text-[11px] font-semibold", meta.className)}>
                <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
                {meta.label}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted">
              <MessageSquare className="w-3 h-3" />
              {conversation.messageCount}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock className="w-3 h-3" />
              {formatRelativeDate(conversation.updatedAt)}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className="p-2 rounded-xl text-transparent group-hover:text-muted hover:!text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
            title="Delete conversation"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
          <ChevronRight className="w-4 h-4 text-muted/30 group-hover:text-muted transition-colors" />
        </div>
      </TransitionLink>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
