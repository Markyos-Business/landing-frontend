import { contentApiUrl } from "./connection";
/*
 * Redirects from the platform's CMS (/admin/cms/redirects), for src/proxy.ts.
 *
 * An editor adds "/old-path → /new-path" when a page moves; it applies to
 * both languages (`/old-path` and `/en/old-path`) and takes effect within a
 * minute, with no deploy.
 *
 * The list is small and read on every request, so it is held in memory per
 * server instance and refreshed in the background once it is a minute old:
 * only an instance's very first request waits for it, and then for at most
 * a second and a half. If the platform can't be reached the last list keeps
 * working (or none, at first), so a platform outage never stops the site.
 *
 * Uses the same backend origin as article reads and page-view writes.
 */

type Rule = { to: string; status: 301 | 302 };

const FRESH_MS = 60_000;
let rules = new Map<string, Rule>();
let loadedAt = 0;
let loading: Promise<void> | null = null;

const apiUrl = contentApiUrl;

/** "/a/b/" and "/a/b" are one path. */
const normal = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

/** Only paths on this site: anything else would make it an open redirect. */
const local = (path: unknown): path is string => typeof path === "string" && path.startsWith("/") && !path.startsWith("//");

async function load(): Promise<void> {
  try {
    const response = await fetch(`${apiUrl()}/content/public/redirects/`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return;
    const data = (await response.json()) as { results?: { fromPath?: unknown; toPath?: unknown; statusCode?: unknown }[] };
    const next = new Map<string, Rule>();
    for (const r of data.results ?? []) {
      if (!local(r.fromPath) || !local(r.toPath)) continue;
      next.set(normal(r.fromPath), { to: r.toPath, status: r.statusCode === 302 ? 302 : 301 });
    }
    rules = next;
  } catch {
    // Keep the last list. See the note at the top.
  } finally {
    loadedAt = Date.now();
    loading = null;
  }
}

/** Where `path` (without its language) should go, or null. */
export async function redirectFor(path: string): Promise<Rule | null> {
  if (!apiUrl()) return null;
  if (Date.now() - loadedAt > FRESH_MS) {
    loading ??= load();
    // Only the first load is waited for; later ones refresh behind the request.
    if (loadedAt === 0) await loading;
  }
  const rule = rules.get(normal(path));
  // A rule onto itself would loop for ever.
  return rule && normal(rule.to) !== normal(path) ? rule : null;
}
