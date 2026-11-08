import type { CompanyCopy } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Section, SectionFoot, SectionHead } from "@/components/ui/Section";
import { LeadershipMock } from "@/components/mock/LeadershipMock";
import { VoiceMock } from "@/components/mock/VoiceMock";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The company path: five parts.
 *
 * Only four of them render here. Part 4 — "Check before it goes out" — is the
 * tone checker, and it is big enough to be its own section immediately below,
 * which is where the reference puts it and where the copy doc says it goes.
 *
 * The part is skipped by *shape* rather than by index: a part with neither
 * body nor table is a pointer to somewhere else, not a part. That keeps the
 * numbering honest at the same time — the tone checker is still Part 4 in its
 * own eyebrow, because the reader is counting parts, not sections.
 */

export function CompanyRun({
  copy,
  locale,
}: {
  copy: CompanyCopy;
  locale: Locale;
}) {
  return (
    <Section id="companies" labelledBy="companies-heading" rule>
      {/* The lead moved under the mocks — see SectionFoot. A company-side
          reader gets two pictures of the product first and the sentence that
          explains them second, which is the reference's order (17, 18). */}
      <SectionHead
        id="companies-heading"
        eyebrow={copy.eyebrow}
        title={copy.headline}
        align="start"
      />

      {/*
       * The three parts are not on the homepage any more.
       *
       * They ran to 443 words and 2,039px — on their own, a sixth of
       * everything on the page — and every one of them is already written out
       * at /solutions/companies, which is where somebody who wants that depth
       * goes. What stays is the claim, the two things it is a claim about,
       * and the way through. The copy itself is untouched in `content/`: this
       * section stopped rendering it, `/solutions/companies` did not.
       *
       * The mocks stay because they were never the weight. They are the only
       * picture of the product a company-side reader gets.
       */}
      <div className="mk-seq mt-14 grid gap-5 md:grid-cols-2">
        <LeadershipMock locale={locale} />
        <VoiceMock locale={locale} />
      </div>

      <SectionFoot
        body={copy.subheadline}
        action={<Button cta={copy.cta} locale={locale} variant="outline" size="sm" />}
      />
    </Section>
  );
}

/* ── One part ────────────────────────────────────────────────────────────── */
