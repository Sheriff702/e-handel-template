"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const locale = useLocale();
  const t = useTranslations("cart");

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground">{cart.items.length} items</p>
        </div>
        {cart.items.length > 0 && (
          <Button variant="ghost" onClick={clearCart}>
            Clear cart
          </Button>
        )}
      </div>
      {cart.items.length === 0 ? (
        <div className="rounded-3xl border border-border/70 p-12 text-center">
          <p className="text-lg text-muted-foreground">{t("empty")}</p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="../">{t("continue")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-5 rounded-2xl border border-border/60 p-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={120}
                    height={120}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted text-lg font-semibold">
                    {item.title[0]}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price, locale)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-3xl border border-border/70 p-6">
            <h2 className="text-xl font-semibold">Order summary</h2>
            <Separator />
            <div className="flex items-center justify-between text-base">
              <span>{t("subtotal")}</span>
              <span>{formatCurrency(subtotal, locale)}</span>
            </div>
            <Button size="lg" className="w-full rounded-full">
              {t("checkout")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
