import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { SonnerToaster } from "@/components/providers/sonner-provider";

export function AppProviders({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Stockholm">
        <CartProvider>
          {children}
          <SonnerToaster />
        </CartProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
