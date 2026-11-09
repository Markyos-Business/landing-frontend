"use client";

import { Icon } from "@/components/ui";
import type { Locale } from "@/lib/i18n/locales";
import { useHelpSearch } from "../hooks/useHelpSearch";
import type { HelpCategory, HelpLabels, HelpPost } from "../types";
import { SearchBox } from "./SearchBox";
import { CategoryTiles } from "./CategoryTiles";
import { ArticleList } from "./ArticleList";

/*
 * The help centre's search, its category tiles and its list of articles.
 *
 * ── Why this is a client component and the rest of the page is not ───────
 *
 * Because the whole collection is already on the page. Fourteen titles and
 * their excerpts are a few kilobytes that the server rendered anyway, so
 * filtering them is a string comparison, not a query — and a search box that
 * waits for the network is slower than scrolling past the thing you were
 * looking for. Nothing here is fetched and nothing here is stored.
 *
 * It degrades honestly: without JavaScript the field is inert but every
 * article is still listed and every category tile still links, because the
 * list is rendered from props on the server pass and the filter only ever
 * removes from it.
 *
 * ── Why the field suggests as well as filters ─────────────────────────────
 *
 * Typing already narrowed the list, but the list is 900px down the page and
 * below the fourteen category tiles — so on a 900px screen the field gave no
 * sign that anything had happened. Somebody typing «استبيان» watched a search
 * box do nothing and scrolled down to find out whether it had worked.
 *
 * The six best matches now appear under the field as they are typed, as the
 * ARIA combobox pattern: the input keeps focus and carries
 * `aria-activedescendant`, arrow keys move the highlight, Enter follows it,
 * Escape closes the list and a second Escape clears the field. The list below
 * still filters — the panel is a shortcut past it, not a replacement for it,
 * which matters because the panel holds six and a broad query matches more.
 *
 * Each suggestion is a real <a>: middle-click, cmd-click and "copy link
 * address" all work, which they would not if the rows were divs the keyboard
 * handler navigated for. `role="option"` on an anchor is the one place this
 * site lets a role override an element's own, and it is the price of keeping
 * the link real.
 *
 * ── Why the tiles filter instead of linking ───────────────────────────────
 *
 * A tile used to have to be an anchor to a section further down, which means
 * a reader lands at a heading and has to work out what happened. Selecting
 * the category in place answers the same question without moving the page,
 * and selecting it a second time clears it — so there is no state the reader
 * can get stuck in and no back button to press.
 */

export function HelpBrowser({
  locale,
  hero,
  posts,
  categories,
  labels,
  counts,
  readingTimes,
  resultWords,
}: {
  locale: Locale;
  hero: { eyebrow: string; title: string; lead: string };
  posts: HelpPost[];
  categories: HelpCategory[];
  labels: HelpLabels;
  /** The per-category article count, already pluralised by the server. */
  counts: Record<string, string>;
  /** The per-article reading time, already pluralised by the server. */
  readingTimes: Record<string, string>;
  /** "N results", one entry per possible count. Indexed, not called. */
  resultWords: string[];
}) {
  const search = useHelpSearch(posts);

  return (
    <>
      <div className="mk-help-hero mk-seq-load">
        <p className="mk-eyebrow mk-eyebrow-accent mk-bidi">{hero.eyebrow}</p>
        <h1 id="coll-heading" className="mk-load-move mk-h2-lg mk-bidi mt-4 max-w-[34rem]">
          {hero.title}
        </h1>
        <p className="mk-load-move mk-lead mk-bidi mt-4 max-w-[38rem]">{hero.lead}</p>

        {/*
         * The reference's one piece of imagery is a glass question mark, and
         * this is the site's answer to it: the same glyph from the icon set
         * the rest of the page uses, at display size and at 12% — a watermark
         * rather than a render, so it cannot drift from the icons beside it
         * and costs nothing to load.
         */}
        {/* `mk-still`: this is a direct child of the `mk-seq-load` above, and
            it centres itself with `translate: 0 -50%`. An animation on
            `translate` replaces the whole property, so the reveal was
            travelling it from 20px below the line up to its own centring
            offset — half its own height — instead of 20px. Same trap as the
            centred light pools, which `--mk-drift-x` exists to solve; here
            the element is decorative and sits at 0.12 opacity, so opting out
            of the cascade costs nothing and the glyph stays put. */}
        <span className="mk-help-hero-glyph mk-still" aria-hidden="true">
          <Icon name="help" size={230} />
        </span>

        <SearchBox search={search} labels={labels} locale={locale} />
      </div>

      <h2 className="mk-bidi mt-[clamp(2.5rem,5vw,4rem)] text-[length:var(--fs-d3)] leading-[1.25] font-medium text-[var(--text)]">
        {labels.categories}
      </h2>

      <CategoryTiles
        categories={categories}
        counts={counts}
        picked={search.picked}
        onToggle={search.togglePicked}
      />

      <ArticleList
        shown={search.shown}
        picked={search.picked}
        searching={search.searching}
        labels={labels}
        readingTimes={readingTimes}
        resultWords={resultWords}
        locale={locale}
      />
    </>
  );
}
