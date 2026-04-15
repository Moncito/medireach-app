import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  linkWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const googleProvider = new GoogleAuthProvider();

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const currentUser = auth.currentUser;
  let credential;

  if (currentUser?.isAnonymous) {
    // Link anonymous account to email/password
    const emailCred = EmailAuthProvider.credential(email, password);
    credential = await linkWithCredential(currentUser, emailCred);
  } else {
    credential = await createUserWithEmailAndPassword(auth, email, password);
  }

  await updateProfile(credential.user, { displayName });
  return credential;
}

export async function signInWithGoogle() {
  const currentUser = auth.currentUser;

  if (currentUser?.isAnonymous) {
    // Link anonymous account to Google
    return linkWithPopup(currentUser, googleProvider);
  }
  return signInWithPopup(auth, googleProvider);
}

export async function signInAsGuest() {
  return signInAnonymously(auth);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function getInitials(user: User | null): string {
  if (!user) return "?";
  const name = user.displayName?.trim();
  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (user.email) return user.email[0].toUpperCase();
  return "G";
}
