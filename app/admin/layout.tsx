import type { Metadata } from "next";
import messages from "@/messages/en.json";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SonnerToaster } from "@/components/providers/sonner-provider";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Aurora Commerce Admin",
  description: "Secure dashboard to manage products, categories, newsletters, and site settings.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale="en" messages={messages} timeZone="Europe/Stockholm">
        <AdminShell>
          {children}
          <SonnerToaster />
        </AdminShell>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
