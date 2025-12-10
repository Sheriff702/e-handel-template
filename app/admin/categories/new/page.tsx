import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Create category</h1>
        <p className="text-sm text-muted-foreground">Define a new collection for your storefront.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
