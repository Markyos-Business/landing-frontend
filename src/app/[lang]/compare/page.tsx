import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { isLocale } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import { ArticleIndex, COLLECTIONS } from "@/components/public/editorial";

/*
 * Comparisons — the index.
 *
 * Revalidated on demand: publishing in the CMS calls `revalidatePath` on this
 * route (see cms/hooks/revalidate.ts), so a new piece appears without a
 * redeploy while the page stays static for everyone reading it.
 *
 * `revalidate` is also set as a backstop. If an on-demand revalidation is
 * ever missed — a hook that threw, a deploy mid-save — the page is at most an
 * hour stale rather than stale until someone notices.
 */
export const revalidate = 3600;

const COLLECTION = "compare" as const;
const PATH = "/compare";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const copy = COLLECTIONS[COLLECTION][lang];
  const posts = await content.listArticles({ locale: lang, collection: COLLECTION });

  return pageMetadata({
    locale: lang,
    path: PATH,
    title: `${copy.title.replace(/\.$/, "")} — Markyos`,
    description: copy.lead,
    // Out of the index while every piece on it is placeholder content: the
    // list would otherwise rank for titles that lead nowhere useful. It
    // becomes indexable on its own the moment one real piece is published,
    // because the condition is about the content and not a flag somebody has
    // to remember to flip.
    noindex: posts.length === 0 || posts.every((post) => post.provisional),
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const posts = await content.listArticles({ locale: lang, collection: COLLECTION });
  return <ArticleIndex collection={COLLECTION} locale={lang} posts={posts} />;
}
