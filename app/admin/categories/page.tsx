import Link from "next/link";
import { getAdminDb } from "@/lib/firebase-admin";
import { getCategories } from "@/lib/storefront";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "@/components/admin/categories-table";
import type { Category } from "@/types/catalog";

export default async function AdminCategoriesPage() {
  const adminDb = getAdminDb();
  let categories: Category[] = await getCategories();

  if (adminDb) {
    const snapshot = await adminDb.collection("categories").orderBy("sort", "asc").get();
    categories = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...(data as Category),
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? data.updatedAt,
      };
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Group products into curated collections.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/categories/new">Add category</Link>
        </Button>
      </div>
      <CategoriesTable categories={categories} />
    </div>
  );
}
