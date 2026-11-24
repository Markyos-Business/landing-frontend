import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { isLocale } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import { ArticleIndex, COLLECTIONS } from "@/components/public/editorial";
import { getHelpHome, type HelpHome as HomeData } from "@/lib/content/help";
import { HELP_COPY, HelpHome } from "@/components/public/help";

/*
 * The help centre — the index.
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

const COLLECTION = "help" as const;
const PATH = "/help";

/*
 * The Help Center (C1) when the platform's help API has anything published;
 * the older CMS help index otherwise. The fallback keeps the page whole while
 * the new Help Center is being filled, and if the API is unreachable.
 */
const live = (home: HomeData | null): home is HomeData =>
  !!home && home.categories.some((c) => c.articleCount > 0);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  if (live(await getHelpHome(lang))) {
    const meta = HELP_COPY[lang].meta;
    return pageMetadata({ locale: lang, path: PATH, title: meta.title, description: meta.description });
  }

  const copy = COLLECTIONS[COLLECTION][lang];
  const posts = await content.listArticles({ locale: lang, collection: COLLECTION });

  return pageMetadata({
    locale: lang,
    path: PATH,
    title: `${copy.title.replace(/\.$/, "")} — Markyos`,
    description: copy.lead,
    /*
     * Out of the index while every piece on it is placeholder content.
     *
     * The list would otherwise rank for twelve titles that lead to text
     * written to try a layout. It becomes indexable on its own the moment one
     * real piece is published, because the condition is about the content and
     * not a flag somebody has to remember to flip.
     */
    noindex: posts.length === 0 || posts.every((post) => post.provisional),
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const home = await getHelpHome(lang);
  if (live(home)) return <HelpHome locale={lang} data={home} />;

  const posts = await content.listArticles({ locale: lang, collection: COLLECTION });
  return <ArticleIndex collection={COLLECTION} locale={lang} posts={posts} />;
}
