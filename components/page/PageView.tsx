import Link from "next/link";
import type { PageDoc } from "@/content/pages/types";
import type { SiteCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { pageUrl } from "@/lib/seo";
import { Icon } from "@/components/ui/Icon";
import { Block } from "./blocks";

/*
 * The shell every data-driven page renders inside.
 *
 * It does four things the blocks should not each have to: the breadcrumb
 * trail, the matching structured data, the FAQ structured data, and the
 * hairline rhythm between sections.
 */

function Breadcrumbs({ doc, locale }: { doc: PageDoc; locale: Locale }) {
  if (!doc.breadcrumbs?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mk-container pt-7">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1.5 text-[0.75rem] text-[var(--text-muted)]">
        {doc.breadcrumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 ? (
              // Rotated rather than mirrored by hand: the chevron points the
              // way the page reads, which on an Arabic page is leftwards.
              <Icon
                name="chevron"
                size={12}
                className="flex-none -rotate-90 text-[var(--hairline-strong)] rtl:rotate-90"
              />
            ) : null}
            <Link
              href={localeHref(locale, crumb.href)}
              className="mk-bidi rounded px-0.5 transition-colors hover:text-[var(--text)]"
            >
              {crumb.label}
            </Link>
          </li>
        ))}
        {/* The current page closes the trail but is not a link — a link to
            where you already are is a dead control. */}
        <li className="flex items-center gap-1" aria-current="page">
          <Icon
            name="chevron"
            size={12}
            className="flex-none -rotate-90 text-[var(--hairline-strong)] rtl:rotate-90"
          />
          <span className="mk-bidi text-[var(--text)]">{doc.shortTitle ?? doc.title}</span>
        </li>
      </ol>
    </nav>
  );
}

export function PageView({
  doc,
  locale,
  chips,
}: {
  doc: PageDoc;
  locale: Locale;
  chips: SiteCopy["chips"];
}) {
  const ctx = { locale, chips };

  const faq = doc.blocks.find((b) => b.kind === "faq");

  /*
   * Structured data.
   *
   * The breadcrumb list is what gets a sensible trail in a search result
   * instead of a bare URL, and the FAQ list is what makes the questions
   * eligible to appear under it. Both are built from the same data the page
   * renders, so they cannot describe a page that is not there — which is the
   * usual way this markup goes wrong.
   */
  const graph: Record<string, unknown>[] = [];

  if (doc.breadcrumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        ...doc.breadcrumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.label,
          item: pageUrl(locale, crumb.href === "/" ? "" : crumb.href),
        })),
        {
          "@type": "ListItem",
          position: doc.breadcrumbs.length + 1,
          name: doc.shortTitle ?? doc.title,
          item: pageUrl(locale, doc.path),
        },
      ],
    });
  }

  if (faq?.kind === "faq" && faq.items.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return (
    <>
      {graph.length ? (
        <script
          type="application/ld+json"
          // The content is our own copy, not user input, and JSON.stringify
          // escapes what matters. `</script>` inside a string would still
          // break out, so the one sequence that can is neutralised.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      ) : null}

      <Breadcrumbs doc={doc} locale={locale} />

      {doc.blocks.map((block, i) => (
        <Block
          key={i}
          block={block}
          ctx={ctx}
          index={i}
          /*
           * A rule above every section except the first content section and
           * the ones that draw their own edge. The hero and the closing CTA
           * sit on a glow and a card draws its own border, so a rule there
           * would be a second line beside an existing one.
           */
          rule={
            i > 1 &&
            block.kind !== "hero" &&
            block.kind !== "cta" &&
            block.kind !== "callout" &&
            block.kind !== "signup" &&
            doc.blocks[i - 1]?.kind !== "hero"
          }
        />
      ))}
    </>
  );
}
