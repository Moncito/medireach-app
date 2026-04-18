"use client";

import { type JournalEntry, MOOD_CONFIG } from "@/lib/firebase/journal";
import { Trash2, Edit3, Calendar } from "lucide-react";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function JournalEntryCard({ entry, onEdit, onDelete }: JournalEntryCardProps) {
  const moodConfig = MOOD_CONFIG[entry.mood];

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5 transition-all hover:shadow-soft group">
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{moodConfig.emoji}</span>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground leading-tight">
              {entry.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-3 w-3 text-muted-light" />
              <span className="text-xs text-muted">
                {(() => {
                  const [y, m, d] = entry.date.split("-").map(Number);
                  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                })()}
              </span>
              <span
                className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: `${moodConfig.color}15`, color: moodConfig.color }}
              >
                {moodConfig.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
            aria-label={`Edit entry: ${entry.title}`}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label={`Delete entry: ${entry.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-muted leading-relaxed line-clamp-3">{entry.content}</p>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
