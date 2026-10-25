/*
 * Which launch phase the site is in.
 *
 * Copy doc §3: "If the page goes live before 15 Feb 2027 (private beta,
 * waitlist): swap every primary CTA for the beta versions in §6.3 and add
 * 'Arriving February 2027' to everything marked MVP."
 *
 * That is a site-wide swap of button labels, the announcement bar and a chip
 * on a dozen features. Doing it by hand on launch day means finding every one
 * of them under time pressure; doing it with an env var means flipping
 * NEXT_PUBLIC_LAUNCH_PHASE and redeploying.
 */

export type LaunchPhase = "beta" | "public";

export const LAUNCH_PHASE: LaunchPhase =
  process.env.NEXT_PUBLIC_LAUNCH_PHASE === "public" ? "public" : "beta";

/** Mon 15 Feb 2027 — public launch, per roadmap Rev 3.2. */
export const PUBLIC_LAUNCH_DATE = "2027-02-15";

export const isBeta = LAUNCH_PHASE === "beta";
