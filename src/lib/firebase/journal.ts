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

export async function createJournalEntry(
  uid: string,
  entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(journalCollection(uid), {
    ...entry,
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
  const docRef = doc(db, "users", uid, "journal", entryId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteJournalEntry(uid: string, entryId: string): Promise<void> {
  const docRef = doc(db, "users", uid, "journal", entryId);
  await deleteDoc(docRef);
}

export async function getJournalEntries(uid: string): Promise<JournalEntry[]> {
  const q = query(journalCollection(uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      content: data.content ?? "",
      mood: data.mood ?? "okay",
      tags: data.tags ?? [],
      date: data.date ?? "",
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : Date.now(),
    };
  });
}
