import type { ArticleSummary } from "@/lib/content";
import type { Locale } from "@/lib/i18n/locales";
import { Section } from "@/components/ui";
import type { IconName } from "@/components/ui";
import { HelpBrowser } from "@/components/features/help";
import { type CollectionCopy, UI } from "./copy";
import { IndexHero } from "./shared";

/* ── the help centre ──────────────────────────────────────────────────────
 *
 * Search first, then categories, then everything. A reader arrives here with
 * a question already formed, and the fastest route from a formed question to
 * an answer is a text field — so the field is in the hero rather than below
 * the fold, and the categories are what the reader falls back to when the
 * words they tried were not our words.
 *
 * `HelpBrowser` is the only client component in this file's tree. It does the
 * filtering, because filtering fourteen titles the reader can already see is
 * not worth a round trip, and because a search that needs the network is a
 * search that is slower than scrolling.
 */
export function HelpIndex({
  locale,
  posts,
  copy,
  ui,
}: {
  locale: Locale;
  posts: ArticleSummary[];
  copy: CollectionCopy;
  ui: (typeof UI)[Locale];
}) {
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[];

  /*
   * The hero and the search are one object, so the hero is rendered by
   * `HelpBrowser` rather than beside it.
   *
   * The field belongs *in* the panel — it is the first thing the page is
   * for, and a search bar sitting under the panel it belongs to reads as the
   * start of the list instead of the end of the header. The heading is still
   * server-rendered: a client component is hydrated, not fetched, so the h1
   * is in the HTML either way.
   */
  if (posts.length === 0) {
    return (
      <>
        <IndexHero copy={copy} />
        <Section className="pt-0">
          <p className="mk-bidi text-[var(--text-muted)]">{copy.empty}</p>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section className="pt-[clamp(1.5rem,4vw,2.5rem)]">
          <HelpBrowser
            locale={locale}
            hero={{ eyebrow: copy.eyebrow, title: copy.title, lead: copy.lead }}
            posts={posts.map((post) => ({
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              category: post.category ?? "",
              readingMinutes: post.readingMinutes ?? 0,
            }))}
            categories={categories.map((name) => ({
              name,
              icon: helpIcon(name),
              count: posts.filter((p) => p.category === name).length,
            }))}
            labels={{
              search: ui.searchLabel,
              placeholder: ui.searchPlaceholder,
              clear: ui.clear,
              categories: ui.categories,
              all: ui.all,
              noMatch: ui.noMatch,
              suggestions: ui.suggestions,
            }}
            /* Pluralised here and passed down as finished strings. Arabic has
               six plural categories and the client bundle has no business
               carrying a second copy of the rules for them. */
            counts={Object.fromEntries(
              categories.map((name) => [
                name,
                ui.articles(posts.filter((p) => p.category === name).length),
              ]),
            )}
            readingTimes={Object.fromEntries(
              posts.map((p) => [p.slug, p.readingMinutes ? copy.readingTime(p.readingMinutes) : ""]),
            )}
            /*
             * A list and not a function. A server component cannot hand a
             * client one a callback — it has to serialise — and the count
             * can only ever be 0 to however many articles there are, so the
             * whole answer fits in an array of that length.
             */
            resultWords={Array.from({ length: posts.length + 1 }, (_, n) => ui.results(n))}
          />
      </Section>
    </>
  );
}

/*
 * An icon for a help category.
 *
 * Matched on a word in the name rather than on its position in the list,
 * because the list's order is the content's and a rocket landing on
 * "Billing" because it sorted third is worse than no icon at all. Both
 * languages, because the CMS will publish English categories eventually, and
 * `book` when nothing matches — which is a neutral answer, not a wrong one.
 */
function helpIcon(name: string): IconName {
  const table: [RegExp, IconName][] = [
    [/بدء|البداية|start|getting/i, "rocket"],
    [/استبيان|تحليل|brief|analys/i, "form"],
    [/أصول|دليل|asset|guideline/i, "folder"],
    [/تسليم|handoff|deliver/i, "package"],
    [/صوت|نبرة|voice|tone/i, "commentDots"],
    [/فريق|مشارك|team|shar/i, "users"],
    [/نطاق|نشر|domain|publish/i, "globe"],
    [/حساب|فوتر|account|billing/i, "coins"],
    [/خصوص|أمان|privacy|security/i, "lock"],
  ];
  for (const [pattern, icon] of table) if (pattern.test(name)) return icon;
  return "book";
}
