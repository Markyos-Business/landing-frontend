import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
import { Arrow } from "@/components/ui/Icon";

/*
 * The voice profile: traits, the register each channel uses, and one term.
 *
 * The three parts stack because that is the order the paragraph beside it
 * describes them in — choose the traits, set the register per channel, then
 * build the term base. The single term row at the bottom is the part that is
 * hardest to explain and easiest to show: one product name, its approved
 * Arabic, and a mark saying a human signed it off.
 *
 * Markup rather than a screenshot — see BrandHub.tsx.
 */



export function VoiceMock({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const v = t.voice;

  return (
    /*
     * `dir="ltr"`: a mock does not mirror with the page.
     *
     * This is a picture of the product running an English-language project,
     * the way BrandHub is a picture of it running an Arabic one. On /ar the
     * whole page flips, and letting this flip with it produced a screenshot
     * that exists nowhere — English labels laid out right-to-left, with the
     * full stop at the front of the sentence. A photograph of a screen does
     * not mirror; neither does this. Arabic content inside still states its
     * own direction.
     */
    <div dir={dir} lang={lang} className="mk-card text-start">
      <div className="mk-card-pad pb-5">
        <p className="text-[0.75rem] text-[var(--text-muted)]">{v.traitsHeading}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {v.traits.map((trait, i) => (
            <li
              key={trait}
              className={
                "rounded-[var(--radius-pill)] px-3 py-1 text-[0.75rem] font-medium " +
                (i < 3
                  ? "bg-[var(--solid)] text-[var(--solid-ink)]"
                  : "border border-[var(--hairline-strong)] text-[var(--text-muted)]")
              }
            >
              {trait}
            </li>
          ))}
        </ul>
      </div>

      <dl className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)] text-[0.75rem]">
        {v.channels.map(({ channel, register }) => (
          <div key={channel} className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
            <dt className="text-[var(--text)]">{channel}</dt>
            <dd className="text-end text-[var(--text-muted)]">{register}</dd>
          </div>
        ))}
      </dl>

      <div className="mk-card-pad pt-5">
        <p className="text-[0.75rem] text-[var(--text-muted)]">{v.termHeading}</p>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-[length:var(--fs-ui)] text-[var(--text)]">{v.termEn}</span>
          <Arrow size={14} />
          <span lang="ar" dir="rtl" className="text-[length:var(--fs-ui)] text-[var(--text)]">
            {v.termAr}
          </span>
          <span className="ms-auto rounded-[var(--mk-r-status)] bg-[var(--mk-state-approved-soft)] px-2 py-0.5 text-[length:var(--fs-eyebrow)] font-medium text-[var(--mk-state-approved)]">
            Approved
          </span>
        </div>
      </div>
    </div>
  );
}
