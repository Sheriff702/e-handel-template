import { unstable_setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/hero-section";
import { ProductGrid } from "@/components/product/product-grid";
import { getActiveProducts, getCategories } from "@/lib/storefront";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const [products, categories] = await Promise.all([getActiveProducts(), getCategories()]);

  return (
    <div className="space-y-20">
      <HeroSection />
      <section className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-soft">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-xs uppercase tracking-wide">0{category.sort ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
