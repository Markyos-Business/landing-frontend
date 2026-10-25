import type { BilingualCopy } from "@/content/types";
import { Glow, Section, SectionHead } from "@/components/ui/Section";

/*
 * Bilingual by design.
 *
 * The section ends on the claim written out in both scripts at once, in the
 * same size and weight, on the same card. That is the argument made rather
 * than stated: if one of them were smaller, or set in a fallback face, or
 * second, the page would be demonstrating the opposite of what it says.
 *
 * Both lines render in both locales for the same reason. An Arabic reader
 * needs to see that the English is not an afterthought every bit as much as
 * an English reader needs to see that the Arabic is not.
 *
 * The four points use rules rather than cards. They are one list that happens
 * to sit across four columns — boxing them would make them four things.
 */

export function Bilingual({ copy }: { copy: BilingualCopy }) {
  return (
    <Section id="bilingual" labelledBy="bilingual-heading">
      <SectionHead
        id="bilingual-heading"
        eyebrow={copy.eyebrow}
        title={copy.headline}
        body={[copy.body]}
      />

      {/*
       * The four points are not on the homepage any more.
       *
       * They explained in prose what the specimen below proves in one
       * look: the two scripts set at the same size, the same weight, on
       * the same card, neither one second. A section that demonstrates
       * its claim does not also need to make it four more times. The
       * points are still in `content/` and still on /solutions.
       */}

      <div className="mk-card mk-card-pad relative mt-14 overflow-hidden py-12 sm:py-16">
        <Glow className="start-1/2 -bottom-32 h-[18rem] w-[min(36rem,90%)] -translate-x-1/2 rtl:translate-x-1/2" />

        {/*
         * `dir="ltr"` on the pair, so the two scripts keep their places in
         * both locales: English on the left, Arabic on the right. This is a
         * specimen rather than prose — its layout is about the two scripts,
         * not about the page — and letting it mirror would put the English
         * first on the Arabic page, which is the one thing this section is
         * promising never happens. Each line still carries its own `dir`, so
         * the Arabic sets right-to-left inside its own column.
         */}
        <p dir="ltr" className="grid items-center gap-8 md:grid-cols-2">
          <span
            lang="en"
            dir="ltr"
            className="block text-start text-[clamp(1.375rem,2.6vw,1.875rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[var(--text)]"
          >
            {copy.lineEn}
          </span>
          <span
            lang="ar"
            dir="rtl"
            className="block text-start text-[clamp(1.375rem,2.6vw,1.875rem)] font-medium leading-[var(--mk-lh-display-ar)] text-[var(--text)]"
            /* Thmanya Sans, like every other Arabic string on the site. This
               used to force IBM Plex Arabic, which was the Arabic face before
               the design system named one — and a specimen that argues the
               two scripts are equals cannot be the one place the Arabic is
               set in the fallback (§1.5, §2.1). */
            style={{ fontFamily: "var(--font-arabic)" }}
          >
            {copy.lineAr}
          </span>
        </p>
      </div>
    </Section>
  );
}
