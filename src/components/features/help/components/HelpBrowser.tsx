"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon, type IconName } from "@/components/ui";

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

export type HelpPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
};

export type HelpCategory = {
  name: string;
  icon: IconName;
  count: number;
};

/*
 * Matching, folded.
 *
 * Arabic is written with and without its short vowels and with four shapes of
 * alif, and a reader typing "استبيان" should find «الاستبيان» whichever way
 * either was typed. So both sides are stripped of diacritics and tatweel and
 * their alif, ya and ta-marbuta forms are normalised before comparison —
 * which is the smallest thing that makes an Arabic search feel like a search
 * rather than a trap. `localeCompare` would not help: this is containment,
 * not ordering.
 */
function fold(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

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
  labels: {
    search: string;
    placeholder: string;
    clear: string;
    categories: string;
    all: string;
    noMatch: string;
    suggestions: string;
  };
  /** The per-category article count, already pluralised by the server. */
  counts: Record<string, string>;
  /** The per-article reading time, already pluralised by the server. */
  readingTimes: Record<string, string>;
  /** "N results", one entry per possible count. Indexed, not called. */
  resultWords: string[];
}) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  /* -1 is "nothing highlighted", which is the state the list opens in: the
     first suggestion is not chosen for the reader, so Enter on an untouched
     list submits nothing rather than navigating somewhere they never looked
     at. */
  const [active, setActive] = useState(-1);
  const fieldId = useId();
  const listId = `${fieldId}-suggestions`;
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const shown = useMemo(() => {
    const needle = fold(query.trim());
    return posts.filter((post) => {
      if (picked && post.category !== picked) return false;
      if (!needle) return true;
      return fold(`${post.title} ${post.excerpt} ${post.category}`).includes(needle);
    });
  }, [posts, query, picked]);

  const searching = query.trim().length > 0 || picked !== null;

  /* Six, because the panel hangs over the category tiles and a longer one
     covers the page it is meant to be a shortcut into. The list below holds
     the rest, and the count beside its heading says how many that is. */
  const suggestions = useMemo(
    () => (query.trim() ? shown.slice(0, 6) : []),
    [shown, query],
  );
  const showing = open && suggestions.length > 0;

  const move = (to: number) => {
    if (!suggestions.length) return;
    setOpen(true);
    setActive((to + suggestions.length) % suggestions.length);
  };

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

        <div
          className="mk-help-search mk-load-move"
          /* The panel closes when focus leaves the control as a whole, not
             when it leaves the input — otherwise clicking a suggestion
             closes the list out from under the click. `relatedTarget` is
             null when focus goes to the page chrome, which also closes. */
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
          }}
        >
          <label htmlFor={fieldId} className="mk-sr-only">
            {labels.search}
          </label>
          <Icon name="scan" size={17} className="flex-none text-[var(--text-faint)]" />
          <input
            id={fieldId}
            type="search"
            role="combobox"
            aria-expanded={showing}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              showing && active >= 0 ? `${listId}-${active}` : undefined
            }
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                move(active + 1);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                move(active - 1);
              } else if (event.key === "Enter" && showing && active >= 0) {
                event.preventDefault();
                optionRefs.current[active]?.click();
              } else if (event.key === "Escape") {
                /* First Escape closes the list, a second clears the field.
                   Closing and clearing on the same press loses the query of
                   anybody who pressed it to get the panel out of the way.
                   `preventDefault` because this is `type="search"`, and
                   Chrome's own Escape on one of those empties the field —
                   which did both halves on the first press and made the two
                   steps here look like they did nothing. */
                event.preventDefault();
                if (showing) setOpen(false);
                else setQuery("");
              } else if (event.key === "Tab") {
                setOpen(false);
              }
            }}
            placeholder={labels.placeholder}
            /* `mk-bidi` so an Arabic query and a Latin one each sit on their
               own reading edge inside the same field. */
            className="mk-bidi"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
              className="mk-help-clear"
            >
              <Icon name="close" size={15} label={labels.clear} />
            </button>
          ) : null}

          {showing ? (
            <ul id={listId} role="listbox" aria-label={labels.suggestions} className="mk-suggest">
              {suggestions.map((post, i) => (
                <li key={post.slug}>
                  <Link
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    /* Out of the tab order: focus stays on the input and the
                       highlight is carried by `aria-activedescendant`, which
                       is what the combobox pattern asks for. */
                    tabIndex={-1}
                    ref={(element) => {
                      optionRefs.current[i] = element;
                    }}
                    href={localeHref(locale, `/help/${post.slug}`)}
                    onMouseEnter={() => setActive(i)}
                    className={`mk-suggest-row${i === active ? " is-active" : ""}`}
                  >
                    <span className="mk-bidi mk-suggest-title">{post.title}</span>
                    <span className="mk-bidi mk-suggest-meta">{post.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <h2 className="mk-bidi mt-[clamp(2.5rem,5vw,4rem)] text-[length:var(--fs-d3)] leading-[1.25] font-medium text-[var(--text)]">
        {labels.categories}
      </h2>

      {/* `mk-seq-load` and not `mk-seq`: at desktop these tiles are on the
          first screen, where a `cover` range is already complete and a
          scroll-driven reveal has nothing to be driven by. */}
      <ul className="mk-seq-load mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const on = picked === category.name;
          return (
            <li key={category.name}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setPicked(on ? null : category.name)}
                className="mk-help-tile"
              >
                <span className="mk-help-tile-icon" aria-hidden="true">
                  <Icon name={category.icon} size={17} />
                </span>
                <span className="min-w-0">
                  <span className="mk-bidi block text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
                    {category.name}
                  </span>
                  <span className="mk-bidi mt-0.5 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                    {counts[category.name]}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mk-rise mt-[clamp(2.5rem,5vw,4rem)] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="mk-bidi text-[length:var(--fs-d3)] leading-[1.25] font-medium text-[var(--text)]">
          {picked ?? labels.all}
        </h2>
        {/* `aria-live`, so a filter that empties the list says so to a screen
            reader instead of silently removing everything under the heading
            that reader just moved to. */}
        <p aria-live="polite" className="mk-bidi text-[length:var(--fs-ui)] text-[var(--text-muted)]">
          {searching ? resultWords[shown.length] : null}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="mk-bidi mt-6 text-[var(--text-muted)]">{labels.noMatch}</p>
      ) : (
        /* Fourteen rows, 900px down the page: these are below the fold at every
           width, so they are the scroll-driven half of this page. */
        <ul className="mk-seq mt-5 grid gap-3 md:grid-cols-2">
          {shown.map((post) => (
            <li key={post.slug} className="flex">
              <Link href={localeHref(locale, `/help/${post.slug}`)} className="mk-help-row group">
                <span className="min-w-0">
                  <span className="mk-bidi block text-[length:var(--fs-ui)] leading-[1.5] font-medium text-[var(--text)] group-hover:underline">
                    {post.title}
                  </span>
                  <span className="mk-bidi mt-1.5 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                    {[picked ? null : post.category, readingTimes[post.slug]]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <Icon
                  name="chevron"
                  size={14}
                  className="mk-help-row-mark"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
