import { getPayload } from "payload";
import config from "@payload-config";

/*
 * Repoint the links in article bodies that go nowhere.
 *
 * The written resources were imported with their `[Link: …]` markers turned
 * into real links (see `import-resources.ts`). Five of those targets are
 * pages the deck plans and this site has not built — `/platform/<feature>`
 * is a fifteen-page information architecture that lives under /solutions
 * here — so five links 404'd in both editions. Found by crawling every
 * internal href on all 143 routes, not by reading.
 *
 * Each replacement is the page that covers the same ground. None of them
 * invents a destination: where there is no equivalent page, the link goes
 * to the section index, which is the honest answer.
 *
 *   npx payload run scripts/fix-article-links.ts
 *
 * Idempotent: a body with no stale link is left untouched, and running it
 * twice changes nothing.
 */

const MOVES: Record<string, string> = {
  // The deck's /platform/<feature> pages live under /solutions here.
  "/platform/leadership-alignment": "/solutions/leadership-alignment",
  "/platform/brief-analysis": "/solutions/discovery#analysis",
  "/platform/brand-brain": "/platform",
  "/platform/studio-board": "/solutions/client-projects",
  "/platform/guideline-sites": "/solutions/guideline-sites",
  "/platform/handoff": "/solutions/client-handoff",
  "/platform/asset-library": "/solutions/brand-hub",
  "/platform/tone-checker": "/solutions/tone-checker",
  "/platform/brand-voice": "/solutions/brand-voice",
  "/platform/discovery-forms": "/solutions/discovery",
  "/platform/team-and-sharing": "/solutions/company-rollout",
  "/platform/strategy-hub": "/platform",
  "/platform/moodboards": "/platform",
  // Guides that were planned and not written.
  "/guides/brand-handoff-checklist": "/solutions/client-handoff",
  "/guides/discovery-brief-guide": "/solutions/discovery",
  // The help centre has no articles yet, so its index is the only truth.
  "/help/domain-and-publishing/custom-domain": "/help",
};

const COLLECTIONS = ["posts", "guides", "helpArticles", "comparisons", "updates"] as const;
const LOCALES = ["ar", "en"] as const;

/** Rewrite every `fields.url` in a Lexical tree. Returns how many changed. */
function repoint(node: unknown): number {
  if (Array.isArray(node)) return node.reduce<number>((n, child) => n + repoint(child), 0);
  if (!node || typeof node !== "object") return 0;

  let changed = 0;
  const n = node as Record<string, unknown>;

  if (n.type === "link" && n.fields && typeof n.fields === "object") {
    const fields = n.fields as Record<string, unknown>;
    const url = typeof fields.url === "string" ? fields.url : "";
    /*
     * Match on the path, so an anchor or a query on the end survives — and
     * on the path *without* its locale prefix, because the English source
     * documents write their links as `/en/platform/…` while the Arabic
     * ones write `/platform/…`. Same page, same move, one table.
     */
    const [full, ...rest] = url.split(/(?=[#?])/);
    const prefixed = full.startsWith("/en/") || full === "/en";
    const path = prefixed ? full.slice(3) || "/" : full;
    const to = MOVES[path];
    if (to) {
      fields.url = (prefixed ? "/en" + to : to) + rest.join("");
      changed += 1;
    }
  }

  for (const value of Object.values(n)) changed += repoint(value);
  return changed;
}

const payload = await getPayload({ config });
let touched = 0;
let links = 0;

for (const collection of COLLECTIONS) {
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection,
      locale,
      limit: 500,
      depth: 0,
      draft: false,
      pagination: false,
      fallbackLocale: false,
    });

    for (const doc of docs) {
      const body = (doc as unknown as Record<string, unknown>).body;
      if (!body) continue;
      const copy = structuredClone(body);
      const changed = repoint(copy);
      if (!changed) continue;

      await payload.update({
        collection,
        id: (doc as { id: string | number }).id,
        locale,
        data: { body: copy } as never,
        // The piece is already published; this must not leave a draft
        // sitting over it, or the public read keeps serving the old body.
        draft: false,
        overrideAccess: true,
      });
      touched += 1;
      links += changed;
      console.log(`  ${collection}/${locale}/${String((doc as { slug?: string }).slug)} — ${changed}`);
    }
  }
}

console.log(`\n${links} links repointed across ${touched} documents.`);
process.exit(0);
