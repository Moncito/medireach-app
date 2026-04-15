import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { User } from "firebase/auth";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: string;
  createdAt: Date;
  lastLoginAt: Date;
}

/* ------------------------------------------------------------------ */
/*  Core                                                              */
/* ------------------------------------------------------------------ */

/**
 * Ensures a user document exists in Firestore.
 * - First login → creates the document.
 * - Subsequent logins → updates lastLoginAt + any changed profile fields.
 * Skips anonymous users (they get a doc when they upgrade).
 */
export async function ensureUserDocument(user: User): Promise<void> {
  if (user.isAnonymous) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const provider =
    user.providerData[0]?.providerId ?? "unknown";

  if (!snap.exists()) {
    // First time — create
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName ?? null,
      email: user.email ?? null,
      photoURL: user.photoURL ?? null,
      provider,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  } else {
    // Returning user — update login timestamp + any profile changes
    await updateDoc(ref, {
      displayName: user.displayName ?? null,
      email: user.email ?? null,
      photoURL: user.photoURL ?? null,
      provider,
      lastLoginAt: serverTimestamp(),
    });
  }
}
