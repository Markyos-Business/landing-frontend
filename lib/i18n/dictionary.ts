import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import type { SiteCopy } from "@/content/types";
import { isLocale, type Locale } from "./locales";

/*
 * Copy loading.
 *
 * Both locales are dynamic imports, so a page renders only the language it
 * serves — the Arabic copy never reaches an English reader's HTML, and because
 * every page here is a Server Component, neither one reaches the client bundle
 * at all.
 *
 * Why typed modules rather than JSON: the copy carries structure (step lists,
 * pricing tables, FAQ pairs, a status chip per feature), and a typed module
 * makes `check:locales` able to prove the Arabic has the same shape as the
 * English. A missing Arabic FAQ answer is then a build error, not a blank
 * region on the page nobody who reads English would ever see.
 */

const dictionaries: Record<Locale, () => Promise<SiteCopy>> = {
  en: () => import("@/content/en").then((m) => m.copy),
  ar: () => import("@/content/ar").then((m) => m.copy),
};

/** Load copy for an explicit locale — use in `generateMetadata`, sitemap, etc. */
export function getCopyFor(locale: Locale): Promise<SiteCopy> {
  return dictionaries[locale]();
}

/**
 * Load copy for the locale of the current request.
 *
 * `lang` is a *root* param — every route sits under `app/[lang]` — so any
 * Server Component below the root layout can reach it without the locale
 * being threaded through props. Client Components cannot: they take it as a
 * prop from a server parent.
 */
export async function getCopy(): Promise<SiteCopy> {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  return dictionaries[locale]();
}

/** The current locale, for Server Components that need the value itself. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  return locale;
}
