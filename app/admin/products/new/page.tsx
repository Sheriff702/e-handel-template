import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Create product</h1>
        <p className="text-sm text-muted-foreground">Add a new item to your collection.</p>
      </div>
      <ProductForm />
    </div>
  );
}
