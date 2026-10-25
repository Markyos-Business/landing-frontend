import { getLocale } from "@/lib/i18n/dictionary";
import { getSiteCopy } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { AiAlongside } from "@/components/sections/AiAlongside";
import { PlatformGrid } from "@/components/sections/PlatformGrid";
import { ChoosePath } from "@/components/sections/ChoosePath";
import { ReplaceStack } from "@/components/sections/ReplaceStack";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { FounderNote } from "@/components/sections/FounderNote";
import { Faq } from "@/components/sections/Faq";

/*
 * The homepage — `Markyos Homepage v2.dc.html`.
 *
 * Ten sections, in the design's order. The argument is unchanged in shape —
 * hero → what it does → what it is → who it's for → what it replaces → price
 * → why → questions → ask — but v2 makes two structural moves that are worth
 * naming, because both look like deletions and neither is.
 *
 * **It leads with the product, not the problem.** The old page spent its
 * first three sections establishing that brands decay: `productGlimpse`,
 * `problem`, and the pain cards. v2 opens on the hub itself and lets the
 * problem be implied by the fix. Nothing is deleted — `problem` still reads
 * at /about, where somebody who wants the argument goes.
 *
 * **It shows before it promises.** `aiRules` — the four things the AI will
 * never do — was the old page's AI section. v2 replaces it with
 * `AiAlongside`, which shows the three things the AI *does*, and moves the
 * promises to /platform. A promise about a capability is unreadable before
 * you know the capability exists.
 *
 * ── What stopped rendering here, and where it lives ───────────────────────
 *
 *   productGlimpse, problem   → /about
 *   studioPath, company       → /solutions/*, and summarised by ChoosePath
 *   handoffLoop, toneChecker  → /platform, and shown by AiAlongside §3
 *   pillars, bilingual        → /platform, and shown by PlatformGrid
 *   aiRules                   → /platform
 *   comingNext                → /roadmap
 *
 * Every one of those is still in `content/`, still transcreated, and still
 * counted by `npm run check:locales`. This file decides what the *homepage*
 * renders, not what exists.
 *
 * Two sections come back the other way: `replaceStack` and `founderNote` were
 * orphaned — the components existed and nothing rendered them, so the copy
 * was dead on the site. v2 puts both on the homepage, which is where the
 * design has them.
 */

export default async function HomePage() {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const { home, chips } = copy;

  return (
    <>
      {/* 01 */} <Hero copy={home.hero} locale={locale} as="h1" />
      {/* 02 */} <ProofStrip copy={home.proofStrip} />
      {/* 03 */} <AiAlongside copy={home.aiAlongside} locale={locale} />
      {/* 04 */} <PlatformGrid copy={home.platformGrid} locale={locale} />
      {/* 05 */} <ChoosePath copy={home.choosePath} locale={locale} />
      {/* 06 */} <ReplaceStack copy={home.replaceStack} />
      {/* 07 */} <PricingTeaser copy={home.pricingTeaser} locale={locale} />
      {/* 08 */} <FounderNote copy={home.founderNote} />
      {/* 09 */} <Faq copy={home.faq} chips={chips} />

      {/*
       * 10 — the page ends on its sharpest line, not on the footer.
       *
       * The same two doors as the hero, so the decision feels continued
       * rather than new, and the only ornament left on the page behind it.
       */}
      <Hero
        copy={home.finalCta}
        locale={locale}
        as="h2"
        id="final-cta-heading"
        variant="final"
      />
    </>
  );
}
