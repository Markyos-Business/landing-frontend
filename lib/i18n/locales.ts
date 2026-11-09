/*
 * The locale list, as plain data.
 *
 * Imported by `proxy.ts`, which runs at the edge and may not pull in shared
 * modules with side effects — so this file holds no React, no server-only
 * marker and no content. Everything that loads actual copy lives in
 * `dictionary.ts` next to it.
 */

export const LOCALES = ["en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * The language the site is, rather than the language it falls back to.
 *
 * Arabic. markyos.com/ serves Arabic and English lives under /en — per the
 * Arabic copy document §0.5, which is the primary edition of the page rather
 * than a translation of it. Everything that builds a URL reads this, so the
 * default locale is the one with no prefix: see `localeHref` and `proxy.ts`.
 */
export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Writing direction per locale.
 *
 * This is the one value the whole bilingual claim rests on: it is stamped on
 * `<html dir>` so every logical CSS property in the page resolves the right
 * way round. Components must never branch on the locale to pick a side —
 * they use `start`/`end` and let this flip them. See docs/BILINGUAL.md.
 */
export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

/** The label used in the language switcher, each in its own script. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

/**
 * The `hreflang` value that goes in the alternates map.
 *
 * Kept separate from the route segment because the two can diverge: the URL
 * stays `/ar` for life, while the hreflang may need to narrow to `ar-SA` if
 * the Gulf and Levant ever get their own copy.
 */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  ar: "ar",
};
