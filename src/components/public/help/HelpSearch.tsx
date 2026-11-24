"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { HelpCard, HelpSearchHit, HelpSearchResponse } from "@/lib/content/help";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon } from "@/components/ui";
import { HELP_COPY } from "./copy";
import { highlight, terms } from "./fold";

/*
 * The Help Center search page's live half (C5).
 *
 * Results follow the field as the reader types (200ms after the last key),
 * filtered by topic and type. The field is a combobox: arrow keys move
 * through the results, Enter opens one, Escape clears. Matches are marked in
 * the title and the snippet however they were spelled (see fold.ts).
 *
 * The query is logged once the reader settles on it (1.2s without typing),
 * and the result they open is logged with it: what was asked, in which
 * language, how many results, which article. Nothing about the person; and
 * nothing at all when the browser sends Do Not Track (the site's route
 * drops the log).
 */

const SETTLE_MS = 1200;
const DEBOUNCE_MS = 200;
const path = (card: HelpCard) =>
  `/help/${encodeURIComponent(card.categorySlug)}/${encodeURIComponent(card.slug)}`;

type Filters = { category: string; type: string };

export function HelpSearch({
  locale,
  initialQuery,
  initialFilters,
  initial,
}: {
  locale: Locale;
  initialQuery: string;
  initialFilters: Filters;
  initial: HelpSearchResponse | null;
}) {
  const c = HELP_COPY[locale];
  const s = c.search;
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [data, setData] = useState<HelpSearchResponse | null>(initial);
  const [state, setState] = useState<"idle" | "loading" | "error">(initial || !initialQuery ? "idle" : "error");
  const [active, setActive] = useState(-1);
  const queryId = useRef<number | undefined>(undefined);
  const logged = useRef<string>("");
  const request = useRef(0);

  const params = useCallback(
    (q: string, f: Filters, log: boolean) => {
      const p = new URLSearchParams({ q, locale });
      if (f.category) p.set("category", f.category);
      if (f.type) p.set("type", f.type);
      if (log) p.set("log", "1");
      return p;
    },
    [locale],
  );

  // Instant results.
  useEffect(() => {
    const q = query.trim();
    const url = new URL(window.location.href);
    url.searchParams.set("q", q);
    for (const key of ["category", "type"] as const) {
      if (filters[key]) url.searchParams.set(key, filters[key]);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(window.history.state, "", url);
    // Too short to search: nothing to fetch (and nothing shown, see `showing`).
    if (terms(q).join("").length < 2) return;
    const mine = ++request.current;
    const timer = window.setTimeout(async () => {
      setState("loading");
      try {
        const response = await fetch(`/api/help/search?${params(q, filters, false)}`);
        if (!response.ok) throw new Error(String(response.status));
        const next = (await response.json()) as HelpSearchResponse;
        if (mine === request.current) {
          setData(next);
          setState("idle");
          setActive(-1);
        }
      } catch {
        if (mine === request.current) setState("error");
      }
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query, filters, params]);

  // The settled query, logged once.
  useEffect(() => {
    const q = query.trim();
    const key = JSON.stringify([q, filters]);
    if (terms(q).join("").length < 2 || logged.current === key) return;
    const timer = window.setTimeout(async () => {
      logged.current = key;
      queryId.current = undefined;
      try {
        const response = await fetch(`/api/help/search?${params(q, filters, true)}`);
        if (response.ok) queryId.current = ((await response.json()) as HelpSearchResponse).queryId;
      } catch {
        // Logging is best-effort.
      }
    }, SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [query, filters, params]);

  const words = terms(query);
  const showing = words.join("").length >= 2;
  const results = showing ? (data?.results ?? []) : [];

  const opened = (card: HelpCard) => {
    const body = JSON.stringify(
      queryId.current
        ? { articleId: card.id, queryId: queryId.current }
        : { articleId: card.id, q: query.trim(), locale, resultCount: data?.total ?? 0 },
    );
    navigator.sendBeacon?.("/api/help/search/click", new Blob([body], { type: "application/json" }));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === "Enter" && active >= 0 && results[active]) {
      event.preventDefault();
      opened(results[active]);
      router.push(localeHref(locale, path(results[active])));
    } else if (event.key === "Escape") {
      setQuery("");
      setActive(-1);
    }
  };

  const toggle = (key: keyof Filters, value: string) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? "" : value }));

  return (
    <div>
      <form role="search" className="mk-help-search mk-help-search-lg" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="help-search-q" className="mk-sr-only">
          {s.label}
        </label>
        <Icon name="scan" size={18} className="flex-none text-[var(--text-faint)]" />
        <input
          id="help-search-q"
          name="q"
          type="search"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          maxLength={200}
          value={query}
          placeholder={s.placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="mk-bidi"
          // The reader came here to type.
          autoFocus={!initialQuery}
        />
        {query ? (
          <button type="button" className="mk-help-clear" onClick={() => setQuery("")}>
            <Icon name="close" size={16} label={s.clear} />
          </button>
        ) : null}
      </form>

      {showing && data && (data.facets.categories.length > 1 || data.facets.types.length > 1 || filters.category || filters.type) ? (
        <div role="group" aria-label={s.filters.label} className="mt-5 grid gap-3">
          <ChipRow
            label={s.filters.topic}
            all={s.filters.all}
            value={filters.category}
            options={data.facets.categories.map((f) => ({ value: String(f.id), label: f.title, count: f.count }))}
            onPick={(v) => toggle("category", v)}
          />
          <ChipRow
            label={s.filters.type}
            all={s.filters.all}
            value={filters.type}
            options={data.facets.types.map((f) => ({ value: f.type, label: c.articleType[f.type], count: f.count }))}
            onPick={(v) => toggle("type", v)}
          />
        </div>
      ) : null}

      <p aria-live="polite" className="mk-bidi mt-6 text-[length:var(--fs-ui)] text-[var(--text-muted)]">
        {!showing
          ? query.trim()
            ? s.hint
            : null
          : state === "error"
            ? s.error
            : state === "loading" && !data
              ? s.searching
              : data
                ? data.total > 0
                  ? s.status(data.total, query.trim())
                  : s.none(query.trim())
                : null}
      </p>

      {results.length > 0 ? (
        <ul id={listId} role="listbox" aria-label={s.results} className="mt-4 grid gap-3">
          {results.map((hit, i) => (
            <li key={hit.id} role="presentation" className="flex">
              <Result
                id={`${listId}-${i}`}
                locale={locale}
                hit={hit}
                words={words}
                active={i === active}
                onOpen={() => opened(hit)}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {showing && data && data.total === 0 ? (
        <div className="mt-6 grid gap-[clamp(2rem,4vw,3rem)]">
          {data.suggestions.length ? <CardList title={s.suggestions} cards={data.suggestions} locale={locale} /> : null}
          {data.popular?.length ? <CardList title={s.popular} cards={data.popular} locale={locale} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function Result({
  id,
  locale,
  hit,
  words,
  active,
  onOpen,
}: {
  id: string;
  locale: Locale;
  hit: HelpSearchHit;
  words: string[];
  active: boolean;
  onOpen: () => void;
}) {
  const c = HELP_COPY[locale];
  return (
    <Link
      id={id}
      role="option"
      aria-selected={active}
      tabIndex={-1}
      href={localeHref(locale, path(hit))}
      onClick={onOpen}
      className={`mk-help-row mk-help-hit group${active ? " is-active" : ""}`}
    >
      <span className="min-w-0">
        <span className="mk-bidi block text-[length:var(--fs-ui)] leading-[1.5] font-medium text-[var(--text)]">
          <Marked text={hit.title} words={words} />
        </span>
        {hit.snippet ? (
          <span className="mk-bidi mt-1.5 block text-[length:var(--fs-eyebrow)] leading-[1.6] text-[var(--text-muted)] line-clamp-2">
            <Marked text={hit.snippet} words={words} />
          </span>
        ) : null}
        <span className="mk-bidi mt-1.5 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          {[hit.categoryTitle, c.articleType[hit.type]].filter(Boolean).join(" · ")}
        </span>
      </span>
      <Icon name="chevron" size={14} className="mk-help-row-mark" />
    </Link>
  );
}

function Marked({ text, words }: { text: string; words: string[] }) {
  return (
    <>
      {highlight(text, words).map((part, i) => (part.hit ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>))}
    </>
  );
}

function ChipRow({
  label,
  all,
  value,
  options,
  onPick,
}: {
  label: string;
  all: string;
  value: string;
  options: { value: string; label: string; count: number }[];
  onPick: (value: string) => void;
}) {
  if (options.length < 2 && !value) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mk-bidi me-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{label}</span>
      <button type="button" aria-pressed={!value} className="mk-help-chip" onClick={() => value && onPick(value)}>
        {all}
      </button>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} className="mk-help-chip" onClick={() => onPick(o.value)}>
          <span className="mk-bidi">{o.label}</span>
          <span className="mk-help-chip-count">{o.count}</span>
        </button>
      ))}
    </div>
  );
}

function CardList({ title, cards, locale }: { title: string; cards: HelpCard[]; locale: Locale }) {
  const c = HELP_COPY[locale];
  return (
    <section>
      <h2 className="mk-help-h2 mk-bidi">{title}</h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {cards.map((card) => (
          <li key={card.id} className="flex">
            <Link href={localeHref(locale, path(card))} className="mk-help-row group">
              <span className="min-w-0">
                <span className="mk-bidi block text-[length:var(--fs-ui)] font-medium text-[var(--text)] mk-underline-reveal">{card.title}</span>
                <span className="mk-bidi mt-1.5 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                  {[card.categoryTitle, c.articleType[card.type]].filter(Boolean).join(" · ")}
                </span>
              </span>
              <Icon name="chevron" size={14} className="mk-help-row-mark" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
