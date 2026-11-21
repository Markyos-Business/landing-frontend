import type { HelpArticle } from "@/lib/content/help";
import { helpPath } from "@/lib/content/help";
import type { Locale } from "@/lib/i18n/locales";
import { pageUrl } from "@/lib/seo";
import { HELP_COPY } from "./copy";

/*
 * Structured data for a Help Center article (C4): Article always, FAQPage
 * for an FAQ (the title is the question, the body its answer), and the
 * BreadcrumbList the page shows. One array, rendered as one script tag.
 */
export function helpArticleJsonLd(article: HelpArticle, locale: Locale, plainBody: string) {
  const url = pageUrl(locale, helpPath(article.categorySlug, article.slug));
  const crumbs = [
    { name: HELP_COPY[locale].category.breadcrumb, url: pageUrl(locale, "/help") },
    ...(article.parentCategory ? [{ name: article.parentCategory.title, url: pageUrl(locale, helpPath(article.parentCategory.slug)) }] : []),
    ...(article.category ? [{ name: article.category.title, url: pageUrl(locale, helpPath(article.category.slug)) }] : []),
    { name: article.title, url },
  ];

  const graph: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.seoDescription || article.summary,
      inLanguage: locale,
      url,
      mainEntityOfPage: url,
      ...(article.publishedAt ? { datePublished: article.publishedAt, dateModified: article.publishedAt } : {}),
      ...(article.ogImage ? { image: article.ogImage.url } : {}),
      ...(article.author ? { author: { "@type": "Person", name: article.author } } : {}),
      publisher: { "@type": "Organization", name: "Markyos", url: pageUrl(locale, "") },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
    },
  ];

  if (article.type === "faq") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: [
        {
          "@type": "Question",
          name: article.title,
          acceptedAnswer: { "@type": "Answer", text: plainBody },
        },
      ],
    });
  }
  return graph;
}

/** JSON for a <script> tag: `<` escaped so the body can't close the tag. */
export const scriptJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
