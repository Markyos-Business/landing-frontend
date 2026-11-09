import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, ALL_PATHS, localesFor } from "@/lib/pages/registry";
import { getCopyFor } from "@/lib/i18n/dictionary";
import { isLocale, LOCALES } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import { PageView } from "@/components/public/pages/PageView";
import { NotTranslated } from "@/components/public/pages/NotTranslated";

/*
 * Every page in the registry, from one route.
 *
 * ── Why a catch-all and not twenty-seven files ─────────────────────────────
 *
 * Twenty-seven route files, each fifteen lines of identical boilerplate
 * around a different slug, is twenty-seven chances for one of them to forget
 * its canonical tag or its noindex. Here there is one, the registry is the
 * only list, and a page cannot exist without its metadata being built the
 * same way as every other page's.
 *
 * Next resolves static segments before a catch-all, so the routes that are
 * *not* data-driven — `/`, `/blog`, `/blog/[slug]`, `/guides`, `/help` — keep
 * their own files and win against this one. Nothing had to be rearranged for
 * that; it is how the router already works.
 *
 * `dynamicParams: false` makes anything outside the registry a 404 at build
 * time rather than a function invocation per bad URL.
 */

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { lang: string; slug: string[] }[] = [];
  for (const lang of LOCALES) {
    for (const path of ALL_PATHS) {
      params.push({ lang, slug: path.replace(/^\//, "").split("/") });
    }
  }
  return params;
}

type Props = { params: Promise<{ lang: string; slug: string[] }> };

async function resolve(params: Props["params"]) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const path = `/${slug.join("/")}`;
  /*
   * The Arabic edition decides whether the path is real; the locale's own
   * edition is what renders. A path with no Arabic page is a 404 in every
   * language, and a path with no *English* page is a notice, not a 404 —
   * see the registry's header for why.
   */
  const canonical = getPage(path);
  if (!canonical) notFound();
  const doc = getPage(path, lang) ?? canonical;
  return { locale: lang, doc, path };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, doc, path } = await resolve(params);
  const available = localesFor(path);
  const translated = available.includes(locale);

  return pageMetadata({
    locale,
    path: doc.path,
    title: translated ? doc.title : `${doc.shortTitle ?? doc.title} — Markyos`,
    description: doc.description,
    ogTitle: doc.shortTitle ?? doc.title,
    available,
    // An untranslated edition is a notice, not a page. It must never be
    // indexed, or a crawler is told the English page exists and is thin.
    noindex: doc.noindex || !translated,
  });
}

export default async function RegistryPage({ params }: Props) {
  const { locale, doc, path } = await resolve(params);

  if (!localesFor(path).includes(locale)) {
    return <NotTranslated locale={locale} path={doc.path} name={doc.shortTitle ?? doc.title} />;
  }

  const copy = await getCopyFor(locale);
  return <PageView doc={doc} locale={locale} chips={copy.chips} />;
}
