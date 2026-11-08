import type { Payload } from "payload";

/*
 * Turning rows of page views into the handful of numbers worth looking at.
 *
 * Aggregated in JavaScript rather than SQL, because the two database adapters
 * (Postgres in production, SQLite locally) do not agree on date functions, and
 * a dashboard that only works on one of them is a dashboard nobody trusts.
 *
 * That choice has a ceiling. Each call reads the window's rows into memory,
 * which is fine for a marketing site's traffic and wrong somewhere past a
 * million rows a month. `MAX_ROWS` makes the ceiling explicit rather than
 * letting the admin panel quietly get slower: when the dashboard starts
 * reporting that it is sampling, it is time for a nightly rollup into a
 * daily-totals table. The fields on `pageviews` are chosen so that rollup is a
 * plain GROUP BY.
 */

const MAX_ROWS = 50_000;

export type Totals = {
  views: number;
  visitors: number;
  /** Percent change against the preceding window of the same length. */
  viewsChange: number | null;
  visitorsChange: number | null;
};

export type Breakdown = { label: string; value: number; share: number }[];

export type AnalyticsSummary = {
  days: number;
  totals: Totals;
  daily: { date: string; views: number }[];
  topPages: Breakdown;
  topReferrers: Breakdown;
  locales: Breakdown;
  devices: Breakdown;
  countries: Breakdown;
  /** True when the window hit MAX_ROWS and the numbers are a floor, not a total. */
  sampled: boolean;
  /** Nothing has been recorded yet — the dashboard shows setup help instead of zeroes. */
  empty: boolean;
};

type Row = {
  path?: string | null;
  locale?: string | null;
  device?: string | null;
  referrerHost?: string | null;
  visitor?: string | null;
  country?: string | null;
  createdAt?: string | null;
};

const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/** Percent change, or null when there is no baseline to compare against. */
function change(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function rank(rows: Row[], key: keyof Row, limit = 8): Breakdown {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = row[key];
    if (typeof value !== "string" || value === "") continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({
      label,
      value,
      share: total === 0 ? 0 : Math.round((value / total) * 100),
    }));
}

const uniqueVisitors = (rows: Row[]): number =>
  new Set(rows.map((r) => r.visitor).filter(Boolean)).size;

async function fetchRows(payload: Payload, since: Date, until?: Date): Promise<Row[]> {
  const result = await payload.find({
    collection: "pageviews",
    // `pagination: false` with an explicit limit: we want the whole window,
    // but never an unbounded read that could stall the admin panel.
    pagination: false,
    limit: MAX_ROWS,
    depth: 0,
    where: {
      createdAt: until
        ? { greater_than_equal: since.toISOString(), less_than: until.toISOString() }
        : { greater_than_equal: since.toISOString() },
    },
  });
  return result.docs as unknown as Row[];
}

/**
 * Everything the dashboard shows, for a window of `days`.
 *
 * Two windows are read: the one being shown and the one before it, so each
 * headline number can carry a direction. A number with no comparison is just
 * a number — "412 visits" means nothing until you know last week was 280.
 */
export async function getAnalytics(payload: Payload, days = 30): Promise<AnalyticsSummary> {
  const since = daysAgo(days);
  const previousSince = daysAgo(days * 2);

  const [rows, previousRows] = await Promise.all([
    fetchRows(payload, since),
    fetchRows(payload, previousSince, since),
  ]);

  // Views per day across the whole window, zero-filled — a chart with gaps
  // where the quiet days were reads as missing data rather than a quiet day.
  const byDay = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    byDay.set(daysAgo(i).toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    if (!row.createdAt) continue;
    const key = new Date(row.createdAt).toISOString().slice(0, 10);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }

  const visitors = uniqueVisitors(rows);

  return {
    days,
    totals: {
      views: rows.length,
      visitors,
      viewsChange: change(rows.length, previousRows.length),
      visitorsChange: change(visitors, uniqueVisitors(previousRows)),
    },
    daily: [...byDay.entries()].map(([date, views]) => ({ date, views })),
    topPages: rank(rows, "path"),
    topReferrers: rank(rows, "referrerHost"),
    locales: rank(rows, "locale", 2),
    devices: rank(rows, "device", 3),
    countries: rank(rows, "country", 6),
    sampled: rows.length >= MAX_ROWS,
    empty: rows.length === 0 && previousRows.length === 0,
  };
}

