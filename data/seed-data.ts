import type { Product, Category, SiteSettings } from "@/types/catalog";

export const defaultCategories: Category[] = [
  {
    id: "outerwear",
    name: "Outerwear",
    slug: "outerwear",
    description: "Weather-ready coats and jackets crafted with recycled materials.",
    sort: 1,
  },
  {
    id: "essentials",
    name: "Essentials",
    slug: "essentials",
    description: "Elevated basics designed for everyday comfort.",
    sort: 2,
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Thoughtful finishing touches and daily companions.",
    sort: 3,
  },
];

const placeholderImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80"
];

export const defaultProducts: Product[] = Array.from({ length: 12 }).map((_, index) => {
  const category = defaultCategories[index % defaultCategories.length]!;
  const basePrice = 95 + index * 8;
  return {
    id: `product-${index + 1}`,
    title: `Aurora ${category.name} ${index + 1}`,
    slug: `aurora-${category.slug}-${index + 1}`,
    price: basePrice,
    compareAtPrice: index % 3 === 0 ? basePrice + 20 : null,
    description:
      "Meticulously tailored with responsibly sourced fabrics. Built for durability and effortless layering.",
    images: placeholderImages,
    categoryId: category.id,
    stock: Math.max(0, 25 - (index % 5) * 3),
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } satisfies Product;
});

export const defaultSettings: SiteSettings = {
  storeName: "Aurora Commerce",
  brandColor: "#111827",
  accentColor: "#ff914d",
  adminUids: [],
};
