import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Severity } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  severity?: Severity;
  source?: "emergency" | "rules" | "ai";
  timestamp: number; // epoch ms — lightweight, easy to serialize
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  highestSeverity: Severity;
  messages: StoredMessage[];
}

export interface ConversationPreview {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  highestSeverity: Severity;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const SEVERITY_RANK: Record<string, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  emergency: 4,
};

function higherSeverity(a: Severity, b: Severity): Severity {
  const ra = a ? SEVERITY_RANK[a] ?? 0 : 0;
  const rb = b ? SEVERITY_RANK[b] ?? 0 : 0;
  return ra >= rb ? a : b;
}

/** Derive a short title from the first user message */
function deriveTitle(firstUserMessage: string): string {
  const clean = firstUserMessage.replace(/\s+/g, " ").trim();
  if (clean.length <= 50) return clean;
  return clean.slice(0, 47) + "...";
}

function conversationsRef(userId: string) {
  return collection(db, "users", userId, "conversations");
}

function toDate(ts: Timestamp | { seconds: number } | Date | undefined): Date {
  if (!ts) return new Date();
  if (ts instanceof Timestamp) return ts.toDate();
  if (ts instanceof Date) return ts;
  if ("seconds" in ts) return new Date(ts.seconds * 1000);
  return new Date();
}

/* ------------------------------------------------------------------ */
/*  CRUD                                                             */
/* ------------------------------------------------------------------ */

/** Create a new conversation and return its ID */
export async function createConversation(
  userId: string,
  messages: StoredMessage[]
): Promise<string> {
  const firstUserMsg = messages.find((m) => m.role === "user");
  const title = firstUserMsg ? deriveTitle(firstUserMsg.content) : "New conversation";
  const highestSev = messages.reduce<Severity>(
    (acc, m) => higherSeverity(acc, m.severity ?? null),
    null
  );

  const docRef = await addDoc(conversationsRef(userId), {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    messageCount: messages.length,
    highestSeverity: highestSev,
    messages,
  });

  return docRef.id;
}

/** Append new messages to an existing conversation */
export async function updateConversation(
  userId: string,
  conversationId: string,
  messages: StoredMessage[],
  newSeverity?: Severity
): Promise<void> {
  if (messages.length > 100) {
    throw new Error("Conversation exceeds maximum of 100 messages");
  }

  const ref = doc(db, "users", userId, "conversations", conversationId);

  const highestSev = messages.reduce<Severity>(
    (acc, m) => higherSeverity(acc, m.severity ?? null),
    newSeverity ?? null
  );

  await updateDoc(ref, {
    updatedAt: serverTimestamp(),
    messageCount: messages.length,
    highestSeverity: highestSev,
    messages,
  });
}

/** List conversations (most recent first), lightweight — no messages array */
export async function listConversations(
  userId: string,
  maxResults = 30
): Promise<ConversationPreview[]> {
  const q = query(
    conversationsRef(userId),
    orderBy("updatedAt", "desc"),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data() as DocumentData;
    return {
      id: d.id,
      title: data.title ?? "Untitled",
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
      messageCount: data.messageCount ?? 0,
      highestSeverity: data.highestSeverity ?? null,
    };
  });
}

/** Get a full conversation with messages */
export async function getConversation(
  userId: string,
  conversationId: string
): Promise<Conversation | null> {
  const ref = doc(db, "users", userId, "conversations", conversationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as DocumentData;
  return {
    id: snap.id,
    title: data.title ?? "Untitled",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    messageCount: data.messageCount ?? 0,
    highestSeverity: data.highestSeverity ?? null,
    messages: (data.messages ?? []) as StoredMessage[],
  };
}

/** Delete a conversation */
export async function deleteConversation(
  userId: string,
  conversationId: string
): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "conversations", conversationId));
}
