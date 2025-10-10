"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export function CartDialog() {
  const [open, setOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart } = useCart();
  const locale = useLocale();
  const t = useTranslations("cart");

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={t("title")}>
          <ShoppingBag className="h-5 w-5" />
          {cart.items.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary text-[0.65rem] font-semibold text-primary-foreground">
              {cart.items.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("continue")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {cart.items.length === 0 && (
            <p className="text-muted-foreground">{t("empty")}</p>
          )}
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted">{item.title[0]}</div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-base">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.price, locale)}</p>
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
        <Separator className="my-6" />
        <DialogFooter className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>{t("subtotal")}</span>
            <span>{formatCurrency(subtotal, locale)}</span>
          </div>
          <Button size="lg" className="w-full" disabled={cart.items.length === 0}>
            {t("checkout")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
