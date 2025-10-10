import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, type AppLocale } from "@/lib/i18n/config";
import { AppProviders } from "@/components/providers/app-providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NewsletterPopup } from "@/components/newsletter/newsletter-popup";
import { getSiteSettings } from "@/lib/storefront";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.storeName,
    description:
      "Aurora Commerce – premium ecommerce storefront with Firebase integration, GSAP animations, and secure admin dashboard.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = locale as AppLocale;
  if (!locales.includes(normalizedLocale)) {
    notFound();
  }

  setRequestLocale(normalizedLocale);
  const messages = await getMessages();

  return (
    <AppProviders locale={normalizedLocale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container space-y-20 py-16">
            {children}
            <NewsletterPopup />
          </div>
        </main>
        <Footer />
      </div>
    </AppProviders>
  );
}
