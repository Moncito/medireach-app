"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import {
  type JournalEntry,
  type Mood,
  MOOD_CONFIG,
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/lib/firebase/journal";
import { JournalForm } from "@/features/journal/journal-form";
import { JournalEntryCard } from "@/features/journal/journal-entry-card";
import {
  BookOpen,
  Plus,
  Loader2,
  Search,
  Filter,
  CalendarDays,
} from "lucide-react";

type FilterMood = Mood | "all";

export default function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMood, setFilterMood] = useState<FilterMood>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!user?.uid || user.isAnonymous) return;
    setLoading(true);
    try {
      const data = await getJournalEntries(user.uid);
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch journal entries:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSave = useCallback(
    async (data: { title: string; content: string; mood: Mood; tags: string[]; date: string }) => {
      if (!user?.uid) return;

      if (editingEntry) {
        await updateJournalEntry(user.uid, editingEntry.id, data);
      } else {
        await createJournalEntry(user.uid, data);
      }

      setShowForm(false);
      setEditingEntry(null);
      await fetchEntries();
    },
    [user, editingEntry, fetchEntries]
  );

  const handleEdit = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!user?.uid) return;
      if (deleteConfirm !== id) {
        setDeleteConfirm(id);
        return;
      }
      try {
        await deleteJournalEntry(user.uid, id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        console.error("Failed to delete entry:", err);
      }
      setDeleteConfirm(null);
    },
    [user, deleteConfirm]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingEntry(null);
  }, []);

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (filterMood !== "all") {
      result = result.filter((e) => e.mood === filterMood);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [entries, filterMood, searchQuery]);

  // Group entries by month
  const groupedEntries = useMemo(() => {
    const groups: { month: string; entries: JournalEntry[] }[] = [];
    const map = new Map<string, JournalEntry[]>();

    filteredEntries.forEach((entry) => {
      const [yr, mo] = entry.date.split("-").map(Number);
      const d = new Date(yr, mo - 1, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(entry);
    });

    map.forEach((items, key) => {
      const [y, m] = key.split("-");
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      });
      groups.push({ month: label, entries: items });
    });

    return groups;
  }, [filteredEntries]);

  // Guest state
  if (user?.isAnonymous) {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-3xl bg-accent-mint/10 flex items-center justify-center mb-6">
            <BookOpen className="w-7 h-7 text-accent-mint" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-3">Health Journal</h1>
          <p className="text-muted max-w-md mb-6">
            Create an account to start tracking your health journey with personal journal entries.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-mint/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-accent-mint" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">Health Journal</h1>
            <p className="text-sm text-muted">
              {loading ? "Loading..." : `${entries.length} entries`}
            </p>
          </div>
        </div>

        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-border/60 bg-white p-6 shadow-soft">
          <JournalForm
            initial={editingEntry ?? undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Search + Mood filter */}
      {!showForm && entries.length > 0 && (
        <div className="mb-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent-mint/40 focus:ring-2 focus:ring-accent-mint/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="h-4 w-4 text-muted shrink-0" />
            <button
              onClick={() => setFilterMood("all")}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                filterMood === "all"
                  ? "bg-accent-mint text-white shadow-sm"
                  : "bg-surface text-muted hover:bg-surface/80"
              }`}
            >
              All Moods
            </button>
            {(Object.entries(MOOD_CONFIG) as [Mood, typeof MOOD_CONFIG[Mood]][]).map(
              ([key, config]) => (
                <button
                  key={key}
                  onClick={() => setFilterMood(key)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    filterMood === key
                      ? "bg-accent-mint text-white shadow-sm"
                      : "bg-surface text-muted hover:bg-surface/80"
                  }`}
                >
                  {config.emoji} {config.label}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent-mint animate-spin mb-3" />
          <p className="text-sm text-muted">Loading your journal...</p>
        </div>
      ) : entries.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-accent-mint/10 flex items-center justify-center mb-6">
            <CalendarDays className="w-7 h-7 text-accent-mint" />
          </div>
          <h2 className="font-heading text-xl font-bold mb-2">No entries yet</h2>
          <p className="text-muted max-w-md mb-6">
            Start tracking your health journey by creating your first journal entry.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Create First Entry
          </button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="w-8 h-8 text-muted-light mb-3" />
          <p className="text-sm text-muted">No entries match your search.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedEntries.map((group) => (
            <div key={group.month}>
              <h3 className="font-heading text-sm font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {group.month}
              </h3>
              <div className="space-y-3">
                {group.entries.map((entry) => (
                  <div key={entry.id} className="relative">
                    <JournalEntryCard
                      entry={entry}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                    {deleteConfirm === entry.id && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3 z-10">
                        <p className="text-sm text-muted mr-2">Delete this entry?</p>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="rounded-xl bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded-xl bg-surface text-muted px-4 py-2 text-sm font-medium hover:bg-surface/80 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
