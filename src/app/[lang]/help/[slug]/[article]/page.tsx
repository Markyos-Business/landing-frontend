import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { contentApiUrl } from "@/lib/content/djangoClient";
import { getHelpArticle, helpPath, type HelpArticle } from "@/lib/content/help";
import { localeHref } from "@/lib/i18n/href";
import { isLocale, LOCALES, type Locale } from "@/lib/i18n/locales";
import { routeSlug } from "@/lib/pages/params";
import { pageMetadata } from "@/lib/seo";
import { HELP_COPY } from "@/components/public/help";
import { HelpArticleView } from "@/components/public/help/HelpArticleView";
import { HelpNotTranslated } from "@/components/public/help/HelpNotTranslated";
import { prepareHelpBody, readingMinutes } from "@/components/public/help/body";
import { helpArticleJsonLd, scriptJson } from "@/components/public/help/jsonLd";

/*
 * A Help Center article: /help/<topic>/<article> (C4).
 *
 * Rendered on first request and cached for an hour; publishing in the admin
 * clears the cache for this path at once (`notify_site`).
 *
 * The same article has a different slug in each language, and the header's
 * language switch keeps the path, so an article can arrive here with the
 * other language's slugs. Then it redirects to this language's address, or,
 * when the article isn't published in this language, says so
 * («هذه المقالة غير متاحة بالعربية بعد») and links to the edition there is.
 */
export const revalidate = 3600;

type Params = Promise<{ lang: string; slug: string; article: string }>;

const other = (lang: Locale): Locale => LOCALES.find((l) => l !== lang) ?? lang;

/** What this URL is: the article, a redirect, a "not in this language" notice, or nothing. */
async function resolve(lang: Locale, topic: string, slug: string) {
  const article = await getHelpArticle(lang, slug);
  if (article) {
    const canonical = helpPath(article.categorySlug, article.slug);
    return article.categorySlug === topic ? { article } : { redirect: localeHref(lang, canonical) };
  }
  const elsewhere = await getHelpArticle(other(lang), slug);
  if (!elsewhere) return null;
  const here = elsewhere.alternates[lang];
  if (here) return { redirect: localeHref(lang, helpPath(here.categorySlug, here.slug)) };
  return { missing: elsewhere };
}

const pathsOf = (article: HelpArticle) =>
  Object.fromEntries(
    Object.entries(article.alternates).map(([l, a]) => [l, helpPath(a!.categorySlug, a!.slug)]),
  ) as Partial<Record<Locale, string>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug: topic, article: encoded } = await params;
  if (!isLocale(lang)) notFound();
  const found = await resolve(lang, routeSlug(topic), routeSlug(encoded));
  if (!found || "redirect" in found) return {};

  if ("missing" in found && found.missing) {
    const c = HELP_COPY[lang].article.notTranslated;
    return pageMetadata({
      locale: lang,
      path: helpPath(found.missing.categorySlug, found.missing.slug),
      title: `${c.title} — Markyos`,
      description: c.body,
      available: [other(lang)],
      paths: pathsOf(found.missing),
      noindex: true,
    });
  }

  const article = found.article!;
  const paths = pathsOf(article);
  return pageMetadata({
    locale: lang,
    path: paths[lang] ?? helpPath(article.categorySlug, article.slug),
    title: article.seoTitle || `${article.title} — ${HELP_COPY[lang].category.breadcrumb} — Markyos`,
    description: article.seoDescription || article.summary,
    ogTitle: article.title,
    ogImage: article.ogImage?.url,
    ogType: "article",
    available: LOCALES.filter((l) => paths[l]),
    paths,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { lang, slug: topic, article: encoded } = await params;
  if (!isLocale(lang)) notFound();
  const found = await resolve(lang, routeSlug(topic), routeSlug(encoded));
  if (!found) notFound();
  if ("redirect" in found && found.redirect) permanentRedirect(found.redirect);

  if ("missing" in found && found.missing) {
    const there = other(lang);
    return (
      <HelpNotTranslated
        locale={lang}
        other={there}
        otherPath={helpPath(found.missing.categorySlug, found.missing.slug)}
        title={found.missing.title}
      />
    );
  }

  const article = found.article!;
  const c = HELP_COPY[lang].article;
  const root = contentApiUrl();
  const { html, toc, words } = prepareHelpBody(article.bodyHtml, {
    locale: lang,
    origin: root ? new URL(root).origin : "",
    anchorLabel: c.anchor,
    videoTitle: c.video,
  });
  const plain = article.bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: scriptJson(helpArticleJsonLd(article, lang, plain)) }}
      />
      <HelpArticleView locale={lang} article={article} html={html} toc={toc} minutes={readingMinutes(words)} />
    </>
  );
}
