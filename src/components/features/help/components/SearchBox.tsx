import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon } from "@/components/ui";
import type { useHelpSearch } from "../hooks/useHelpSearch";
import type { HelpLabels } from "../types";

/* The search field and its suggestion panel — the combobox. */
export function SearchBox({
  search,
  labels,
  locale,
}: {
  search: ReturnType<typeof useHelpSearch>;
  labels: HelpLabels;
  locale: Locale;
}) {
  return (
    <div
      className="mk-help-search mk-load-move"
      onBlur={search.onSearchBlur}
    >
      <label htmlFor={search.fieldId} className="mk-sr-only">
        {labels.search}
      </label>
      <Icon name="scan" size={17} className="flex-none text-[var(--text-faint)]" />
      <input
        id={search.fieldId}
        type="search"
        role="combobox"
        aria-expanded={search.showing}
        aria-controls={search.listId}
        aria-autocomplete="list"
        aria-activedescendant={
          search.showing && search.active >= 0 ? `${search.listId}-${search.active}` : undefined
        }
        autoComplete="off"
        value={search.query}
        onChange={(event) => search.onQueryChange(event.target.value)}
        onFocus={search.onQueryFocus}
        onKeyDown={search.onQueryKeyDown}
        placeholder={labels.placeholder}
        /* `mk-bidi` so an Arabic query and a Latin one each sit on their
           own reading edge inside the same field. */
        className="mk-bidi"
      />
      {search.query ? (
        <button
          type="button"
          onClick={search.clearQuery}
          className="mk-help-clear"
        >
          <Icon name="close" size={15} label={labels.clear} />
        </button>
      ) : null}

      {search.showing ? (
        <ul id={search.listId} role="listbox" aria-label={labels.suggestions} className="mk-suggest">
          {search.suggestions.map((post, i) => (
            <li key={post.slug}>
              <Link
                id={`${search.listId}-${i}`}
                role="option"
                aria-selected={i === search.active}
                /* Out of the tab order: focus stays on the input and the
                   highlight is carried by `aria-activedescendant`, which
                   is what the combobox pattern asks for. */
                tabIndex={-1}
                ref={(element) => {
                  search.optionRefs.current[i] = element;
                }}
                href={localeHref(locale, `/help/${post.slug}`)}
                onMouseEnter={() => search.setActive(i)}
                className={`mk-suggest-row${i === search.active ? " is-active" : ""}`}
              >
                <span className="mk-bidi mk-suggest-title">{post.title}</span>
                <span className="mk-bidi mk-suggest-meta">{post.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
