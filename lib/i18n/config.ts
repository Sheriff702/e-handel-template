export const locales = ["sv", "en"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";
export const localePrefix = "always" as const;

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  sv: "Svenska",
};
