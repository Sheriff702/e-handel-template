import "dotenv/config";
import { getAdminApp, getAdminDb } from "@/lib/firebase-admin";
import { defaultCategories, defaultProducts, defaultSettings } from "@/data/seed-data";

async function seed() {
  const app = getAdminApp();
  const db = getAdminDb();
  if (!app || !db) {
    throw new Error("Firebase Admin is not initialised. Provide FIREBASE_SERVICE_ACCOUNT_KEY.");
  }

  console.info("Seeding categories...");
  for (const category of defaultCategories) {
    await db.collection("categories").doc(category.id).set({
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.info("Seeding products...");
  for (const product of defaultProducts) {
    const docRef = db.collection("products").doc(product.id);
    await docRef.set({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.info("Seeding site settings...");
  await db.collection("siteSettings").doc("singleton").set({
    ...defaultSettings,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.info("Seed complete");
  await app.delete();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
