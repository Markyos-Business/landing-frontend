import type { Locale } from "@/lib/i18n/locales";
import type { AiAlongsideCopy, SiteCopy } from "@/content/types";
import { TextLink, Band } from "../landing";
import { Intro } from "./Intro";
import { EffectTable } from "./EffectTable";
import { Seams } from "./Seams";
import { Limits } from "./Limits";

/*
 * The brand brain — §1.7, at copy v2.1.
 *
 * ── What this section answers ────────────────────────────────────────────
 *
 * The question a buyer has about AI in a brand tool is not "what can it
 * generate?" but "will my brand come out better?". v2.0's section answered
 * the first: a claim, the list of sources the brain reads, and three
 * articles showing the reading turn into work. The copy deck's note on the
 * rewrite says the capabilities, the costs and the full explanation belong
 * on `/platform/brand-brain`, and that the homepage should answer the second
 * question instead — which it can only do twice, because there are two
 * starting points and they are two different answers.
 *
 * So the shape of the section *is* the argument:
 *
 *   the parts a brand is made of, and that nobody sees them together
 *     → what it does to the result, in two columns
 *     → the six seams where the parts come apart
 *     → what it will not do
 *
 * ── The two columns are a table, and are built as one ────────────────────
 *
 * Four rows against two headed columns is tabular data — "starts from",
 * "shows you", "suggests", "so you end up with", each said once for a new
 * brand and once for an existing one. A pair of card lists would lose the
 * row pairing, which is the whole comparison: the value of the second column
 * is that it sits beside the first.
 *
 * It collapses on a phone the way the comparison table does, into one block
 * per row with the column name above each cell, because four columns of
 * Arabic at 390px is not a table anybody reads.
 *
 * ── The ChatGPT line ─────────────────────────────────────────────────────
 *
 * It is a body paragraph now rather than the headline, but it still opens
 * with a Latin product name inside an Arabic sentence, so it still needs the
 * explicit `dir` — the bidi algorithm would otherwise drag the Arabic verb
 * to the wrong side of the name, in the section claiming the product does
 * not do that. `LatinLead` is what `HeadlineWithLatin` was.
 */

export function AiAlongside({
  copy,
  chips, locale }: {
  locale: Locale;
  copy: AiAlongsideCopy;
  chips: SiteCopy["chips"];
}) {
  const effect = copy.effect;

  return (
    <Band id="brain" labelledBy="brain-heading">
      <div
        className="mk-seq"
        style={{ position: "relative", maxWidth: 1040, margin: "0 auto" }}
      >
        <Intro copy={copy} />

        {/* What it does to the result. */}
        {effect ? <EffectTable effect={effect} /> : null}

        {/* The seams. */}
        {copy.seams?.length ? <Seams copy={copy} chips={chips} /> : null}

        {/* And what it will not do. */}
        {copy.limits?.length || copy.connector ? <Limits copy={copy} chips={chips} /> : null}

        <div style={{ marginBlockStart: 40 }}>
          <TextLink locale={locale} href={copy.cta.href}>{copy.cta.label}</TextLink>
        </div>
      </div>
    </Band>
  );
}
