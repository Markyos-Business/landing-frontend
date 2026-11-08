import React from "react";
import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { getAnalytics, getContentStats } from "../analytics";
import type { ContentStats } from "../analytics";
import { SECTIONS, SECTION_LABELS, isAdminUser, sectionsOf } from "../access";
import { DashboardStyles } from "./DashboardStyles";

/*
 * The admin home screen.
 *
 * Replaces Payload's default dashboard, which is a list of collection cards —
 * useful once, then never looked at again. This answers the questions someone
 * actually opens the admin to ask: is anything waiting to be published, how is
 * the site doing, and where do I go next.
 *
 * ── What this panel is for, as of 8 Nov 2026 ──────────────────────────────
 *
 * The four resources and the numbers. The website's own copy used to be
 * editable here through four globals; they were removed, and the marketing
 * copy is the codebase's again. So the screen has exactly two jobs: get you
 * into the right resource in the right language, and show whether the site is
 * being read.
 *
 * ── Why every resource card is split by language ──────────────────────────
 *
 * A document is one record with a column per locale, so "nine guides" can
 * mean nine in Arabic and four in English, and the single number hides the
 * only question that matters on a bilingual site. Each card therefore carries
 * a row per configured locale, and each row is a link into that collection's
 * list *at that locale* — where Payload prints `<No Title>` against anything
 * unwritten, which is the fastest way to see what is missing.
 *
 * ── What each person sees ───────────────────────────────────────────────────
 *
 * An admin sees everything, including traffic. Everyone else sees only the
 * sections they were given, and **no analytics at all** — traffic is a
 * business number, and a freelance writer with access to the blog has no
 * reason to have it. That gate is enforced here *and* by `Pageviews.access`,
 * so it holds even if this component were reached another way.
 *
 * A Server Component: it reads through the Local API, so nothing about the
 * database or the numbers reaches the browser except the rendered figures.
 *
 * The look is the website's — see the header of DashboardStyles.tsx.
 */

const fmt = new Intl.NumberFormat("en-US");

/*
 * `12 Sep`, never the US order (§11). UTC because the keys are ISO dates
 * produced from `toISOString()`, and reading them back in a western timezone
 * would land the label on the day before.
 */
const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const formatDay = (iso: string) => day.format(new Date(`${iso}T00:00:00Z`));

function Delta({ value }: { value: number | null }) {
  if (value === null) return null;
  const tone = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={`mkd-delta mkd-delta--${tone}`}>
      {sign}
      {value}%
    </span>
  );
}

