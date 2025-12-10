import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="shop" className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Featured products</h2>
        <span className="text-sm text-muted-foreground">{products.length} items</span>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
