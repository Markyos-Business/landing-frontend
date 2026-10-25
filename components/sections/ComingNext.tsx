import type { ComingNextCopy } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHead } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The roadmap.
 *
 * Three phases, in the order they ship. Publishing it is a deliberate
 * trade: it tells a visitor exactly what the product cannot do today, which
 * costs something — and it is the same promise the status chips make
 * everywhere else on the page, so withholding it here would make those chips
 * read as marketing rather than as disclosure.
 *
 * The link out sits beside the heading rather than under the cards, because
 * somebody who wants the full roadmap wants it before reading the summary,
 * not after.
 */

export function ComingNext({ copy, locale }: { copy: ComingNextCopy; locale: Locale }) {
  return (
    <Section id="roadmap" labelledBy="roadmap-heading" rule>
      {/* This section hand-rolled the reference's header row before there
          was one. Same layout, now the shared one. */}
      <SectionHead
        id="roadmap-heading"
        title={copy.headline}
        lead={copy.subheadline}
        align="start"
        action={<Button cta={copy.link} locale={locale} variant="outline" size="sm" />}
      />

      <ul className="mk-grid mt-12 md:grid-cols-3">
        {copy.phases.map((phase, i) => (
          <li key={phase.season} className="flex flex-col">
            {/*
             * The rail.
             *
             * Three phases in ship order, drawn as the track they are rather
             * than left for the reader to infer from three identical cards.
             * The first segment is lit and the rest are a 20% line: light is
             * what this page uses to say "this one", and a roadmap's "this
             * one" is the part that is actually being built (§8 — one light
             * source per section, and this is the roadmap's).
             *
             * The node sits at the start edge, so in Arabic the track reads
             * right-to-left and the lit phase is the rightmost. Nothing here
             * is content — the season and theme below say all of it in words
             * — so the whole rail is hidden from the accessibility tree.
             */}
            <div aria-hidden="true" className="relative mb-6 h-px w-full bg-[var(--hairline-strong)]">
              {i === 0 ? (
                <span className="absolute inset-0 bg-[var(--mk-blue)] shadow-[var(--mk-glow-soft)]" />
              ) : null}
              <span
                className={`absolute -top-[3.5px] start-0 size-2 rounded-full ${
                  i === 0
                    ? "bg-[var(--mk-blue)] shadow-[var(--mk-glow)]"
                    : "bg-[var(--mk-line-strong)]"
                }`}
              />
            </div>

            <Card pad={false} className="flex flex-1 flex-col">
            <div className="px-7 pb-5 pt-7">
              <p className="mk-bidi mk-eyebrow text-[var(--accent-text)]">{phase.season}</p>
              <p className="mk-bidi mt-2 text-[length:var(--fs-lead)] font-medium text-[var(--text)]">
                {phase.theme}
              </p>
            </div>

            {/*
             * The items under each phase are not on the homepage.
             *
             * Fifteen roadmap lines is a document, not a section — what a
             * visitor needs here is when, and roughly what; the list is at
             * /roadmap, linked from the heading above. The rail and the
             * two lines per phase carry the disclosure that matters: this
             * one is being built, those two are not yet.
             */}
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
