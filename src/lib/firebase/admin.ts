/**
 * Firebase Admin SDK — server-side only.
 * Used for privileged operations like Firestore rate limiting.
 *
 * Required env vars:
 *   FIREBASE_ADMIN_PROJECT_ID
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY  (newlines as \n)
 */

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function createAdminApp(): App {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in your environment."
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

function getAdminApp(): App {
  const apps = getApps();
  return apps.length > 0 ? apps[0] : createAdminApp();
}

export const adminDb = getFirestore(getAdminApp());
