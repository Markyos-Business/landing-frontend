import React from "react";
import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { getAnalytics, getContentStats } from "../analytics";
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
 */

const fmt = new Intl.NumberFormat("en-US");

function Delta({ value }: { value: number | null }) {
  if (value === null) return null;
  const tone = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={`mk-delta mk-delta--${tone}`}>
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
  if (rows.length === 0) return <p className="mk-empty">{emptyLabel}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="mk-bars">
      {rows.map((row) => (
        <li key={row.label}>
          {/* The bar is a background behind the label rather than a separate
              element, so a long path stays readable instead of being
              squeezed into whatever the bar leaves over. */}
          <span className="mk-bar" style={{ width: `${(row.value / max) * 100}%` }} />
          <span className="mk-bar-label">{row.label}</span>
          <span className="mk-bar-value">{fmt.format(row.value)}</span>
        </li>
      ))}
    </ul>
  );
}

function Sparkline({ data }: { data: { date: string; views: number }[] }) {
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <div className="mk-spark" role="img" aria-label={`Daily views for the last ${data.length} days`}>
      {data.map((d) => (
        <span
          key={d.date}
          className="mk-spark-col"
          // 2% floor so a zero day is still a visible tick rather than a gap
          // that reads as missing data.
          style={{ height: `${Math.max((d.views / max) * 100, 2)}%` }}
          title={`${d.date}: ${d.views}`}
        />
      ))}
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
    <div className="mk-dash">
      <DashboardStyles />

      <header className="mk-dash-head">
        <h1>{name ? `Welcome back, ${name}` : "Dashboard"}</h1>
        <p>
          {isAdmin
            ? "Everything on markyos.com — the website's own copy, the blog, and how the site is doing."
            : "The sections you have been given access to."}
        </p>
      </header>

      {/* ── What needs doing ─────────────────────────────────────────── */}
      {visibleSections.length > 0 ? (
        <section className="mk-card">
          <h2>Your content</h2>
          {totalDrafts > 0 ? (
            <p className="mk-note">
              {totalDrafts === 1
                ? "1 draft is waiting."
                : `${totalDrafts} drafts are waiting.`}{" "}
              {isAdmin ? "Only an admin can publish." : "An admin publishes them."}
            </p>
          ) : null}

          {/*
           * Each tile is a panel of links, not one big link.
           *
           * It used to be a single <Link> wrapping the whole tile, which read
           * well and left two things with nowhere to go: the draft count
           * announced that work was waiting without taking you to it, and
           * starting a post meant leaving the dashboard for the sidebar,
           * finding the collection and pressing Create. Both are now one
           * click from the number that prompted them.
           *
           * Links cannot nest, so the tile stopped being one. The section
           * name carries the main target and the row keeps the same hit area
           * it had.
           */}
          <div className="mk-grid">
            {stats.map((s) => (
              <div key={s.slug} className="mk-tile">
                <Link className="mk-tile-label" href={`/admin/collections/${s.slug}`}>
                  {s.label}
                </Link>
                <span className="mk-tile-value">{fmt.format(s.published)}</span>
                <span className="mk-tile-sub">published</span>

                <span className="mk-tile-foot">
                  {s.drafts > 0 ? (
                    /*
                     * Straight to the drafts, not to the whole list. Payload
                     * reads its list filters from the query string, so the
                     * link is the filter — no view to configure and nothing
                     * to keep in step if the column set changes.
                     */
                    <Link
                      className="mk-tile-drafts"
                      href={`/admin/collections/${s.slug}?where[_status][equals]=draft`}
                    >
                      {fmt.format(s.drafts)} draft{s.drafts === 1 ? "" : "s"}
                    </Link>
                  ) : (
                    <span className="mk-tile-clear">No drafts</span>
                  )}
                  <Link className="mk-tile-new" href={`/admin/collections/${s.slug}/create`}>
                    New
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mk-card">
          <h2>No sections yet</h2>
          <p className="mk-empty">
            Your account has not been given access to any content. An admin can assign sections
            under Settings → Users.
          </p>
        </section>
      )}

      {/* ── Traffic. Admins only. ────────────────────────────────────── */}
      {isAdmin && analytics ? (
        analytics.empty ? (
          <section className="mk-card">
            <h2>Traffic</h2>
            <p className="mk-empty">
              No page views recorded yet. Views are counted first-party, without cookies and
              without storing anyone&rsquo;s IP address, so there is nothing to switch on — numbers
              appear here once the site is live and someone visits it.
            </p>
          </section>
        ) : (
          <>
            <section className="mk-card">
              <div className="mk-card-head">
                <h2>Traffic</h2>
                <span className="mk-muted">Last {analytics.days} days</span>
              </div>

              <div className="mk-figures">
                <div>
                  <span className="mk-figure">{fmt.format(analytics.totals.views)}</span>
                  <span className="mk-figure-label">
                    Page views <Delta value={analytics.totals.viewsChange} />
                  </span>
                </div>
                <div>
                  <span className="mk-figure">{fmt.format(analytics.totals.visitors)}</span>
                  <span className="mk-figure-label">
                    Visitors <Delta value={analytics.totals.visitorsChange} />
                  </span>
                </div>
              </div>

              <Sparkline data={analytics.daily} />

              {analytics.sampled ? (
                <p className="mk-note">
                  Showing the most recent 50,000 views — the real totals are higher. Time to roll
                  these up nightly; see the note in cms/analytics.ts.
                </p>
              ) : null}
            </section>

            <div className="mk-columns">
              <section className="mk-card">
                <h2>Top pages</h2>
                <Bars rows={analytics.topPages} emptyLabel="No pages yet." />
              </section>

              <section className="mk-card">
                <h2>Where people come from</h2>
                <Bars
                  rows={analytics.topReferrers}
                  emptyLabel="No referrers yet. Direct visits and private browsing report none."
                />
              </section>

              <section className="mk-card">
                <h2>Language</h2>
                <Bars rows={analytics.locales} emptyLabel="No data yet." />
              </section>

              <section className="mk-card">
                <h2>Device</h2>
                <Bars rows={analytics.devices} emptyLabel="No data yet." />
              </section>

              {analytics.countries.length > 0 ? (
                <section className="mk-card">
                  <h2>Country</h2>
                  <Bars rows={analytics.countries} emptyLabel="No data yet." />
                </section>
              ) : null}
            </div>
          </>
        )
      ) : null}

      {/* ── Website copy. Admins only. ───────────────────────────────── */}
      {isAdmin ? (
        <section className="mk-card">
          <h2>The website itself</h2>
          <p className="mk-note">
            These override the copy that ships with the site. Leave a field empty and the approved
            copy is used.
          </p>
          <div className="mk-grid">
            <Link className="mk-tile" href="/admin/globals/homepage">
              <span className="mk-tile-label">Homepage</span>
              <span className="mk-tile-sub">Every section, both languages</span>
            </Link>
            <Link className="mk-tile" href="/admin/globals/navigation">
              <span className="mk-tile-label">Navigation</span>
              <span className="mk-tile-sub">Header and footer links</span>
            </Link>
            <Link className="mk-tile" href="/admin/globals/announcement">
              <span className="mk-tile-label">Announcement bar</span>
              <span className="mk-tile-sub">The strip above the header</span>
            </Link>
            <Link className="mk-tile" href="/admin/globals/siteSettings">
              <span className="mk-tile-label">Site settings</span>
              <span className="mk-tile-sub">Search and social metadata</span>
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default Dashboard;
