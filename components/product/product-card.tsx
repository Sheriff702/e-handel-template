"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const { addToCart, toggleFavourite, isFavourite } = useCart();
  const locale = useLocale();
  const t = useTranslations("products");

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleFavourite = () => toggleFavourite(product);

  const favourite = isFavourite(product.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="h-full"
      >
        <Card className="group flex h-full flex-col overflow-hidden border-border/60 bg-background/80 transition hover:-translate-y-1 hover:shadow-xl">
          <button type="button" onClick={() => setOpen(true)} className="relative h-64 w-full overflow-hidden">
            <Image
              src={product.images?.[0] ?? "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width:768px) 100vw, 400px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            {product.compareAtPrice && (
              <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                <Sparkles className="h-3 w-3" />
                {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% off
              </span>
            )}
          </button>
          <CardHeader className="flex-1 space-y-2 p-4">
            <CardTitle className="text-lg font-semibold text-balance">{product.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{formatCurrency(product.price, locale)}</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <Button onClick={handleAddToCart} className="flex-1 rounded-full">
                {t("addToCart")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-2 rounded-full"
                aria-label={favourite ? t("removeFromFavourites") : t("addToFavourites")}
                onClick={handleToggleFavourite}
              >
                <Heart className={`h-5 w-5 ${favourite ? "fill-current" : ""}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-[3fr_2fr]">
          <div className="relative h-full min-h-[320px]">
            <Image
              src={product.images?.[0] ?? "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width:768px) 100vw, 640px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col gap-6 p-8">
            <DialogHeader className="items-start text-left">
              <DialogTitle className="text-3xl font-semibold">{product.title}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {product.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-2xl font-semibold">{formatCurrency(product.price, locale)}</div>
              {product.compareAtPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  {t("compare")}: {formatCurrency(product.compareAtPrice, locale)}
                </div>
              )}
              {product.stock <= 0 && (
                <div className="text-sm font-medium text-destructive">{t("soldOut")}</div>
              )}
            </div>
            <DialogFooter className="gap-3">
              <Button onClick={handleAddToCart} size="lg" className="w-full rounded-full" disabled={product.stock <= 0}>
                {t("addToCart")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full"
                onClick={handleToggleFavourite}
              >
                <Heart className={`mr-2 h-4 w-4 ${favourite ? "fill-current" : ""}`} />
                {favourite ? t("removeFromFavourites") : t("addToFavourites")}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
