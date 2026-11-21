import Link from "next/link";
import type { Cta } from "@/content/types";
import { isAppHandoff, localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The CTA.
 *
 * Every call to action on this site is a link, never a <button>: each one
 * navigates, and a button that navigates breaks middle-click, cmd-click and
 * "copy link address" for no gain.
 *
 * Three variants, matching the three weights the reference actually uses:
 *
 *   solid    the light pill — the primary ask. Both hero CTAs are solid,
 *            because the page offers two doors of equal weight (copy doc
 *            §1.4) and making one louder tells half the audience they are the
 *            wrong half.
 *   outline  a card's own surface with a card's own edge. What a CTA *inside*
 *            a card wears, so it belongs to the card rather than competing
 *            with the hero from halfway down the page.
 *   link     accent text, underlined on hover. "Compare all plans", "See the
 *            full roadmap" — a way out of a section, not an ask.
 *
 * ── No arrows ─────────────────────────────────────────────────────────────
 *
 * Every variant used to end in one, as a component rather than a glyph in the
 * copy so it could flip in Arabic. They are gone from the whole site as of
 * 6 Nov 2026: a label that says where it goes does not need a picture saying
 * "forward", and on an RTL page the flipping was one more thing that could be
 * wrong. The `arrow` prop is gone with them rather than defaulted to false,
 * so a call site cannot quietly ask for one back.
 */

type Variant = "solid" | "outline" | "link";
type Tone = "page" | "deep";

// `.mk-tap`: a 14px label in a 20px line box is under WCAG 2.5.8's 24px and
// these sit in rows 12px apart, so the spacing clause does not save them
// either. The hit area grows; the text does not move.
const LINK =
  "mk-tap inline-flex items-center gap-1.5 text-sm font-medium " +
  "mk-underline-reveal underline-offset-4";

/*
 * Every resting fill, as one class per (variant, tone).
 *
 * `deep` is inside `.mk-deep` — the closing panel, the one place on this site
 * where the ink inverts. All three page fills are wrong there: the primary is
 * near-black on dark blue, the secondary a white card whose 7% ring has
 * nothing to ring against, and the link's #0055FF is the panel's own gradient.
 *
 * The tone is a whole class rather than an override passed in `className`,
 * because an override cannot win. `.mk-deep-*` would be a component rule and
 * `text-[var(--accent-text)]` is a utility, and `@layer utilities` beats
 * `@layer components` whatever the specificity — the only way past that is
 * `!important`, and a variant that needs `!important` to state its own colour
 * is a variant that should have been declared instead of patched.
 */
const VARIANTS: Record<Tone, Record<Variant, string>> = {
  page: {
    solid: "mk-btn mk-solid",
    outline: "mk-btn mk-outline",
    link: `${LINK} text-[var(--accent-text)]`,
  },
  deep: {
    solid: "mk-btn mk-deep-solid",
    outline: "mk-btn mk-deep-outline",
    link: `${LINK} text-[var(--mk-on-deep)]`,
  },
};

export function Button({
  cta,
  locale,
  variant = "solid",
  tone = "page",
  size = "md",
  block = false,
  className = "",
}: {
  cta: Cta;
  locale: Locale;
  variant?: Variant;
  /** The ground this button sits on. `deep` is inside `.mk-deep`. */
  tone?: Tone;
  size?: "md" | "sm";
  /*
   * Fill the parent rather than the label.
   *
   * It was a prop and not `className="w-full"` because the solid variant used
   * to be wrapped in `Spark`, and a class on the <Link> sized it against that
   * shrink-wrapping wrapper. The wrapper is gone, so this is now simply the
   * class, kept as a prop so the plan cards' call sites do not have to change.
   */
  block?: boolean;
  className?: string;
}) {
  const sizing = variant !== "link" && size === "sm" ? " mk-btn-sm" : "";

  const button = (
    <Link
      href={localeHref(locale, cta.href)}
      // A link that redirects off-site cannot be prefetched usefully; see
      // isAppHandoff.
      prefetch={isAppHandoff(cta.href) ? false : undefined}
      /*
       * `mk-atomic`: every variant here is an `inline-flex` box, and such a
       * box is atomic to the bidi algorithm whatever its `unicode-bidi`
       * says — the block around it sees one object replacement character
       * and nothing inside. So a text block whose only child is a button
       * has nothing for `plaintext` to read, falls back to left-to-right,
       * and sends the button to the far edge of its own box.
       *
       * Found by widening check:bidi to every route: a `dd` holding one
       * link variant put it 400px off the start edge on
       * /solutions/leadership-alignment and 216px on /solutions/brand-voice.
       * The `mk-bidi` on the label below cannot fix it — that governs the
       * string *inside* the box, and the box is what the parent cannot see
       * into.
       *
       * The class is inert anywhere else: its rule in tailwind/ only fires
       * on a parent that is itself a text element, so a button in the usual
       * flex row of buttons is unaffected.
       */
      className={`mk-atomic ${VARIANTS[tone][variant]}${sizing}${block ? " w-full" : ""} ${className}`}
    >
      {/* `mk-bidi`: a CTA label is one standalone string, and until the Arabic
          is written it is an English one sitting in an RTL page. */}
      <span className="mk-bidi">{cta.label}</span>
    </Link>
  );

  /*
   * ── The cursor light is gone ──────────────────────────────────────────────
   *
   * The solid variant used to be wrapped in `Spark`: a sprung specular
   * highlight inside the pill plus two blurred rings outside it, which the
   * homepage's own `Cta` dropped on 18 Nov 2026 and this one did not. Two
   * things made it wrong here rather than merely unnecessary.
   *
   * **Its geometry no longer matched the button.** `.mk-spark-edge` draws at
   * `border-radius: var(--radius-pill)` -- 999px -- because every CTA on this
   * site was a pill when it was written. The brief's button is a 10px
   * rectangle. Measured on /solutions/leadership-alignment: a 10px pill inside
   * a 999px ring, so the glow bulged past the corners on all four sides and
   * the pair read as a glowing blob with a button somewhere in it.
   *
   * **Its palette was solved for a page that no longer exists.** Read its own
   * header: "This ground is #F7F8FA and the homepage has ten of these." It
   * rests at 0.42 of full intensity because the page it was built for was
   * paper. On near-black the same rest intensity is a saturated cyan halo
   * around every primary button on the site, and on the closing panel
   * `.mk-spark-deep`'s white filament bloomed across a white pill and fogged
   * the label.
   *
   * The hover the brief actually asks for is on `.mk-btn.mk-solid:hover` in
   * tailwind/components/buttons.js -- the fill brightens and casts the accent
   * under itself. That is a state. This was choreography, and it was
   * choreography measured against the wrong ground.
   *
   * `Spark.tsx` and its `.mk-spark-*` rules are left in place and unreferenced
   * rather than deleted: nothing renders the class, so the rules never match.
   */
  return button;
}
