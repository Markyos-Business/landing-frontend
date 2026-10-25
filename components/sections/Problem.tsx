import type { ProblemCopy } from "@/content/types";
import { CardTitle, Inset } from "@/components/ui/Card";
import { Section, SectionHead } from "@/components/ui/Section";
import { sentences } from "@/lib/text";

/*
 * The problem.
 *
 * The page's first chapter break, and the only section that is allowed to be
 * bleak. It ends on the turn — "It's not a people problem. It's a home
 * problem." — with the second half in the accent, which is the one place on
 * the page a colour carries an argument rather than a label.
 *
 * Each pain card opens with a small picture of the thing it describes: the
 * PDF that was opened once, the two languages that have drifted, the three
 * people queuing at one desk. They are illustrations rather than copy, so
 * they live here and are not transcreated — an Arabic reader should see the
 * same artefact an English one does, because the artefact is the point. The
 * one string inside them that *is* Arabic is deliberately so: it is the
 * drifted translation, and showing it in English would delete the example.
 */

export function Problem({ copy }: { copy: ProblemCopy }) {
  const [turn, ...rest] = sentences(copy.transition);

  return (
    <Section id="problem" labelledBy="problem-heading" rule>
      {/*
       * The explaining paragraphs are not rendered here any more.
       *
       * The headline makes the claim, the three cards below show it, and the
       * turn at the bottom lands it — the body column in between was the same
       * argument a third time, in the slowest form of the three. It is still
       * in `content/` and still on /about, where there is room to argue.
       */}
      <SectionHead
        id="problem-heading"
        eyebrow={copy.eyebrow}
        title={copy.headline}
        size="lg"
      />

      {/*
       * One object, not three cards.
       *
       * These are three facets of a single problem, and the reference draws
       * that as a bento — cells flush against each other, divided by 1px
       * rules, the whole grid reading as one surface (UI-UX Design
       * Reference/20, 21). It reserves detached cards with gaps for things
       * that are separate destinations, each going somewhere of its own
       * (25). Three symptoms of one decay are not three destinations, and at
       * 16px gaps they were reading as a product comparison.
       *
       * The artefacts keep their inset frame rather than bleeding to the
       * cell edge like the studio grid's do. They are *documents* — a PDF
       * row, a drifted pair, a queue of questions — and a document that runs
       * off the edge of its frame stops looking like a document.
       */}
      <ul className="mk-bento mt-14 md:grid-cols-3">
        {copy.cards.map((card, i) => (
          <li key={card.headline} className="flex flex-col">
            <Inset className="mb-6 p-3">{VISUALS[i]}</Inset>
            <CardTitle>{card.headline}</CardTitle>
            <p className="mk-body mk-bidi mt-3">{card.line}</p>
          </li>
        ))}
      </ul>

      {/*
       * The turn.
       *
       * Split on the sentence rather than written as two strings, so the copy
       * stays one approved line in content/ and the layout decides where the
       * colour starts. A headline, because it is the section's conclusion —
       * but a quiet one, since the <h2> above already names the section.
       */}
      <p className="mk-bidi mt-16 text-[length:var(--fs-d3)] font-medium leading-[1.2] tracking-[-0.04em] text-[var(--text)]">
        {turn}{" "}
        <span className="text-[var(--accent-text)]">{rest.join(" ")}</span>
      </p>
    </Section>
  );
}

/* ── The three illustrations ─────────────────────────────────────────────── */

const VISUALS = [
  <div key="pdf" className="flex items-center gap-3">
    <span className="grid size-8 flex-none place-items-center rounded-[var(--mk-r-status)] bg-[var(--surface-2)] text-[length:var(--fs-eyebrow)] font-medium text-[var(--text-muted)]">
      PDF
    </span>
    <span className="min-w-0">
      <span className="block truncate text-[0.75rem] font-medium text-[var(--text)]">
        Brand_Guidelines_FINAL.pdf
      </span>
      <span className="block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
        Opened once. Eleven months ago.
      </span>
    </span>
  </div>,

  <div key="drift" className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--mk-r-status)] bg-[var(--hairline)]">
    <div className="bg-[var(--surface-1)] p-2.5">
      <span className="block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">EN · Website</span>
      <span className="mt-1 block text-[0.75rem] font-medium text-[var(--text)]">
        Fresh every morning.
      </span>
    </div>
    <div dir="rtl" lang="ar" className="bg-[var(--surface-1)] p-2.5">
      <span className="block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">المنتج · AR</span>
      {/* The drift, marked the way a spell-checker marks a mistake — because
          that is what it is, and nobody caught it. The hue is the rejected
          state, not the accent: blue on this site is light, and a thing that
          is wrong is not lit, it is flagged (§7). */}
      <span className="mt-1 block text-[length:var(--fs-eyebrow)] font-medium text-[var(--text)] decoration-wavy underline decoration-[var(--mk-state-rejected)] underline-offset-4">
        طازجة كل أسبوع.
      </span>
    </div>
  </div>,

  <ul key="queue" className="divide-y divide-[var(--hairline)]">
    {[
      ["Sales", "Is this logo OK for the deck?"],
      ["HR", "Is this on-brand?"],
      ["Agency", "Which green do we use?"],
    ].map(([who, question]) => (
      <li key={who} className="flex items-baseline justify-between gap-3 py-2">
        <span className="text-[length:var(--fs-eyebrow)] font-medium text-[var(--text)]">{who}</span>
        <span className="truncate text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{question}</span>
      </li>
    ))}
  </ul>,
];
