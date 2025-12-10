import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isConfigValid = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
].every((value) => typeof value === "string" && value.length > 0);

let firebaseApp: FirebaseApp | undefined;

if (getApps().length > 0) {
  firebaseApp = getApps()[0]!;
} else if (isConfigValid) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "Firebase configuration is incomplete. Client SDK features will remain disabled until NEXT_PUBLIC_FIREBASE_* variables are provided."
    );
  }
}

export { firebaseApp };

export const isFirebaseConfigured = Boolean(firebaseApp);
export const missingFirebaseClientMessage =
  "Firebase is not configured. Please update the NEXT_PUBLIC_FIREBASE_* environment variables.";
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : undefined;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : undefined;
export const storage = firebaseApp ? getStorage(firebaseApp) : undefined;

export const initAnalytics = async () => {
  if (typeof window === "undefined" || !firebaseApp) {
    return undefined;
  }

  const supported = await isAnalyticsSupported();
  if (!supported) {
    return undefined;
  }

  return getAnalytics(firebaseApp);
};
