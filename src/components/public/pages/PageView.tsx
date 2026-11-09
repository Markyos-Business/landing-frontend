import Link from "next/link";
import type { PageDoc } from "@/content/pages/types";
import type { SiteCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { pageUrl } from "@/lib/seo";
import { Icon } from "@/components/ui";
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
    <nav aria-label="Breadcrumb" className="mk-load mk-container pt-7">
      {/* The separators were `--hairline-strong` — rgba(11,11,15,.07), which is
          a line colour, not an ink: at 1.1:1 on this ground the trail rendered
          as a row of crumbs with nothing between them. */}
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
        {doc.breadcrumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 ? (
              // Rotated rather than mirrored by hand: the chevron points the
              // way the page reads, which on an Arabic page is leftwards.
              <Icon
                name="chevron"
                size={12}
                className="flex-none -rotate-90 text-[var(--text-faint)] rtl:rotate-90"
              />
            ) : null}
            <Link
              href={localeHref(locale, crumb.href)}
              className="mk-bidi mk-tap rounded px-0.5 transition-colors hover:text-[var(--text)]"
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
            className="flex-none -rotate-90 text-[var(--text-faint)] rtl:rotate-90"
          />
          <span className="mk-bidi text-[var(--text)]">{doc.shortTitle ?? doc.title}</span>
        </li>
      </ol>
    </nav>
  );
}

/**
 * Which sections sit on the white band.
 *
 * The light page alternates ground and white every section — the homepage does
 * it fourteen times in a row — and that alternation is what makes the 120px
 * between two sections read as a chapter break. These pages were one flat field
 * with a 1px rule at each boundary and 200px of nothing above it, which reads
 * as a hole rather than as a break.
 *
 * The first content section is the white one, so the change happens straight
 * under the hero. That is where these pages read worst: the hero ends, 180px of
 * identical ground follows, and the next heading arrives with nothing to say a
 * section began.
 *
 * Two kinds of block are skipped rather than counted. A `hero` and a `cta` sit
 * on their own light and take the ground either way, and counting them would
 * swallow a turn and leave two white sections touching. And a heading-less,
 * copy-less `prose` block is one row of links out of the section above it — see
 * `signpost` in blocks.tsx — so it continues that section's band instead of
 * spending one, or six pages would turn a colour for a single line of text.
 *
 * A plain function rather than a reduce inside the JSX: the band depends on
 * every block before it, and a counter closed over by a `map` callback is
 * exactly the mutation React's compiler refuses to guarantee.
 */
function bandRhythm(blocks: PageDoc["blocks"]): boolean[] {
  const out: boolean[] = [];
  let band = 0;
  let previous = false;
  for (const block of blocks) {
    const signpost = block.kind === "prose" && !block.title && !block.body?.length;
    const banded = block.kind !== "hero" && block.kind !== "cta" && !signpost;
    const white: boolean = signpost ? previous : banded && band++ % 2 === 0;
    if (banded || signpost) previous = white;
    out.push(white);
  }
  return out;
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
  const bands = bandRhythm(doc.blocks);

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
        <Block key={i} block={block} ctx={ctx} index={i} white={bands[i]} />
      ))}
    </>
  );
}
