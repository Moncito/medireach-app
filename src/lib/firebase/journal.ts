import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export type Mood = "great" | "good" | "okay" | "poor" | "bad";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: number;
  updatedAt: number;
}

export const MOOD_CONFIG: Record<Mood, { emoji: string; label: string; color: string }> = {
  great: { emoji: "😄", label: "Great", color: "#10B981" },
  good: { emoji: "🙂", label: "Good", color: "#6EE7B7" },
  okay: { emoji: "😐", label: "Okay", color: "#FBBF24" },
  poor: { emoji: "😞", label: "Poor", color: "#FB923C" },
  bad: { emoji: "😣", label: "Bad", color: "#EF4444" },
};

export const JOURNAL_TAGS = [
  "Symptoms",
  "Medication",
  "Exercise",
  "Sleep",
  "Diet",
  "Mental Health",
  "Appointment",
  "Recovery",
  "Allergy",
  "Chronic Pain",
];

/* ------------------------------------------------------------------ */
/*  CRUD                                                              */
/* ------------------------------------------------------------------ */

function journalCollection(uid: string) {
  return collection(db, "users", uid, "journal");
}

const VALID_MOODS: Mood[] = ["great", "good", "okay", "poor", "bad"];
const MAX_TITLE = 100;
const MAX_CONTENT = 2000;

function validateEntry(entry: { title?: string; content?: string; mood?: string; tags?: string[]; date?: string }) {
  if (entry.title !== undefined) {
    if (typeof entry.title !== "string" || entry.title.length > MAX_TITLE) throw new Error("Title is required and must be under 100 characters.");
  }
  if (entry.content !== undefined) {
    if (typeof entry.content !== "string" || entry.content.length > MAX_CONTENT) throw new Error("Content is required and must be under 2000 characters.");
  }
  if (entry.mood !== undefined) {
    if (!VALID_MOODS.includes(entry.mood as Mood)) throw new Error("Invalid mood value.");
  }
  if (entry.tags !== undefined) {
    if (!Array.isArray(entry.tags) || !entry.tags.every((t) => typeof t === "string" && JOURNAL_TAGS.includes(t))) throw new Error("Invalid tags.");
  }
  if (entry.date !== undefined) {
    if (typeof entry.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) throw new Error("Invalid date format.");
  }
}

export async function createJournalEntry(
  uid: string,
  entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  validateEntry(entry);
  const docRef = await addDoc(journalCollection(uid), {
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    tags: entry.tags,
    date: entry.date,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateJournalEntry(
  uid: string,
  entryId: string,
  data: Partial<Omit<JournalEntry, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  validateEntry(data);
  const docRef = doc(db, "users", uid, "journal", entryId);
  const { ...fields } = data;
  await updateDoc(docRef, { ...fields, updatedAt: serverTimestamp() });
}

export async function deleteJournalEntry(uid: string, entryId: string): Promise<void> {
  const docRef = doc(db, "users", uid, "journal", entryId);
  await deleteDoc(docRef);
}

export async function getJournalEntries(uid: string): Promise<JournalEntry[]> {
  // Safe to order by createdAt only: createJournalEntry() always sets createdAt via
  // serverTimestamp() and updateJournalEntry() preserves it, so documents without
  // createdAt should not exist in normal flows.
  const q = query(journalCollection(uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => {
      const data = d.data();
      const mood = VALID_MOODS.includes(data.mood) ? (data.mood as Mood) : "okay";
      const tags = Array.isArray(data.tags)
        ? data.tags.filter((t: unknown) => typeof t === "string")
        : [];
      return {
        id: d.id,
        title: typeof data.title === "string" ? data.title : "",
        content: typeof data.content === "string" ? data.content : "",
        mood,
        tags,
        date: typeof data.date === "string" ? data.date : "",
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : 0,
      };
    })
    .filter((e) => e.title && e.content);
}
