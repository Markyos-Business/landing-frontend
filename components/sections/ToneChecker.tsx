import type { CompanyCopy, SiteCopy, ToneCheckerCopy } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow, Section } from "@/components/ui/Section";
import { ToneResult } from "@/components/mock/ToneResult";
import { sentences } from "@/lib/text";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The tone checker.
 *
 * Structurally this is Part 4 of the company path, and its eyebrow says so —
 * a reader who has just counted through parts 1, 2 and 3 should not lose
 * their place because the layout changed. It is lifted out into a section of
 * its own because it is the feature most likely to be the reason somebody
 * buys, and it is the only one that needs a full-width picture to explain.
 *
 * Which part number it is comes from the company copy rather than from a
 * literal here: the pointer part is the one with no body and no table of its
 * own, exactly as CompanyRun finds it to skip it. Neither file states "4", so
 * neither can be wrong about it.
 */

export function ToneChecker({
  copy,
  company,
  chips,
  locale,
}: {
  copy: ToneCheckerCopy;
  company: CompanyCopy;
  chips: SiteCopy["chips"];
  locale: Locale;
}) {
  const pointerIndex = company.parts.findIndex(
    (part) => !part.body?.length && !part.table?.length,
  );
  const pointer = pointerIndex >= 0 ? company.parts[pointerIndex] : undefined;

  return (
    <Section id="tone-checker" labelledBy="tone-checker-heading">
      <div className="flex flex-col items-start text-start">
        <div className="mb-4 flex flex-wrap items-center justify-start gap-2">
          <Eyebrow>
            {copy.eyebrow}
            {pointer
              ? ` · ${company.partLabel} ${pointerIndex + 1} · ${pointer.name}`
              : ""}
          </Eyebrow>
          <Chip feature={copy.feature} chips={chips} />
        </div>

        <h2 id="tone-checker-heading" className="mk-h2 max-w-[30ch]">
          {copy.headline}
        </h2>

        <p className="mk-bidi mt-5 max-w-[37.5rem] text-[var(--fs-lead)] leading-[1.6] text-[var(--text-muted)]">
          {copy.body}
        </p>
      </div>

      <div className="mt-12">
        <ToneResult locale={locale} />
      </div>

      {/*
       * The feature lists are gone.
       *
       * Five outputs, two extras, a privacy note and two coming-soon rows
       * came to 265 words wrapped around one picture — a specification
       * where the page needed a demonstration. The mock above already
       * shows what comes back; reading five cards about it first is the
       * slow way to learn the same thing. All of it is still in
       * `content/` and still rendered at /platform.
       *
       * The privacy line stays. It is the objection a marketing manager
       * raises before pasting a customer's complaint into a web form, and
       * it is the one line here that is not a feature.
       */}
      <div className="mk-card mk-card-pad mt-4">
        <PrivacyNote text={copy.privacy} />
      </div>

      <div className="mt-12 flex flex-col items-start text-start">
        <Button cta={copy.cta} locale={locale} variant="solid" />
        <p className="mk-bidi mt-4 text-[length:var(--fs-ui)] text-[var(--text-muted)]">
          {copy.smallPrint}
        </p>
      </div>
    </Section>
  );
}

/**
 * The privacy line, split into its claim and its detail.
 *
 * "Your text is checked, not kept." is the answer; the rest is the proof. The
 * reference sets the first sentence in white above the detail, which is the
 * order somebody reads an objection in — reassure, then substantiate.
 */
function PrivacyNote({ text }: { text: string }) {
  const [claim, ...detail] = sentences(text);
  return (
    <>
      <p className="mk-bidi text-[0.875rem] font-medium text-[var(--text)]">{claim}</p>
      {detail.length ? <p className="mk-body mk-bidi mt-2">{detail.join(" ")}</p> : null}
    </>
  );
}
