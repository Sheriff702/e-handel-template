import "server-only";
import { cache } from "react";
import type { QuerySnapshot as AdminQuerySnapshot } from "firebase-admin/firestore";
import type { QuerySnapshot as ClientQuerySnapshot } from "firebase/firestore";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { getAdminDb } from "@/lib/firebase-admin";
import { defaultProducts, defaultCategories, defaultSettings } from "@/data/seed-data";
import type { Product, Category, SiteSettings } from "@/types/catalog";

type AnySnapshot = AdminQuerySnapshot | ClientQuerySnapshot;

const mapSnapshot = <T>(snapshot: AnySnapshot) => {
  const docs: T[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    docs.push({ id: doc.id, ...data } as T);
  });
  return docs;
};

export const getActiveProducts = cache(async (): Promise<Product[]> => {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snapshot = await adminDb
        .collection("products")
        .where("active", "==", true)
        .orderBy("createdAt", "desc")
        .get();
      const docs = mapSnapshot<Product>(snapshot as unknown as AnySnapshot);
      if (docs.length > 0) {
        return docs;
      }
    }
  } catch (error) {
    console.warn("Admin product fetch failed, falling back to client SDK", error);
  }

  if (firestore) {
    try {
      const productsQuery = query(
        collection(firestore, "products"),
        where("active", "==", true),
        orderBy("createdAt", "desc"),
        limit(24)
      );
      const snapshot = await getDocs(productsQuery);
      const docs = mapSnapshot<Product>(snapshot as unknown as AnySnapshot);
      if (docs.length > 0) {
        return docs;
      }
    } catch (error) {
      console.warn("Client product fetch failed, using defaults", error);
    }
  } else {
    console.warn("Firebase client not configured. Using seeded products.");
  }

  return defaultProducts;
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | undefined> => {
  const products = await getActiveProducts();
  return products.find((product) => product.slug === slug);
});

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snapshot = await adminDb.collection("categories").orderBy("sort", "asc").get();
      const docs = mapSnapshot<Category>(snapshot as unknown as AnySnapshot);
      if (docs.length > 0) {
        return docs;
      }
    }
  } catch (error) {
    console.warn("Admin category fetch failed", error);
  }

  if (firestore) {
    try {
      const snapshot = await getDocs(collection(firestore, "categories"));
      const docs = mapSnapshot<Category>(snapshot as unknown as AnySnapshot);
      if (docs.length > 0) {
        return docs;
      }
    } catch (error) {
      console.warn("Client category fetch failed", error);
    }
  } else {
    console.warn("Firebase client not configured. Using seeded categories.");
  }

  return defaultCategories;
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const docSnapshot = await adminDb.collection("siteSettings").doc("singleton").get();
      if (docSnapshot.exists) {
        return docSnapshot.data() as SiteSettings;
      }
    }
  } catch (error) {
    console.warn("Admin settings fetch failed", error);
  }

  if (firestore) {
    try {
      const snapshot = await getDocs(collection(firestore, "siteSettings"));
      const docs = mapSnapshot<SiteSettings>(snapshot as unknown as AnySnapshot);
      if (docs.length > 0) {
        return docs[0]!;
      }
    } catch (error) {
      console.warn("Client settings fetch failed", error);
    }
  } else {
    console.warn("Firebase client not configured. Using default settings.");
  }

  return defaultSettings;
});
