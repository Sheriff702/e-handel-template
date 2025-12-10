"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut, Menu, Package, Settings, TableProperties, Users } from "lucide-react";
import { useState } from "react";
import { firebaseAuth, missingFirebaseClientMessage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", icon: TableProperties, labelKey: "overview" },
  { href: "/admin/products", icon: Package, labelKey: "products" },
  { href: "/admin/categories", icon: Menu, labelKey: "categories" },
  { href: "/admin/newsletters", icon: Users, labelKey: "newsletters" },
  { href: "/admin/settings", icon: Settings, labelKey: "settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("admin.nav");
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    if (!firebaseAuth) {
      console.warn(missingFirebaseClientMessage);
      router.replace("/admin/login");
      return;
    }

    await firebaseAuth.signOut();
    router.replace("/admin/login");
  };

  return (
    <aside className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            AC
          </div>
          <span className="text-lg font-semibold">Aurora Admin</span>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {t(link.labelKey)}
              </Link>
            );
          })}
          <Button variant="ghost" onClick={handleSignOut} className="rounded-full" disabled={!firebaseAuth}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("logout")}
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setOpen((prev) => !prev)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      {open && (
        <div className="border-t border-border/60 px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="justify-start rounded-full"
              disabled={!firebaseAuth}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </Button>
          </nav>
        </div>
      )}
    </aside>
  );
}
