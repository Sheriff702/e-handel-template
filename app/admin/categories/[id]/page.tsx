import { notFound } from "next/navigation";
import { getAdminDb } from "@/lib/firebase-admin";
import { getCategories } from "@/lib/storefront";
import { CategoryForm } from "@/components/admin/category-form";
import type { Category } from "@/types/catalog";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const adminDb = getAdminDb();
  let category: (Category & { id: string }) | null = null;

  if (adminDb) {
    const doc = await adminDb.collection("categories").doc(params.id).get();
    if (doc.exists) {
      const data = doc.data();
      category = {
        id: doc.id,
        ...(data as Category),
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? data.updatedAt,
      };
    }
  }

  if (!category) {
    const categories = await getCategories();
    category = categories.find((item) => item.id === params.id) ?? null;
  }

  if (!category) {
    notFound();
  }

  const initialData: Category & { id: string } = category;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Edit category</h1>
        <p className="text-sm text-muted-foreground">Adjust names, descriptions, and ordering.</p>
      </div>
      <CategoryForm initialData={initialData} />
    </div>
  );
}
