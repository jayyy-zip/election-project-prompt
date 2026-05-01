/**
 * firebase.ts — Firebase initialization with graceful degradation.
 *
 * If NEXT_PUBLIC_FIREBASE_* env vars are absent, Firebase is skipped and
 * the app falls back to localStorage for any persistence needs.
 *
 * To enable Firebase, add these to .env.local:
 *   NEXT_PUBLIC_FIREBASE_API_KEY=...
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
 *   NEXT_PUBLIC_FIREBASE_APP_ID=...
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;

const firebaseConfig = {
  apiKey:      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:   process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId:       process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Returns true when all required Firebase env vars are present */
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

/** Initialize (idempotent — safe to call multiple times) */
export function initFirebase(): { app: FirebaseApp; db: Firestore } | null {
  if (typeof window === "undefined") return null; // server-side: skip
  if (!isFirebaseConfigured()) return null;

  if (!firebaseApp) {
    firebaseApp = getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
  }

  return { app: firebaseApp, db: db! };
}

/** Get Firestore instance (null if Firebase not configured) */
export function getDb(): Firestore | null {
  const result = initFirebase();
  return result?.db ?? null;
}
