import { getCopyFor, getLocale } from "@/lib/i18n/dictionary";
import { Hero } from "@/components/public/home/Hero";
import { Problem } from "@/components/public/home/problem";
import { Ecosystem } from "@/components/public/home/ecosystem";
import { ReplaceStack } from "@/components/public/home/ReplaceStack";
import { AiAlongside } from "@/components/public/home/ai-alongside";
import { ChoosePath } from "@/components/public/home/ChoosePath";
import { Bilingual } from "@/components/public/home/bilingual";
import { PricingTeaser } from "@/components/public/home/pricing-teaser";
import { Faq } from "@/components/public/home/Faq";

/*
 * The homepage — `Landing Copy/Markyos Landing AR (readable).html`.
 *
 * Ten sections in copy deck v3 §2's order (see the note in the render
 * below), with the copy from `Landing Copy/markyos_landing_page_copy_ar.md`.
 *
 * ── What changed from v2, and why ─────────────────────────────────────────
 *
 * The previous homepage rendered ten sections and deliberately moved four off
 * it: `problem` to /about, `handoffLoop` and `bilingual` to /platform,
 * `comingNext` to /roadmap. The reasoning was sound — lead with the product,
 * not the problem — but the landing design puts all four back, and in a
 * specific order that is itself the argument:
 *
 *   problem → ecosystem → compare
 *
 * The problem section fans one brand out across seven tools. The ecosystem
 * section runs the same seven back down into one mark. The comparison then
 * does it a third time as a table, honestly, naming what we do not replace.
 * Each of the three is weaker alone; that is why the design keeps all three
 * and why they are adjacent.
 *
 * The four sub-pages those sections used to be the only home for are
 * data-driven through `content/pages/` and `components/page/blocks/`, so
 * none of them lost anything when these components came back to the homepage
 * — they never imported them.
 *
 * ── What is still not here ───────────────────────────────────────────────
 *
 *   productGlimpse, shift      → /about
 *   studioPath, company        → /solutions/*, summarised by ChoosePath
 *   toneChecker                → /platform, and shown by AiAlongside's panel
 *   pillars, aiRules           → /platform
 *
 * Their copy is still in `content/`, still transcreated, and still counted by
 * `npm run check:locales`. Their homepage section components were deleted on
 * 9 Nov 2026 because nothing rendered them; they are in git history if a
 * page needs one back.
 */

export default async function HomePage() {
  const locale = await getLocale();
  const copy = await getCopyFor(locale);
  const { home, chips } = copy;

  return (
    <>
      {/*
       * Ten sections, and the order is copy deck v3 §2.
       *
       * v3 opens that section with "Ten sections. Everything else lives on
       * the solutions and feature pages", and this is the cut that makes
       * that true. Five blocks left the homepage on 5 Nov 2026 — the proof
       * strip, the platform grid, the handoff loop, what's coming next and
       * the founder's note — and the FAQ stopped being a section of its own
       * and became the three questions under pricing (§2.9).
       *
       * Their copy is still in the repo; their components were deleted on
       * 9 Nov 2026 and can be restored from git history when Parts B to E of
       * the deck give each one a page to belong to.
       *
       * §2.2, the scroll story, is not here yet: it needs seven views of the
       * real product and the repo has five mocks. §3.5 forbids inventing the
       * rest, so the section waits for them rather than shipping a drawing.
       */}
      {/* 1 */} <Hero copy={home.hero} locale={locale} as="h1" id="hero-heading" />
      {/* 3 */} <Problem copy={home.problem} locale={locale} />
      {/* 4 */} <Ecosystem locale={locale} copy={home.ecosystem} />
      {/* 5 */} <ChoosePath locale={locale} copy={home.choosePath} />
      {/* 6 */} <ReplaceStack locale={locale} copy={home.replaceStack} chips={chips} />
      {/* 7 */} <AiAlongside locale={locale} copy={home.aiAlongside} chips={chips} />
      {/* 8 */} <Bilingual copy={home.bilingual} locale={locale} />
      {/* 9 */} <PricingTeaser locale={locale} copy={home.pricingTeaser} />
      {/* 9 */} <Faq locale={locale} copy={home.faq} chips={chips} />

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
