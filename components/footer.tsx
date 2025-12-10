"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { NewsletterFormInline } from "@/components/newsletter/newsletter-form-inline";

export function Footer() {
  const t = useTranslations("navigation");

  const footerLinks = [
    { href: "#", label: "About" },
    { href: "#", label: "Shipping" },
    { href: "#", label: "Returns" },
    { href: "#", label: "Privacy" },
  ];

  return (
    <footer className="border-t border-border/70 bg-background/90">
      <div className="container grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Aurora Commerce</h3>
          <p className="max-w-xl text-sm text-muted-foreground">
            Premium ecommerce template crafted with Next.js 15, Firebase, GSAP, and multilingual support.
          </p>
          <NewsletterFormInline />
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="mailto:support@aurora.store" className="transition hover:text-foreground">
                  support@aurora.store
                </Link>
              </li>
              <li>
                <span>+46 8 123 45 67</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/admin" className="transition hover:text-foreground">
                  {t("admin")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="col-span-full text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aurora Commerce. Crafted for modern retail experiences.
        </p>
      </div>
    </footer>
  );
}
