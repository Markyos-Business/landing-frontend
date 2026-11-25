import "server-only";
import { z } from "zod";
import type { BillingPlans } from "@/content/current-pricing";
import { contentApiUrl } from "@/lib/content/connection";

/*
 * The plans the app sells, read from the backend: the one source of every
 * price and limit on this site.
 *
 * `GET {CONTENT_API_URL}/billing/plans/` is public and the backend marks it
 * cacheable for five minutes, so the site revalidates on the same clock.
 * Amounts are cents; `null` limits are no limit.
 *
 * ── When the backend can't be reached ─────────────────────────────────────
 *
 * The same rule as the CMS reads (src/lib/content/django.ts):
 *
 *   - On a revalidation, the error is thrown. Next keeps serving the last
 *     successfully generated page and retries on the next request, so a
 *     backend blip never replaces real prices with nothing.
 *   - During `next build` there is no last good page, and a sleeping backend
 *     must not fail a deploy, so this returns `null`. The pricing sections
 *     then render without figures, with their sign-up links and a line saying
 *     the price is shown at sign-up. Nothing is ever guessed.
 */

export const PLANS_TAG = "billing-plans";
const REVALIDATE_SECONDS = 300;

const limits = z.object({
  brands: z.number().int().nonnegative().nullable(),
  editors: z.number().int().nonnegative().nullable(),
});
const plan = z.object({ monthly: z.number().int().positive(), limits });

const schema = z.object({
  currency: z.string().length(3),
  interval: z.literal("month"),
  perBrand: z.boolean(),
  free: limits.extend({ publishedSites: z.number().int().nonnegative().optional() }),
  types: z.object({ freelancer: plan, studio: plan, company: plan }),
});

const building = () => process.env.NEXT_PHASE === "phase-production-build";

async function read(): Promise<BillingPlans> {
  const response = await fetch(`${contentApiUrl()}/billing/plans/`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS, tags: [PLANS_TAG] },
    signal: AbortSignal.timeout(building() ? 45000 : 8000),
  });
  if (!response.ok) throw new Error(`${response.status} from /billing/plans/`);
  return schema.parse(await response.json());
}

/** The current plans, or `null` only while building without a backend. */
export async function getPlans(): Promise<BillingPlans | null> {
  try {
    return await read();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[billing] plans unavailable: ${message.slice(0, 160)}`);
    if (!building()) throw error;
    return null;
  }
}
