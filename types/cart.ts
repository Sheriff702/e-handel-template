import type { Product } from "@/types/catalog";

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

export type FavouriteItem = {
  productId: string;
  title: string;
  image?: string;
  price: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR" };

export const toCartItem = (product: Product): CartItem => ({
  id: product.id,
  productId: product.id,
  title: product.title,
  price: product.price,
  quantity: 1,
  image: product.images?.[0],
});
