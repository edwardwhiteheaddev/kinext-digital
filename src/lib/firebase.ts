/**
  * File: src/lib/firebase.ts
  * Purpose: Initializes the Firebase app.
  */
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}');

// Initialize Firebase only if no app exists yet
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { firebaseApp };