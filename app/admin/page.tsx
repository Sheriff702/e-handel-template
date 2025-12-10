import { getActiveProducts, getCategories, getSiteSettings } from "@/lib/storefront";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const [products, categories, settings] = await Promise.all([
    getActiveProducts(),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Total published items</CardDescription>
        </CardHeader>
        <CardContent className="text-4xl font-semibold">{products.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Organise the catalogue</CardDescription>
        </CardHeader>
        <CardContent className="text-4xl font-semibold">{categories.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Storefront</CardTitle>
          <CardDescription>Current brand configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xl font-semibold">{settings.storeName}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border" style={{ background: settings.brandColor }} />
            Brand
            <span>{settings.brandColor}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border" style={{ background: settings.accentColor }} />
            Accent
            <span>{settings.accentColor}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
