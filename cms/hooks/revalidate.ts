import type { CollectionAfterChangeHook } from "payload";

/*
 * Push an edit onto the live site.
 *
 * The marketing pages are statically rendered — that is most of why the site
 * is fast — which means a CMS edit does nothing visible until the page is
 * rebuilt. On-demand revalidation is what closes that gap: Payload saves, this
 * hook tells Next which paths are stale, and the next visitor gets the new
 * version. No redeploy, no waiting for a timer.
 *
 * Both locales are revalidated together. An edit to a localized field changes
 * only one language, but an edit to a shared field (a hero image, a slug)
 * changes both, and working out which case it was costs more than simply
 * refreshing two cheap static pages.
 *
 * `revalidatePath` is imported lazily and the whole thing is wrapped in
 * try/catch on purpose: these hooks also run under the Payload CLI
 * (`generate:types`, migrations), where there is no Next request context and
 * calling it throws. A failed revalidation must never fail the save — the
 * content is in the database either way, and the worst case is a page that is
 * briefly stale.
 */

const LOCALES = ["en", "ar"] as const;

async function revalidate(paths: string[]): Promise<void> {
  try {
    const { revalidatePath } = await import("next/cache");
    for (const path of paths) revalidatePath(path);
  } catch {
    // Outside a Next server (CLI, migrations). Nothing to revalidate.
  }
}

/** Every locale variant of a path below the locale segment. */
const localized = (path: string): string[] => LOCALES.map((l) => `/${l}${path}`);

/**
 * For a collection whose documents each have their own page.
 *
 * Revalidates the document and the index it appears on — the index carries
 * the title and excerpt, so an edit that only touched the article would
 * otherwise leave a stale card linking to a fresh page.
 *
 * ── `indexPath` is the route, not the place in the IA ──────────────────────
 *
 * It is prefixed with a locale and handed to `revalidatePath`, so it has to
 * name a path Next actually renders. All four collections passed
 * `/resources/<thing>` for a year, which is where these live in the site's
 * information architecture and is **not** where they render: the routes are
 * `app/[lang]/blog`, `/guides`, `/help` and the comparison pages under
 * `/compare`. `/resources/blog` is a 301 to `/blog`. So every publish
 * revalidated two redirects and left the real index cached.
 *
 * Nothing in dev shows this — `next dev` re-renders on every request either
 * way — which is most of why it survived. Check the path against
 * `app/[lang]/` rather than against the navigation.
 */
export const revalidateDoc =
  (indexPath: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc }) => {
    const paths = [...localized(indexPath)];

    const slug = typeof doc?.slug === "string" ? doc.slug : null;
    if (slug) paths.push(...localized(`${indexPath}/${slug}`));

    // A renamed slug leaves the old URL cached. Revalidate it too, so it stops
    // serving a page that has moved.
    const previousSlug = typeof previousDoc?.slug === "string" ? previousDoc.slug : null;
    if (previousSlug && previousSlug !== slug) {
      paths.push(...localized(`${indexPath}/${previousSlug}`));
    }

    await revalidate(paths);
    return doc;
  };