function Bars({
  rows,
  emptyLabel,
}: {
  rows: { label: string; value: number; share: number }[];
  emptyLabel: string;
}) {
  if (rows.length === 0) return <p className="mkd-empty">{emptyLabel}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="mkd-bars">
      {rows.map((row) => (
        <li key={row.label}>
          {/* The bar is a background behind the label rather than a separate
              element, so a long path stays readable instead of being
              squeezed into whatever the bar leaves over. */}
          <span className="mkd-bar" style={{ width: `${(row.value / max) * 100}%` }} />
          <span className="mkd-bar-label">{row.label}</span>
          <span className="mkd-bar-value">{fmt.format(row.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One row per language, inside a resource card.
 *
 * The denominator is every document in the collection, published or not,
 * because the question is "how much of this has been written in Arabic", and
 * a draft has been written. The bar is a data bar, which is the one job §1.4
 * gives the blue as a fill rather than as light.
 *
 * Each row links to the collection list at that locale. Payload reads
 * `?locale=` from the URL and prints `<No Title>` for a document with nothing
 * written in it, so the link lands on the list of exactly what is missing.
 */
function Locales({ section }: { section: ContentStats[number] }) {
  if (section.locales.length === 0) return null;

  return (
    <span className="mkd-locales">
      {section.locales.map((locale) => {
        const share = section.total === 0 ? 0 : (locale.written / section.total) * 100;
        const complete = section.total > 0 && locale.written === section.total;

        return (
          <Link
            key={locale.code}
            className="mkd-locale"
            href={`/admin/collections/${section.slug}?locale=${locale.code}`}
          >
            <span className="mkd-locale-name">{locale.label}</span>
            <span className="mkd-locale-track">
              <span className="mkd-locale-fill" style={{ width: `${share}%` }} />
            </span>
            {/*
             * The pair, not the percentage. "9/14" says how much work is left
             * and a percentage does not, and at these sizes the numbers are
             * small enough to read at a glance.
             */}
            <span className={`mkd-locale-count${complete ? " mkd-locale-count-done" : ""}`}>
              {section.total === 0
                ? "0"
                : `${fmt.format(locale.written)}/${fmt.format(section.total)}`}
            </span>
          </Link>
        );
      })}
    </span>
  );
}

function Sparkline({ data }: { data: { date: string; views: number }[] }) {
  const max = Math.max(...data.map((d) => d.views), 1);
  const first = data[0];
  const last = data[data.length - 1];

  return (
    <div>
      <div
        className="mkd-spark"
        role="img"
        aria-label={`Daily views for the last ${data.length} days`}
      >
        {data.map((d) => (
          <span
            key={d.date}
            className="mkd-spark-col"
            // 2% floor so a zero day is still a visible tick rather than a gap
            // that reads as missing data.
            style={{ height: `${Math.max((d.views / max) * 100, 2)}%` }}
            title={`${formatDay(d.date)}: ${fmt.format(d.views)}`}
          />
        ))}
      </div>
      {/*
       * The window's two ends, named.
       *
       * A bar chart with no axis is a shape rather than a reading: "the spike
       * was three weeks ago" needs a date under it. Two labels are enough
       * here, because the bars are evenly spaced days and the hover title
       * carries the rest.
       */}
      {first && last ? (
        <div className="mkd-spark-axis">
          <span>{formatDay(first.date)}</span>
          <span>{formatDay(last.date)}</span>
        </div>
      ) : null}
    </div>
  );
}

export async function Dashboard(props: AdminViewServerProps) {
  const { payload, user } = props.initPageResult.req;

  const isAdmin = isAdminUser(user);
  const allowed = sectionsOf(user);

  const visibleSections = SECTIONS.filter((s) => allowed.includes(s)).map((slug) => ({
    slug,
    label: SECTION_LABELS[slug],
  }));

  const [analytics, stats] = await Promise.all([
    isAdmin ? getAnalytics(payload, 30) : Promise.resolve(null),
    visibleSections.length > 0
      ? getContentStats(payload, visibleSections)
      : Promise.resolve([]),
  ]);

  const name = (user as { name?: string } | null)?.name ?? "";
  const totalDrafts = stats.reduce((sum, s) => sum + s.drafts, 0);

  return (
    /*
     * An LTR island, the way product mocks are.
     *
     * Payload mirrors the whole panel when the admin's language is Arabic,
     * and this view's copy is English — none of it goes through `i18n`. A
     * mirrored English page does not just look odd, it reads wrong: UAX9
     * resolves each line against an RTL base, so "7 Nov" came out "Nov 7" on
     * the chart's axis and every sentence's full stop jumped to the front of
     * it. Stating the direction on the one untranslated view fixes both,
     * leaves the shell around it mirrored, and is the same carve-out the site
     * grants its product mocks.
     *
     * Delete the `dir` the day this view is translated — the layout inside
     * is written in logical properties and will mirror on its own.
     */
    <div className="mkd" dir="ltr">
      <DashboardStyles />

      <header className="mkd-head">
        <span className="mkd-eyebrow">Markyos CMS</span>
        {/*
         * The site's one headline move: the sentence lands in blue. Here the
         * closing clause is the person's name, which is the only part of this
         * line that changes.
         */}
        <h1 className="mkd-title">
          {name ? (
            <>
              Welcome back, <span className="mkd-title-accent">{name}</span>
            </>
          ) : (
            "Dashboard"
          )}
        </h1>
        <p className="mkd-lead">
          {isAdmin
            ? "The blog, the guides, the help centre, the comparisons and what's new, in both languages, and how the site is doing."
            : "The sections you have been given access to."}
        </p>
      </header>

      {/* ── What needs doing ─────────────────────────────────────────── */}
      {visibleSections.length > 0 ? (
        <section className="mkd-section">
          <div className="mkd-section-head">
            <h2 className="mkd-h2">Resources</h2>
            {totalDrafts > 0 ? (
              <span className="mkd-meta">
                {totalDrafts === 1
                  ? "1 draft is waiting."
                  : `${totalDrafts} drafts are waiting.`}{" "}
                {isAdmin ? "Only an admin can publish." : "An admin publishes them."}
              </span>
            ) : null}
          </div>

          {/*
           * Each tile is a panel of links, not one big link.
           *
           * It used to be a single <Link> wrapping the whole tile, which read
           * well and left two things with nowhere to go: the draft count
           * announced that work was waiting without taking you to it, and
           * starting a post meant leaving the dashboard for the sidebar,
           * finding the collection and pressing Create. Both are now one
           * click from the number that prompted them, and so is each
           * language.
           *
           * Links cannot nest, so the tile stopped being one.
           */}
          <div className="mkd-tiles mkd-tiles-wide">
            {stats.map((s) => (
              <div key={s.slug} className="mkd-tile">
                <Link className="mkd-tile-name" href={`/admin/collections/${s.slug}`}>
                  {s.label}
                </Link>
                <span className="mkd-tile-value">{fmt.format(s.total)}</span>
                <span className="mkd-tile-sub">
                  {s.total === 0
                    ? "nothing yet"
                    : s.published === s.total
                      ? "all published"
                      : `${fmt.format(s.published)} published`}
                </span>

                <Locales section={s} />

                <span className="mkd-tile-foot">
                  {s.drafts > 0 ? (
                    /*
                     * Straight to the drafts, not to the whole list. Payload
                     * reads its list filters from the query string, so the
                     * link is the filter — no view to configure and nothing
                     * to keep in step if the column set changes.
                     */
                    <Link
                      className="mkd-drafts"
                      href={`/admin/collections/${s.slug}?where[_status][equals]=draft`}
                    >
                      {fmt.format(s.drafts)} draft{s.drafts === 1 ? "" : "s"}
                    </Link>
                  ) : (
                    <span className="mkd-clear">No drafts</span>
                  )}
                  <Link className="mkd-new" href={`/admin/collections/${s.slug}/create`}>
                    New
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mkd-card">
          <h2 className="mkd-h2">No sections yet</h2>
          <p className="mkd-empty">
            Your account has not been given access to any content. An admin can assign sections
            under Settings → Users.
          </p>
        </section>
      )}

      {/* ── Traffic. Admins only. ────────────────────────────────────── */}
      {isAdmin && analytics ? (
        analytics.empty ? (
          <section className="mkd-card">
            <h2 className="mkd-h2">Traffic</h2>
            <p className="mkd-empty">
              No page views recorded yet. Views are counted first-party, without cookies and
              without storing anyone&rsquo;s IP address, so there is nothing to switch on — numbers
              appear here once the site is live and someone visits it.
            </p>
          </section>
        ) : (
          <>
            <section className="mkd-card mkd-traffic">
              <div className="mkd-card-head">
                <h2 className="mkd-h2">Traffic</h2>
                <span className="mkd-meta">Last {analytics.days} days</span>
              </div>

              <div className="mkd-figures">
                <div>
                  <span className="mkd-figure-value">{fmt.format(analytics.totals.views)}</span>
                  <span className="mkd-figure-label">
                    Page views <Delta value={analytics.totals.viewsChange} />
                  </span>
                </div>
                <div>
                  <span className="mkd-figure-value">{fmt.format(analytics.totals.visitors)}</span>
                  <span className="mkd-figure-label">
                    Visitors <Delta value={analytics.totals.visitorsChange} />
                  </span>
                </div>
              </div>

              <Sparkline data={analytics.daily} />

              {analytics.sampled ? (
                <p className="mkd-note" style={{ marginBlock: "1rem 0" }}>
                  Showing the most recent 50,000 views — the real totals are higher. Time to roll
                  these up nightly; see the note in cms/analytics.ts.
                </p>
              ) : null}
            </section>

            {/*
             * Two shapes, not one flow. The two long lists get half the width
             * each; the three short ones share a row of thirds. See the note
             * on `.mkd-pair` in DashboardStyles.tsx.
             */}
            <div className="mkd-pair">
              <section className="mkd-card">
                <h2 className="mkd-h2">Top pages</h2>
                <Bars rows={analytics.topPages} emptyLabel="No pages yet." />
              </section>

              <section className="mkd-card">
                <h2 className="mkd-h2">Where people come from</h2>
                <Bars
                  rows={analytics.topReferrers}
                  emptyLabel="No referrers yet. Direct visits and private browsing report none."
                />
              </section>
            </div>

            <div className="mkd-trio">
              <section className="mkd-card">
                <h2 className="mkd-h2">Language</h2>
                <Bars rows={analytics.locales} emptyLabel="No data yet." />
              </section>

              <section className="mkd-card">
                <h2 className="mkd-h2">Device</h2>
                <Bars rows={analytics.devices} emptyLabel="No data yet." />
              </section>

              <section className="mkd-card">
                <h2 className="mkd-h2">Country</h2>
                <Bars
                  rows={analytics.countries}
                  emptyLabel="No data yet. Country comes from the edge, so it is blank in local development."
                />
              </section>
            </div>
          </>
        )
      ) : null}

      {/* ── Everything the resources are built from ──────────────────── */}
      {visibleSections.length > 0 ? (
        <section className="mkd-section">
          <div className="mkd-section-head">
            <h2 className="mkd-h2">Library and taxonomy</h2>
            <span className="mkd-meta">
              What the resources are assembled from. Images, and the authors,
              categories and tags they are filed under.
            </span>
          </div>
          <div className="mkd-tiles">
            <Link className="mkd-tile" href="/admin/collections/media">
              <span className="mkd-tile-name">Media</span>
              <span className="mkd-link-sub">Images and files, resized on upload</span>
            </Link>
            <Link className="mkd-tile" href="/admin/collections/authors">
              <span className="mkd-tile-name">Authors</span>
              <span className="mkd-link-sub">Bylines on posts and guides</span>
            </Link>
            <Link className="mkd-tile" href="/admin/collections/categories">
              <span className="mkd-tile-name">Categories</span>
              <span className="mkd-link-sub">The blog index filters on these</span>
            </Link>
            <Link className="mkd-tile" href="/admin/collections/tags">
              <span className="mkd-tile-name">Tags</span>
              <span className="mkd-link-sub">Free-form, shown on an article</span>
            </Link>
          </div>
        </section>
      ) : null}

    </div>
  );
}

export default Dashboard;
