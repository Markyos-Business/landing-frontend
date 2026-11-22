import type { PageBlock } from "@/content/pages/types";
import { resolvePriced } from "@/content/current-pricing";
import { getPlans } from "@/lib/billing/plans";
import { PlansBlock } from "./PlansBlock";
import { TableBlock } from "./TableBlock";
import type { Ctx } from "./shared";

/* ── priced ───────────────────────────────────────────────────────────────── */

/**
 * A pricing section, with the backend's current plans set into its copy.
 *
 * The figures are read here, at render, rather than kept in content/: the
 * backend is the one source. See src/lib/billing/plans.ts for what happens
 * when it can't be reached.
 */
export async function PricedBlock({
  block,
  ctx,
  headingId,
  white,
}: {
  block: Extract<PageBlock, { kind: "priced" }>;
  ctx: Ctx;
  headingId: string;
  white: boolean;
}) {
  const resolved = resolvePriced(block, ctx.locale, await getPlans());
  return resolved.kind === "plans" ? (
    <PlansBlock block={resolved} ctx={ctx} headingId={headingId} white={white} />
  ) : (
    <TableBlock block={resolved} ctx={ctx} headingId={headingId} white={white} />
  );
}
