import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon } from "@/components/ui";
import type { HelpLabels, HelpPost } from "../types";

/* The heading over the list, the live result count, and the filtered rows. */
export function ArticleList({
  shown,
  picked,
  searching,
  labels,
  readingTimes,
  resultWords,
  locale,
}: {
  shown: HelpPost[];
  picked: string | null;
  searching: boolean;
  labels: HelpLabels;
  readingTimes: Record<string, string>;
  resultWords: string[];
  locale: Locale;
}) {
  return (
    <>
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
