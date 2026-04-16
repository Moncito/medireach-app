"use client";

import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/gemini";
import type { MessageSource } from "@/lib/firebase/conversations";
import { useAuth } from "@/features/auth/auth-provider";
import { getInitials } from "@/lib/firebase/auth";
import {
  Stethoscope,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  Phone,
  Zap,
  Cpu,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  severity?: Severity;
  source?: MessageSource;
  isLatest?: boolean;
}

const severityConfig = {
  low: {
    label: "Low Severity",
    description: "Likely manageable with self-care",
    icon: ShieldCheck,
    bg: "bg-accent-mint/10",
    border: "border-accent-mint/20",
    text: "text-accent-mint",
    dot: "bg-accent-mint",
  },
  moderate: {
    label: "Moderate Severity",
    description: "Consider seeing a doctor within a few days",
    icon: AlertCircle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  high: {
    label: "High Severity",
    description: "See a doctor as soon as possible",
    icon: AlertTriangle,
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    dot: "bg-orange-500",
  },
  emergency: {
    label: "Emergency",
    description: "Seek immediate medical attention",
    icon: Phone,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    dot: "bg-red-500",
  },
};

export function MessageBubble({
  role,
  content,
  severity,
  source,
  isLatest,
}: MessageBubbleProps) {
  const { user } = useAuth();
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-3xl",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
        isLatest && "animate-fade-in"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          isUser
            ? "bg-gradient-to-br from-accent-lavender to-accent-lavender-light"
            : "bg-gradient-to-br from-accent-coral to-accent-coral-light"
        )}
      >
        {isUser ? (
          <span className="text-[10px] font-bold text-white">
            {getInitials(user)}
          </span>
        ) : (
          <Stethoscope className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content */}
      <div className={cn("flex flex-col gap-2 min-w-0", isUser ? "items-end" : "items-start")}>
        {/* Source badge for assistant messages */}
        {!isUser && source && (
          <SourceBadge source={source} />
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[min(480px,85vw)]",
            isUser
              ? "bg-foreground text-white rounded-br-md"
              : "bg-white border border-border/60 text-foreground rounded-bl-md shadow-soft"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm prose-neutral max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ol]:mb-2 [&>li]:mb-0.5">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Severity badge */}
        {severity && severityConfig[severity] && (
          <SeverityBadge severity={severity} />
        )}
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: NonNullable<Severity> }) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 animate-fade-in",
        config.bg,
        config.border
      )}
    >
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bg)}>
        <Icon className={cn("w-4 h-4", config.text)} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
          <span className={cn("text-xs font-semibold", config.text)}>
            {config.label}
          </span>
        </div>
        <p className="text-[11px] text-muted mt-0.5">{config.description}</p>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-3xl mr-auto animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-coral to-accent-coral-light flex items-center justify-center flex-shrink-0 mt-1">
        <Stethoscope className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-border/60 rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted/40 animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-muted/40 animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-muted/40 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Source Badge                                                      */
/* ------------------------------------------------------------------ */

const sourceConfig = {
  emergency: {
    label: "Emergency Detection",
    icon: Zap,
    className: "bg-red-50 text-red-600",
  },
  rules: {
    label: "Quick Triage",
    icon: Cpu,
    className: "bg-accent-mint/10 text-accent-mint",
  },
  ai: {
    label: "Gemini AI",
    icon: Sparkles,
    className: "bg-accent-lavender/10 text-accent-lavender",
  },
  "first-aid-ai": {
    label: "First Aid AI",
    icon: Sparkles,
    className: "bg-accent-coral/10 text-accent-coral",
  },
};

const defaultSourceConfig = {
  label: "AI",
  icon: HelpCircle,
  className: "bg-surface text-muted",
};

function SourceBadge({ source }: { source: MessageSource }) {
  const config = sourceConfig[source] ?? defaultSourceConfig;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
        config.className
      )}
    >
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
}
