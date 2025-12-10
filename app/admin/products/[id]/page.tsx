import { notFound } from "next/navigation";
import { getAdminDb } from "@/lib/firebase-admin";
import { getActiveProducts } from "@/lib/storefront";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/types/catalog";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const adminDb = getAdminDb();
  let product: (Product & { id: string }) | null = null;

  if (adminDb) {
    const doc = await adminDb.collection("products").doc(params.id).get();
    if (doc.exists) {
      const data = doc.data();
      product = {
        id: doc.id,
        ...(data as Product),
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? data.updatedAt,
      };
    }
  }

  if (!product) {
    const fallback = await getActiveProducts();
    product = fallback.find((item) => item.id === params.id) ?? null;
  }

  if (!product) {
    notFound();
  }

  const initialData: Product & { id: string } = product;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Edit product</h1>
        <p className="text-sm text-muted-foreground">Update pricing, imagery, and inventory.</p>
      </div>
      <ProductForm initialData={initialData} />
    </div>
  );
}
