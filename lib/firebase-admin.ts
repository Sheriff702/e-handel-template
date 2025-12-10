import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let adminApp: App | undefined;

const getServiceAccount = () => {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    return undefined;
  }

  try {
    return typeof key === "string" ? JSON.parse(key) : key;
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", error);
    return undefined;
  }
};

export const getAdminApp = () => {
  if (adminApp) {
    return adminApp;
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    return undefined;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  return adminApp;
};

export const getAdminDb = () => {
  const app = getAdminApp();
  return app ? getFirestore(app) : undefined;
};

export const getAdminStorage = () => {
  const app = getAdminApp();
  return app ? getStorage(app) : undefined;
};
