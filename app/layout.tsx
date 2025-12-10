import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aurora-commerce.template"),
  title: {
    default: "Aurora Commerce",
    template: "%s · Aurora Commerce",
  },
  description:
    "A premium, multi-lingual Next.js webshop template powered by Firebase, GSAP animations, and a secure admin dashboard.",
  keywords: [
    "Next.js shop",
    "Firebase ecommerce",
    "Headless commerce",
    "Swedish shop",
  ],
  openGraph: {
    title: "Aurora Commerce",
    description:
      "Launch a multilingual, theme-aware webshop with Firebase-powered content and a GSAP hero animation.",
    url: "https://aurora-commerce.template",
    siteName: "Aurora Commerce",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora Commerce",
    description:
      "Launch a multilingual, theme-aware webshop with Firebase-powered content and a GSAP hero animation.",
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const locale = params?.locale ?? defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
