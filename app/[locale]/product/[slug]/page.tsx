import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { getProductBySlug } from "@/lib/storefront";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(params.locale);
  const [product, t] = await Promise.all([
    getProductBySlug(params.slug),
    getTranslations("products"),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/70 shadow-soft">
        <Image
          src={product.images?.[0] ?? "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold">{product.title}</h1>
          <p className="text-muted-foreground">{product.description}</p>
        </div>
        <div className="space-y-3">
          <div className="text-2xl font-semibold">{formatCurrency(product.price, params.locale)}</div>
          {product.compareAtPrice && (
            <div className="text-sm text-muted-foreground line-through">
              {t("compare")}: {formatCurrency(product.compareAtPrice, params.locale)}
            </div>
          )}
        </div>
        <Button size="lg" className="rounded-full">
          {t("addToCart")}
        </Button>
      </div>
    </div>
  );
}
