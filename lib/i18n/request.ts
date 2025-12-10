import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type AppLocale } from "./config";

const loadMessages = async (locale: AppLocale) => {
  switch (locale) {
    case "sv":
      return (await import("@/messages/sv.json")).default;
    default:
      return (await import("@/messages/en.json")).default;
  }
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const resolvedLocale = (locales as readonly string[]).includes(locale)
    ? (locale as AppLocale)
    : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: await loadMessages(resolvedLocale),
  };
});
