"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";
import { Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartDialog } from "@/components/cart/cart-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("navigation");
  const locale = useLocale();

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}#shop`, label: t("shop") },
    { href: `/${locale}/cart`, label: t("cart") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-[var(--header-height)] items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              AC
            </span>
            <div className="hidden sm:block">
              <span className="block text-sm uppercase tracking-[0.4em] text-muted-foreground">Aurora</span>
              <span className="-mt-1 block text-lg font-semibold">Commerce</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-background hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <Suspense fallback={<div className="h-10 w-10 rounded-full bg-muted" />}>
            <LanguageSwitcher />
          </Suspense>
          <ThemeToggle />
          <CartDialog />
        </div>
      </div>
    </header>
  );
}