/**
 * The field that says a document exists in a given language.
 *
 * A Payload document is one row with a column per locale per localized field,
 * so "does this guide exist in English?" is not a flag on the document — it is
 * whether the English side of its fields was ever filled in. One field per
 * collection answers that, and it has to be a localized one.
 *
 * All five use `title`, which is `required` on every editorial collection and
 * therefore present in exactly the languages somebody has written.
 *
 * Comparisons used to be the exception and asked about `intro`, because the
 * collection had no localized title — `competitorName` was the title and is
 * deliberately not localized ("a product name is a product name"), so asking
 * about it would have reported every comparison complete in both languages.
 * That collection was reshaped on 8 Nov 2026 and has a real localized title
 * now, and this map kept asking for a field that no longer exists: every
 * dashboard load answered `QueryError: The following path cannot be queried:
 * intro`, and the whole admin home 500ed. Worth remembering that a field
 * named in a string is not a field the type checker watches.
 */
const LOCALE_FIELD: Record<string, string> = {
  posts: "title",
  guides: "title",
  helpArticles: "title",
  comparisons: "title",
  updates: "title",
};

export type LocaleCoverage = {
  code: string;
  label: string;
  /** Documents that have been written in this language. */
  written: number;
};

export type ContentStats = {
  label: string;
  slug: string;
  published: number;
  drafts: number;
  total: number;
  locales: LocaleCoverage[];
}[];

/**
 * The locales the CMS is configured for, in the order the config lists them.
 *
 * Read off the running config rather than written out again, so the dashboard
 * cannot drift from `payload.config.ts` — adding a third language should make
 * a third row appear and nothing else.
 */
function configuredLocales(payload: Payload): { code: string; label: string }[] {
  const localization = payload.config.localization;
  if (!localization) return [];
  return localization.locales.map((locale) => ({
    code: locale.code,
    // A label may be given per admin language; the config uses plain strings.
    label: typeof locale.label === "string" ? locale.label : locale.code,
  }));
}

/**
 * How much content exists, how much is sitting unpublished, and how much of
 * it has been written in each language.
 *
 * Scoped to the sections the viewer can actually open, so a writer with only
 * the blog does not get a count of comparison pages they cannot see.
 *
 * The language counts are the reason this is five queries per section rather
 * than two. They are what the dashboard is for on a bilingual site: "fourteen
 * guides, nine of them in English" is the sentence somebody needs, and it is
 * not derivable from a total.
 */
export async function getContentStats(
  payload: Payload,
  sections: { slug: string; label: string }[],
): Promise<ContentStats> {
  const locales = configuredLocales(payload);

  return Promise.all(
    sections.map(async ({ slug, label }) => {
      const field = LOCALE_FIELD[slug];

      const [published, drafts, ...written] = await Promise.all([
        payload.count({
          collection: slug as "posts",
          where: { _status: { equals: "published" } },
        }),
        payload.count({
          collection: slug as "posts",
          where: { _status: { not_equals: "published" } },
        }),
        ...locales.map((locale) =>
          payload.count({
            collection: slug as "posts",
            locale: locale.code as "en",
            where: { [field]: { exists: true } },
          }),
        ),
      ]);

      return {
        label,
        slug,
        published: published.totalDocs,
        drafts: drafts.totalDocs,
        total: published.totalDocs + drafts.totalDocs,
        locales: locales.map((locale, i) => ({
          ...locale,
          written: written[i]?.totalDocs ?? 0,
        })),
      };
    }),
  );
}
