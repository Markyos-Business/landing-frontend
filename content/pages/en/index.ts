import type { PageDoc } from "../types";
import { audiencePages } from "./solutions-audience";
import { solutionPages } from "./solutions-detail";
import { platformPages } from "./platform";
import { pricingPages } from "./pricing";
import { resourcePages } from "./resources";
import { legalPages } from "./legal";

/*
 * The English page set.
 *
 * Twenty-five pages, from `Landing Copy/markyos_landing_page_copy.md` —
 * Site Copy v3, the full site in English, 8 Nov 2026. Until that file
 * arrived these pages existed in Arabic only and `/en/<path>` served a
 * notice; `src/lib/pages/registry.ts` works out which locales a path has from
 * these two lists, so adding a page here is the whole job.
 *
 * ── Every path here must exist in ../ar ──────────────────────────────────
 *
 * Arabic owns the path list. An English page at a path the Arabic set does
 * not have would have no canonical, no breadcrumb parent and no pair, so
 * the registry throws on it in development rather than letting it ship.
 *
 * ── It is not a translation ──────────────────────────────────────────────
 *
 * v3's English file says it plainly: "the English is written for English
 * readers, not translated line by line". Where the Arabic leans on rhyme,
 * the English leans on rhythm or simply says the thing. So these pages are
 * shorter than their Arabic counterparts in places and differently shaped
 * in others — the Arabic set is still on the v2 documents, and will shorten
 * when it moves to v3.
 *
 * ── What is deliberately not in this list ────────────────────────────────
 *
 * The same four things the Arabic set leaves out, for the same reasons:
 * the homepage (`src/app/[lang]/page.tsx`, its own sections and its own copy
 * contract), the editorial sections (/blog, /guides, /help, /compare and
 * /whats-new read from the CMS), `/start` (the product app owns it, and
 * `next.config.ts` redirects there), and 404 (`src/app/[lang]/not-found.tsx`).
 */

export const pages: PageDoc[] = [
  ...audiencePages,
  ...solutionPages,
  ...platformPages,
  ...pricingPages,
  ...resourcePages,
  ...legalPages,
];
