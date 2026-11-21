import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { articleLocales, content } from "@/lib/content";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/lib/i18n/locales";
import { routeSlug } from "@/lib/pages/params";
import { pageMetadata } from "@/lib/seo";
import { ArticleView } from "@/components/public/editorial";
import { NotTranslated } from "@/components/public/pages/NotTranslated";
import { getHelpCategory, getHelpHome, helpPath } from "@/lib/content/help";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { HELP_COPY, HelpCategoryView } from "@/components/public/help";

export const revalidate = 3600;

const COLLECTION = "help" as const;

/*
 * A Help Center topic (C1) or, when the segment isn't a topic, a piece from
 * the older CMS help collection. Topics are checked first: the two can't share
 * a route level any other way, and old article links keep working.
 */

/*
 * A single piece.
 *
 * `dynamicParams` is left on (the default) so something published after the
 * last build renders on first request rather than 404ing until a redeploy.
 * That is the whole point of putting editorial content in a CMS.
 */
export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    const posts = await content.listArticles({ locale: lang, collection: COLLECTION });
    for (const post of posts) params.push({ lang, slug: post.slug });
  }
  return params;
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
  if (topic) {
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

  const post =
    (await content.getArticle({ locale: lang, collection: COLLECTION, slug })) ??
    // The untranslated notice still needs a title and a robots directive, so
    // it borrows the Arabic piece's.
    (await content.getArticle({ locale: DEFAULT_LOCALE, collection: COLLECTION, slug }));
  if (!post) return {};

  const available = await articleLocales(COLLECTION, slug);

  return pageMetadata({
    locale: lang,
    path: `/help/${slug}`,
    title: post.seoTitle ?? `${post.title} — Markyos`,
    description: post.seoDescription ?? post.excerpt,
    ogTitle: post.title,
    ogImage: post.ogImage,
    // The languages this piece is actually written in, asked of the CMS.
    // This was `localesFor()` from the page registry, which answers for the
    // hand-written pages and said "Arabic only" — so every English article
    // declared no pair and was served noindex, with ten of them published.
    available,
    // Placeholder prose that ranks is placeholder prose that gets cited, and
    // an untranslated notice must never be indexed at all.
    noindex: post.provisional || !available.includes(lang),
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

  const post = await content.getArticle({ locale: lang, collection: COLLECTION, slug });
  if (post) return <ArticleView collection={COLLECTION} locale={lang} post={post} />;

  /*
   * Nothing in this language. Two different situations, and only one of them
   * is a 404.
   *
   * If the piece exists in Arabic, this is the English edition of something
   * that has not been translated — which is reachable from the language
   * switch in the header, so it must not 404. Found by driving the site: the
   * switcher was prefetching /en/blog/<slug> and getting a 404 on every
   * article page.
   *
   * If it does not exist in Arabic either, it is a draft, a deleted piece or
   * a typed URL, and 404 is the honest answer.
   */
  const original = await content.getArticle({
    locale: DEFAULT_LOCALE,
    collection: COLLECTION,
    slug,
  });
  if (!original) notFound();

  return (
    <NotTranslated
      locale={lang}
      path={`/help/${slug}`}
      name={original.title}
      fallback={{ label: "Help centre", href: "/help" }}
    />
  );
}

/** This language's slug for a topic named by its slug in the other language. */
async function topicIn(lang: Locale, otherSlug: string): Promise<string | null> {
  const other = await getHelpCategory(lang === "en" ? "ar" : "en", otherSlug);
  if (!other) return null;
  const home = await getHelpHome(lang);
  const all = (home?.categories ?? []).flatMap((c) => [c, ...(c.subcategories ?? [])]);
  return all.find((c) => c.id === other.id && c.slug)?.slug ?? null;
}
