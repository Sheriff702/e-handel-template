import "dotenv/config";
import { getAdminApp } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";

async function setAdminClaim(uid: string) {
  const app = getAdminApp();
  if (!app) {
    throw new Error("Firebase Admin is not initialised. Provide FIREBASE_SERVICE_ACCOUNT_KEY.");
  }

  const auth = getAuth(app);
  await auth.setCustomUserClaims(uid, { admin: true });
  console.info(`Admin claim set for ${uid}`);
  await app.delete();
}

const uid = process.argv[2];
if (!uid) {
  console.error("Usage: tsx scripts/setAdminClaim.ts <UID>");
  process.exit(1);
}

setAdminClaim(uid).catch((error) => {
  console.error(error);
  process.exit(1);
});
