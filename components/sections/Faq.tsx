import type { FaqCopy, SiteCopy } from "@/content/types";
import { Chip } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

/*
 * The FAQ.
 *
 * Native details/summary, so every answer is open to a crawler, searchable
 * with the browser's own find, and expandable before any JavaScript loads. An
 * FAQ built from useState is an FAQ that is invisible to the search engine it
 * exists to feed.
 *
 * On a narrow measure and centred, which is the reference's layout and the
 * right one: this is the only part of the page somebody reads line by line
 * looking for one specific answer, and a 1100px-wide question is hard to scan
 * down.
 *
 * An answer may mention something that has not shipped — importing an old PDF
 * guideline, for instance. When it does it names the feature and gets the same
 * chip the rest of the page uses, so the FAQ cannot quietly become the one
 * place on the site that over-promises.
 */

export function Faq({ copy, chips }: { copy: FaqCopy; chips: SiteCopy["chips"] }) {
  return (
    <Section id="faq" labelledBy="faq-heading">
      <h2 id="faq-heading" className="mk-h2-lg">
        {copy.headline}
      </h2>

      <div className="mt-12 max-w-[44rem] border-b border-[var(--hairline)]">
        {copy.items.map((item) => (
          <details key={item.question} className="group border-t border-[var(--hairline)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4">
              <span className="mk-bidi text-[0.875rem] font-medium text-[var(--text)]">
                {item.question}
              </span>
              {/* One glyph that rotates, rather than two that swap — nothing
                  to mirror in Arabic and nothing to label. */}
              <Icon
                name="chevron"
                size={14}
                className="flex-none text-[var(--text-muted)] transition-transform group-open:rotate-180"
              />
            </summary>

            <div className="space-y-3 pb-5">
              <p className="mk-bidi text-[0.875rem] leading-[1.6] text-[var(--text-muted)]">
                {item.answer}
              </p>
              {item.coming ? <Chip feature={item.coming} chips={chips} /> : null}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
