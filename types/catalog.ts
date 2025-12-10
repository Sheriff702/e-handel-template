export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  description: string;
  images: string[];
  categoryId: string;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort?: number;
};

export type NewsletterSignup = {
  id: string;
  email: string;
  createdAt: string;
  source?: string;
};

export type SiteSettings = {
  storeName: string;
  brandColor: string;
  accentColor: string;
  adminUids: string[];
};
