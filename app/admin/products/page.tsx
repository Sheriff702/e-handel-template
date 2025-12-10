import Link from "next/link";
import { getAdminDb } from "@/lib/firebase-admin";
import { getActiveProducts } from "@/lib/storefront";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/admin/products-table";
import type { Product } from "@/types/catalog";

export default async function AdminProductsPage() {
  const adminDb = getAdminDb();
  let products: Product[] = await getActiveProducts();

  if (adminDb) {
    const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();
    products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? data.updatedAt,
      } as Product;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage storefront inventory and pricing.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
