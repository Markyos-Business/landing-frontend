import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { routeSlug } from "@/lib/pages/params";
import { pageMetadata } from "@/lib/seo";
import { getHelpCategory, getHelpHome, helpPath } from "@/lib/content/help";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { HELP_COPY, HelpCategoryView } from "@/components/public/help";

export const revalidate = 3600;

/*
 * A Help Center topic (C1). The older CMS help collection no longer renders
 * here (review LR-21): one source for /help/<slug>, so the two can't collide.
 * Topics render on first request and stay static for an hour.
 */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug: encoded } = await params;
  const slug = routeSlug(encoded);
  if (!isLocale(lang)) notFound();

  const topic = await getHelpCategory(lang, slug);
  if (!topic) return {};
  return pageMetadata({
    locale: lang,
    path: `/help/${slug}`,
    title: `${topic.title} — ${HELP_COPY[lang].category.breadcrumb} — Markyos`,
    description: topic.description || HELP_COPY[lang].meta.description,
    // A topic's slug differs per language, so it declares no pair yet;
    // C4 links the two editions through the API.
    available: [lang],
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug: encoded } = await params;
  const slug = routeSlug(encoded);
  if (!isLocale(lang)) notFound();

  const topic = await getHelpCategory(lang, slug);
  if (topic) return <HelpCategoryView locale={lang} page={topic} />;

  // The language switch keeps the path, so a topic arrives here with its
  // slug from the other language: send the reader to this language's slug.
  const counterpart = await topicIn(lang, slug);
  if (counterpart) permanentRedirect(localeHref(lang, helpPath(counterpart)));

  notFound();
}

/** This language's slug for a topic named by its slug in the other language. */
async function topicIn(lang: Locale, otherSlug: string): Promise<string | null> {
  const other = await getHelpCategory(lang === "en" ? "ar" : "en", otherSlug);
  if (!other) return null;
  const home = await getHelpHome(lang);
  const all = (home?.categories ?? []).flatMap((c) => [c, ...(c.subcategories ?? [])]);
  return all.find((c) => c.id === other.id && c.slug)?.slug ?? null;
}
