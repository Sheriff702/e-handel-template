"use client";

import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeNames, type AppLocale } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const [isPending, startTransition] = useTransition();

  const setLocale = (targetLocale: AppLocale) => {
    startTransition(() => {
      const segments = pathname?.split("/") ?? [];
      if (segments.length > 1) {
        segments[1] = targetLocale;
      }
      const newPath = segments.join("/") || `/${targetLocale}`;
      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
      router.push(newPath);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label={t("shop")}>
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {locales.map((item) => (
          <DropdownMenuItem key={item} onClick={() => setLocale(item)}>
            <span className="mr-2 text-lg" aria-hidden>
              {item === "sv" ? "🇸🇪" : "🇬🇧"}
            </span>
            <span className="flex-1">{localeNames[item]}</span>
            {locale === item && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        {isPending && (
          <div className="px-3 py-1 text-xs text-muted-foreground">Switching…</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
