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

export type ContentStats = {
  label: string;
  slug: string;
  published: number;
  drafts: number;
}[];

/**
 * How much content exists, and how much of it is sitting unpublished.
 *
 * Scoped to the sections the viewer can actually open, so a writer with only
 * the blog does not get a count of comparison pages they cannot see.
 */
export async function getContentStats(
  payload: Payload,
  sections: { slug: string; label: string }[],
): Promise<ContentStats> {
  return Promise.all(
    sections.map(async ({ slug, label }) => {
      const [published, drafts] = await Promise.all([
        payload.count({
          collection: slug as "posts",
          where: { _status: { equals: "published" } },
        }),
        payload.count({
          collection: slug as "posts",
          where: { _status: { not_equals: "published" } },
        }),
      ]);
      return { label, slug, published: published.totalDocs, drafts: drafts.totalDocs };
    }),
  );
}
