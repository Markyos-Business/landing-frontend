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
              {/*
               * 15px, the body size, not the 14px UI size this used to be.
               * §6 reserves 14 for labels, nav and buttons; a question is
               * something you read, not a control you operate, even though
               * it happens to live inside a <summary>.
               */}
              <span className="mk-bidi text-[length:var(--fs-body)] font-medium text-[var(--text)]">
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
              {/*
               * The answer is capped narrower than the question it sits
               * under.
               *
               * At 44rem and 14px these ran to about 50em a line — one of
               * them 139 characters without a break. Comfortable reading is
               * roughly 30-40em, and em is the measure to use here rather
               * than a character count, because the 45-75 character rule is
               * calibrated on Latin and Arabic sets far more characters into
               * the same width. 34rem at 15px is about 36em.
               *
               * The question keeps the full width: it is one short line you
               * scan down a list of, and narrowing it would make the list
               * harder to read, not easier.
               */}
              <p className="mk-bidi max-w-[34rem] text-[length:var(--fs-body)] leading-[1.6] text-[var(--text-muted)]">
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
