import type { HandoffLoopCopy, SiteCopy } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The handoff loop.
 *
 * Build it free, hand it over, earn when the client grows. The three-step
 * strip beside the argument is the whole business model in nine words, and it
 * is numbered because the order is the deal: the studio gives something away
 * first, and the reward is downstream of that.
 *
 * The numerals are the accent and they are large. That is the one place on
 * the page where a number is the content rather than a label — 20% back is
 * the offer, and the strip is where a studio owner checks whether they
 * believe it.
 */

export function HandoffLoop({
  copy,
  chips,
  locale,
}: {
  copy: HandoffLoopCopy;
  chips: SiteCopy["chips"];
  locale: Locale;
}) {
  return (
    <Section id="handoff-loop" labelledBy="handoff-loop-heading">
      <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <Chip feature={copy.feature} chips={chips} className="mb-5" />

          <h2 id="handoff-loop-heading" className="mk-h2">
            {copy.headline}
          </h2>

          {copy.body.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 32)}
              className={`mk-bidi mt-5 text-[length:var(--fs-lead)] leading-[1.6] ${
                i === copy.body.length - 1
                  ? "font-medium text-[var(--text)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-8">
            <Button cta={copy.cta} locale={locale} variant="solid" size="sm" />
          </div>
        </div>

        {/*
         * The three steps, drawn as the sequence they are.
         *
         * The markup was already a numbered list, which is correct, and it
         * read as three unrelated rows — but the order *is* the deal: the
         * studio gives something away first and the reward is downstream of
         * that. A rail running from each numeral to the next says so without
         * a word of copy, and the numerals stay the size they were, because
         * they are the content here and not a label.
         *
         * A 10% line rather than light: nothing in this strip is selected or
         * in progress, it is just the shape of the offer, and light on this
         * page means "this one" (§8). Drawn on every step but the last — a
         * line after step three would point at nothing.
         */}
        <Card pad={false}>
          <ol className="divide-y divide-[var(--hairline)]">
            {copy.strip.map((item, i) => (
              <li key={item.label} className="flex items-start gap-5 px-7 py-6">
                <span aria-hidden="true" className="relative w-7 flex-none self-stretch">
                  <span className="block text-center text-[length:var(--fs-d3)] font-medium leading-none tracking-[-0.04em] text-[var(--accent-text)]">
                    {i + 1}
                  </span>
                  {i < copy.strip.length - 1 ? (
                    <span className="absolute bottom-[-1.5rem] start-1/2 top-11 w-px -translate-x-1/2 bg-[var(--hairline-strong)] rtl:translate-x-1/2" />
                  ) : null}
                </span>
                <span>
                  <span className="mk-bidi block text-[length:var(--fs-body)] font-medium text-[var(--text)]">
                    {item.label}
                  </span>
                  <span className="mk-bidi mt-1 block text-[length:var(--fs-ui)] leading-[1.5] text-[var(--text-muted)]">
                    {item.line}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </Section>
  );
}
