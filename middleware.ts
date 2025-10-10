import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales, localePrefix } from "@/lib/i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  matcher: [
    "/",
    "/(sv|en)/:path*",
    "/((?!api|_next|admin|.*\\..*).*)",
  ],
};
