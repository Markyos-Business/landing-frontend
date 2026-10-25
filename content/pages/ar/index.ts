import type { PageDoc } from "../types";
import { audiencePages } from "./solutions-audience";
import { solutionPages } from "./solutions-detail";
import { platformPages } from "./platform";
import { pricingPages } from "./pricing";
import { resourcePages } from "./resources";
import { legalPages } from "./legal";

/*
 * The Arabic page set.
 *
 * Twenty-seven pages, transcribed from the four copy documents in
 * docs/copy/. `lib/pages/registry.ts` turns this into routes, sitemap entries
 * and hreflang declarations, so adding a page here is the whole job.
 *
 * ── What is deliberately not in this list ─────────────────────────────────
 *
 * **The homepage** is `app/[lang]/page.tsx` with its own section components
 * and its own copy contract in `content/`. It has eighteen bespoke sections
 * and product mocks; it is not a stack of blocks and should not be forced
 * into one. Its Arabic lives in `content/ar/overrides.ts`.
 *
 * **The blog, the guides and the help centre** (`/blog`, `/guides`, `/help`)
 * are editorial content, not page copy. They have their own routes, read from
 * `lib/content`, and are added to weekly rather than reviewed once. See
 * `lib/content/adapter.ts` for why that line is drawn where it is.
 *
 * **`/start`**, the sign-up fork of Part 4 page 30, belongs to the product
 * app. `next.config.ts` redirects `/start` there, and every CTA on this site
 * points at it; building a second fork here would be a page shadowed by a
 * redirect, and two sign-up flows to keep in step.
 *
 * **404** is `app/[lang]/not-found.tsx`, because Next owns that route.
 *
 * **The named competitor comparisons** (page 27) are a template, and the
 * source forbids publishing one until every fact in it has been checked
 * against the competitor's own site with the date shown.
 */

export const pages: PageDoc[] = [
  ...audiencePages,
  ...solutionPages,
  ...platformPages,
  ...pricingPages,
  ...resourcePages,
  ...legalPages,
];
