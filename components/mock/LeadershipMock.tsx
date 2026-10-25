import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
/*
 * What the stakeholder workshop hands back.
 *
 * Four leaders answered the same question alone; two of them disagree about
 * the price position and nobody answered "who is the brand not for?". That is
 * the whole feature in one picture, and it is more persuasive than the
 * paragraph beside it because the disagreement is visible rather than claimed.
 *
 * Markup rather than a screenshot — see BrandHub.tsx. One answer is in Arabic
 * because in a Gulf company one of them would be, and the product compares
 * them without anyone translating first.
 */


export function LeadershipMock({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const l = t.leadership;

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
    <div dir={dir} lang={lang} className="mk-card mk-card-pad text-start">
      <p className="text-[0.75rem] text-[var(--text-muted)]">{l.question}</p>

      <ul className="mt-4 grid grid-cols-2 gap-2.5">
        {l.answers.map((answer, i) => (
          <li
            key={answer.role}
                        className={
              "rounded-[var(--radius-widget)] border bg-[var(--canvas)] p-3 " +
              (i < 2
                ? "border-[var(--mk-state-rejected)]"
                : "border-[var(--hairline)]")
            }
          >
            <span className="block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
              {answer.role}
            </span>
            <span className="mt-1 block text-[0.875rem] font-medium text-[var(--text)]">
              {answer.word}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-2.5 border-t border-[var(--hairline)] pt-4 text-[0.75rem]">
        <div className="flex gap-3">
          <dt className="w-24 flex-none font-medium text-[var(--mk-state-rejected)]">{l.disagreeLabel}</dt>
          <dd className="text-[var(--text)]">{l.disagreeLine}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-24 flex-none text-[var(--text-muted)]">{l.unansweredLabel}</dt>
          <dd className="text-[var(--text)]">{l.unansweredLine}</dd>
        </div>
      </dl>
    </div>
  );
}
