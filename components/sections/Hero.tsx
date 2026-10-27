import type { HeroCopy } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Section";
import { BrandHub } from "@/components/mock/BrandHub";
import { isBeta } from "@/lib/launch";
import { sentences } from "@/lib/text";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The hero — and, with `variant="final"`, the final CTA.
 *
 * One component for both on purpose. The page opens and closes on the same
 * two-door choice, and the copy doc is explicit about why: the visitor picks a
 * side in the hero, the sign-up screen asks the same question, and the final
 * CTA repeats it so the decision feels familiar rather than new. Building it
 * twice would let the two drift, which is exactly the effect it depends on.
 *
 * The two CTAs carry equal visual weight — both are the light pill, neither is
 * the quiet one. That is a positioning decision, not a styling one: making one
 * primary would tell the visitor which audience we actually want, and half of
 * them would be the wrong half.
 *
 * What differs between the two ends of the page is only what surrounds the
 * ask: the hero carries the brand line and the product shot, the final CTA
 * carries the bloom and nothing else, because by then the argument is made and
 * anything else to look at is something else to leave through.
 */

export function Hero({
  copy,
  locale,
  as = "h1",
  id,
  variant = "hero",
}: {
  copy: HeroCopy;
  locale: Locale;
  as?: "h1" | "h2";
  id?: string;
  variant?: "hero" | "final";
}) {
  const Heading = as;
  const final = variant === "final";

  /*
   * Which ask is live.
   *
   * Before launch there is no free plan to start, so a "Start free" button is
   * a promise the product cannot keep that day. `beta` is optional in the type
   * and this falls back to the public copy when it is absent, so a new hero
   * cannot accidentally lose its CTAs — it just does not get a beta variant.
   */
  const ask = isBeta && copy.beta ? copy.beta : copy;

  /* Three verbs, three lines. See lib/text.ts. */
  const lines = sentences(copy.headline);

  return (
    /*
     * `overflow-hidden`: the bloom is a decoration and must never be able to
     * make the page scroll sideways. It did — at 390px the final CTA's glow
     * reached 20px past the viewport and gave the whole phone layout a
     * horizontal scrollbar, which is the kind of thing that only shows up by
     * opening it at that width.
     */
    <div className="relative overflow-hidden">
      {/*
       * The bloom under the final CTA. Wide, low and centred on the bottom
       * edge, which is where the reference puts it — the page warms as it
       * ends rather than glowing around the heading.
       */}
      {final ? (
        <>
          {/*
           * The brand pattern, once on the page.
           *
           * The design system allows it at most once (§8) and says it never
           * goes behind body text — which rules out every block on this page
           * except this one's floor: the strip under the closing CTA's
           * buttons, which holds nothing. Across the whole block it sat
           * behind the headline and read as wallpaper; as a band it reads as
           * the page closing on the brand's own motif.
           *
           * The real file from public/brand/, white at 8%, masked so it
           * dissolves at the edges rather than stopping at one, and under
           * the bloom so the light stays the brighter thing.
           */}
          <span
            aria-hidden="true"
            className="mk-pattern absolute inset-x-0 bottom-0 h-40 sm:h-52"
          />
          <Glow className="start-1/2 bottom-0 h-[26rem] w-[min(60rem,100%)] -translate-x-1/2 rtl:translate-x-1/2" />
        </>
      ) : null}

      <div
        className={`mk-container ${final ? "text-center pb-28 pt-20 sm:pb-36 sm:pt-28" : "pb-24 pt-16 sm:pt-24"}`}
      >
        {/*
         * The opening hero is set to the start edge, not centred.
         *
         * That is the design system's own `templates/landing`: a text column
         * capped at 520px on the start side, the brand line pushed to the end
         * on the same baseline, and the product frame running wider beneath
         * them. Centring it was taken from UI-UX Design Reference/01-hero.png,
         * which still governs section order and composition but no longer the
         * layout of this block.
         *
         * The closing CTA stays centred — it is a different composition, with
         * nothing beside it to balance against.
         */}
        <div
          className={
            final ? "" : "flex flex-wrap items-end justify-between gap-x-10 gap-y-6"
          }
        >
          <div className={final ? "" : "max-w-[33rem]"}>
            <Heading id={id} className={`mk-display${final ? " mx-auto max-w-[18ch]" : ""}`}>
              {lines.map((line, i) => (
                // A block per sentence rather than a <br>: a <br> inside a
                // heading is read out as a break by some screen readers, and
                // this way each line still wraps on its own at narrow widths.
                <span key={line} className={`mk-bidi block${i ? " mt-1" : ""}`}>
                  {line}
                </span>
              ))}
            </Heading>

            <p
              className={`mk-bidi text-[length:var(--fs-lead)] leading-[1.6] text-[var(--text-muted)] ${
                final ? "mx-auto mt-7 max-w-[36rem]" : "mt-6"
              }`}
            >
              {copy.subheadline}
            </p>

            <div
              className={`mt-8 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center ${
                final ? "justify-center" : "justify-start"
              }`}
            >
              <Button cta={ask.studioCta} locale={locale} variant="solid" />
              <Button cta={ask.companyCta} locale={locale} variant="solid" />
            </div>

            <p
              className={`mk-bidi mt-5 text-[length:var(--fs-ui)] leading-[1.5] text-[var(--text-muted)] ${
                final ? "mx-auto max-w-[28rem]" : "max-w-[28rem]"
              }`}
            >
              {ask.microcopy}
            </p>
          </div>

          {/*
           * The brand line, in the slot the template reserves for it.
           *
           * Plain text and not a link: `eyebrow` is one string in the copy
           * contract with no destination, and an arrow that is not a link
           * costs a click to disprove. It sits after the heading in the DOM
           * so a screen reader reaches the <h1> first.
           */}
          {!final && copy.eyebrow ? (
            <p className="mk-bidi pb-2.5 text-[length:var(--fs-ui)] text-[var(--text-muted)]">
              {copy.eyebrow}
            </p>
          ) : null}
        </div>

        {final && copy.eyebrow ? (
          <p className="mk-bidi mx-auto mb-8 inline-flex rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] px-4 py-1.5 text-[length:var(--fs-eyebrow)] font-medium text-[var(--text-muted)]">
            {copy.eyebrow}
          </p>
        ) : null}

        {/*
         * The product shot.
         *
         * Sits in the hero's own container but on a wider measure than the
         * text, and the bloom goes behind it rather than behind the headline —
         * the warmth belongs to the product, which is the thing being shown.
         */}
        {final ? null : (
          <div className="relative mx-auto mt-20 max-w-[60rem]">
            <Glow className="start-1/2 top-[-3rem] h-[22rem] w-[min(48rem,100%)] -translate-x-1/2 rtl:translate-x-1/2" />
            {/*
             * The beams.
             *
             * Two lit lines flanking the product frame, stopping before the
             * bottom third so they read as a light source rather than as a
             * border around the window. They sit just outside the frame on
             * purpose: the mock is a picture of the product and nothing may
             * be drawn across it.
             *
             * Decoration, so both are aria-hidden. The section above is
             * `overflow-hidden`, which is what keeps the negative inset from
             * giving a phone a sideways scrollbar.
             */}
            <span aria-hidden="true" className="mk-beam absolute bottom-[30%] top-0 start-[-14px]" />
            <span aria-hidden="true" className="mk-beam absolute bottom-[30%] top-0 end-[-14px]" />
            <BrandHub />
          </div>
        )}
      </div>
    </div>
  );
}
