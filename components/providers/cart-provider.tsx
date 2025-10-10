"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useReducer } from "react";
import { toCartItem, type CartAction, type CartItem, type CartState, type FavouriteItem } from "@/types/cart";
import type { Product } from "@/types/catalog";

const CART_STORAGE_KEY = "aurora-cart";
const FAVOURITES_STORAGE_KEY = "aurora-favourites";

type CartContextValue = {
  cart: CartState;
  favourites: FavouriteItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavourite: (product: Product) => void;
  isFavourite: (productId: string) => boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((item) => item.productId === action.payload.productId);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === existing.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM": {
      return { items: state.items.filter((item) => item.productId !== action.payload.productId) };
    }
    case "UPDATE_QUANTITY": {
      return {
        items: state.items
          .map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
};

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to persist state", error);
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });
  const [favourites, setFavourites] = React.useState<FavouriteItem[]>([]);

  useEffect(() => {
    dispatch({ type: "CLEAR" });
    const storedCart = readStorage<CartItem[]>(CART_STORAGE_KEY, []);
    const storedFavourites = readStorage<FavouriteItem[]>(FAVOURITES_STORAGE_KEY, []);
    if (storedCart.length) {
      storedCart.forEach((item) =>
        dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: item.quantity } })
      );
    }
    setFavourites(storedFavourites);
  }, []);

  useEffect(() => {
    writeStorage(CART_STORAGE_KEY, cart.items);
  }, [cart]);

  useEffect(() => {
    writeStorage(FAVOURITES_STORAGE_KEY, favourites);
  }, [favourites]);

  const addToCart = React.useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: { ...toCartItem(product), quantity: 1 } });
  }, []);

  const removeFromCart = React.useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  }, []);

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const clearCart = React.useCallback(() => dispatch({ type: "CLEAR" }), []);

  const toggleFavourite = React.useCallback((product: Product) => {
    setFavourites((prev) => {
      const exists = prev.some((item) => item.productId === product.id);
      if (exists) {
        return prev.filter((item) => item.productId !== product.id);
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          image: product.images?.[0],
          price: product.price,
        },
      ];
    });
  }, []);

  const isFavourite = React.useCallback(
    (productId: string) => favourites.some((item) => item.productId === productId),
    [favourites]
  );

  const value = React.useMemo(
    () => ({
      cart,
      favourites,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleFavourite,
      isFavourite,
    }),
    [cart, favourites, addToCart, removeFromCart, updateQuantity, clearCart, toggleFavourite, isFavourite]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
