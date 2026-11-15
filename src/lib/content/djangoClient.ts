import "server-only";

/*
 * The platform's public content API, as this site's server sees it.
 *
 * `CONTENT_API_URL` is the platform API root, for example
 * https://api-staging.markyos.com/api/v1. It always points at the app's Django backend; there is no
 * secondary CMS fallback. `CONTENT_SITE_KEY` is the secret the two share: the platform signs
 * its "rebuild these pages" call with it, and this site signs page views.
 */

export const CONTENT_TAG = "content";

import { contentApiUrl } from "./connection";
export { contentApiUrl } from "./connection";

export const contentSiteKey = (): string => process.env.CONTENT_SITE_KEY ?? "";

/** Relative media URLs (local development) made absolute against the API's origin. */
function absolute(value: unknown, origin: string): unknown {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) return `${origin}${value}`;
  if (Array.isArray(value)) return value.map((v) => absolute(v, origin));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "body" ? v : absolute(v, origin)]));
  }
  return value;
}

/**
 * A cached GET. `null` for a 404 (unpublished, or never written); any other
 * failure throws, for the caller's fallback to catch.
 */
export async function contentApi<T>(path: string, tags: string[]): Promise<T | null> {
  const root = contentApiUrl();
  if (!root) throw new Error("CONTENT_API_URL is not set");
  const response = await fetch(`${root}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600, tags },
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${response.status} from ${path}`);
  return absolute(await response.json(), new URL(root).origin) as T;
}
