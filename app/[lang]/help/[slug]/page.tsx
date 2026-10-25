import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/lib/i18n/locales";
import { routeSlug } from "@/lib/pages/params";
import { localesFor } from "@/lib/pages/registry";
import { pageMetadata } from "@/lib/seo";
import { ArticleView } from "@/components/page/editorial";
import { NotTranslated } from "@/components/page/NotTranslated";

export const revalidate = 3600;

const COLLECTION = "help" as const;

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

  const post =
    (await content.getArticle({ locale: lang, collection: COLLECTION, slug })) ??
    // The untranslated notice still needs a title and a robots directive, so
    // it borrows the Arabic piece's.
    (await content.getArticle({ locale: DEFAULT_LOCALE, collection: COLLECTION, slug }));
  if (!post) return {};

  const translated = lang === DEFAULT_LOCALE;

  return pageMetadata({
    locale: lang,
    path: `/help/${slug}`,
    title: post.seoTitle ?? `${post.title} — Markyos`,
    description: post.seoDescription ?? post.excerpt,
    ogTitle: post.title,
    // Only Arabic exists; the English edition of each piece is a translation
    // that has not been written, and declaring the pair would promise a
    // crawler a page that 404s.
    available: localesFor(),
    // Placeholder prose that ranks is placeholder prose that gets cited, and
    // an untranslated notice must never be indexed at all.
    noindex: post.provisional || !translated,
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
