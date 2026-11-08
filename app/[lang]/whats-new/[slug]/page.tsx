import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleLocales, content } from "@/lib/content";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/lib/i18n/locales";
import { routeSlug } from "@/lib/pages/params";
import { pageMetadata } from "@/lib/seo";
import { ArticleView } from "@/components/page/editorial";
import { NotTranslated } from "@/components/page/NotTranslated";

export const revalidate = 3600;

const COLLECTION = "whatsNew" as const;
const PATH = "/whats-new";

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

  const available = await articleLocales(COLLECTION, slug);
  const post =
    (await content.getArticle({ locale: lang, collection: COLLECTION, slug })) ??
    // The untranslated notice still needs a title and a robots directive, so
    // it borrows the other edition's.
    (await content.getArticle({ locale: DEFAULT_LOCALE, collection: COLLECTION, slug }));
  if (!post) return {};

  return pageMetadata({
    locale: lang,
    path: `${PATH}/${slug}`,
    title: post.seoTitle ?? `${post.title} — Markyos`,
    description: post.seoDescription ?? post.excerpt,
    ogTitle: post.title,
    ogImage: post.ogImage,
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

  const post = await content.getArticle({ locale: lang, collection: COLLECTION, slug });
  if (post) return <ArticleView collection={COLLECTION} locale={lang} post={post} />;

  /*
   * Nothing in this language. Two different situations, and only one of them
   * is a 404.
   *
   * If the piece exists in the other language, this is an edition that has
   * not been translated — which is reachable from the language switch in the
   * header, so it must not 404.
   *
   * If it does not exist there either, it is a draft, a deleted piece or a
   * typed URL, and 404 is the honest answer.
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
      path={`${PATH}/${slug}`}
      name={original.title}
      fallback={{ label: "All updates", href: PATH }}
    />
  );
}
