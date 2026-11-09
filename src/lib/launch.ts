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
 *
 * ── The default is "public" ───────────────────────────────────────────────
 *
 * It used to be "beta", so an unset env var served the waitlist page. The
 * landing design this site is now built to shows the launch banner — "Markyos
 * is available now. Start free" — and the launch CTAs, so the page a fresh
 * checkout renders is the page the design file depicts. Set
 * NEXT_PUBLIC_LAUNCH_PHASE=beta to serve the waitlist variants again; every
 * beta string is still in `content/`, and `HeroCopy.beta` still carries the
 * beta asks.
 *
 * The quote is the copy doc's, and the chip it names has since lost its
 * date: the beta chip reads "Arriving soon" / «يصل قريباً», because a chip
 * with a quarter in it is wrong for the whole site the moment one release
 * slips. See the ChipKey note in `lib/status.ts`. What this flag does is
 * unchanged — it decides whether MVP features carry that chip at all.
 *
 * Note that this flag never affects the "coming soon" chips. Those come from
 * `lib/status.ts` per feature, so a feature that has not shipped is marked
 * whichever phase the site is in.
 */

export type LaunchPhase = "beta" | "public";

export const LAUNCH_PHASE: LaunchPhase =
  process.env.NEXT_PUBLIC_LAUNCH_PHASE === "beta" ? "beta" : "public";

/** Mon 15 Feb 2027 — public launch, per roadmap Rev 3.2. */
export const PUBLIC_LAUNCH_DATE = "2027-02-15";

export const isBeta = LAUNCH_PHASE === "beta";
