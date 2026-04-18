"use client";

import { useState, type FormEvent } from "react";
import { X, Save, Loader2 } from "lucide-react";
import {
  type Mood,
  type JournalEntry,
  MOOD_CONFIG,
  JOURNAL_TAGS,
} from "@/lib/firebase/journal";

interface JournalFormProps {
  initial?: JournalEntry;
  onSave: (data: { title: string; content: string; mood: Mood; tags: string[]; date: string }) => Promise<void>;
  onCancel: () => void;
}

export function JournalForm({ initial, onSave, onCancel }: JournalFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [mood, setMood] = useState<Mood>(initial?.mood ?? "okay");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [date, setDate] = useState(() => {
    if (initial?.date) return initial.date;
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date + "T00:00:00").getTime())) {
      setError("Please enter a valid date.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({ title: title.trim(), content: content.trim(), mood, tags, date });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">
          {initial ? "Edit Entry" : "New Journal Entry"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Date */}
      <div>
        <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-border/60 bg-white px-4 py-2.5 text-sm outline-none focus:border-accent-coral/40 focus:ring-2 focus:ring-accent-coral/10 transition-all"
        />
      </div>

      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">
          Title
        </label>
        <input
          type="text"
          placeholder="How are you feeling today?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full rounded-xl border border-border/60 bg-white px-4 py-2.5 text-sm outline-none focus:border-accent-coral/40 focus:ring-2 focus:ring-accent-coral/10 transition-all"
        />
      </div>

      {/* Mood */}
      <div>
        <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">
          Mood
        </label>
        <div className="flex gap-2">
          {(Object.entries(MOOD_CONFIG) as [Mood, typeof MOOD_CONFIG[Mood]][]).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMood(key)}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 transition-all ${
                mood === key
                  ? "bg-white shadow-card border border-border/60 scale-105"
                  : "bg-surface/50 hover:bg-surface border border-transparent"
              }`}
            >
              <span className="text-xl">{config.emoji}</span>
              <span className="text-[10px] font-medium text-muted">{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">
          Notes
        </label>
        <textarea
          placeholder="Write about your health, symptoms, medications, or anything on your mind..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          maxLength={2000}
          className="w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm outline-none focus:border-accent-coral/40 focus:ring-2 focus:ring-accent-coral/10 transition-all resize-none"
        />
        <p className="text-right text-[10px] text-muted-light mt-1">{content.length}/2000</p>
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {JOURNAL_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                tags.includes(tag)
                  ? "bg-accent-coral text-white"
                  : "bg-surface text-muted hover:bg-surface/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !title.trim() || !content.trim()}
          className="btn-primary flex-1"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : initial ? "Update Entry" : "Save Entry"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
