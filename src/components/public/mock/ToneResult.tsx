import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
/*
 * The tone checker, mid-check.
 *
 * A real customer-service reply in Egyptian Arabic, sent on a channel the
 * company set to Gulf — which is the single hardest thing about this product
 * to explain in a sentence and the easiest thing to show. The flag at the
 * bottom is the whole feature.
 *
 * Markup rather than a screenshot — see BrandHub.tsx. The Arabic is real
 * Arabic text with `lang` on it, so it is read correctly by a screen reader
 * and shaped correctly by the Arabic face, neither of which an image of it
 * would be.
 */


/*
 * The three scores, in the order the traits are listed.
 *
 * Numbers, not copy, so they stay here rather than in content/mocks.ts —
 * 88 is 88 in both languages, and a transcreator asked to carry it would
 * have one more chance to get it wrong and nothing to gain.
 */
const SCORES = [88, 81, 46];

export function ToneResult({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const tone = t.tone;

  return (
    /*
     * The direction is the product's, not this page's.
     *
     * This card has no browser chrome around it — it is the product's
     * own screen — so the whole thing takes the direction the product
     * runs in. It used to be pinned to `dir="ltr"` on the reasoning
     * that a photograph of a screen does not mirror, which is right
     * about window furniture and wrong about this: an Arabic visitor
     * was shown an Arabic reply being graded by an English interface,
     * on the page that promises the product was built in Arabic.
     *
     * The sample reply keeps its own explicit `dir`. It is Arabic
     * because it is the example — a Gulf channel answered in Egyptian
     * — and that does not change with the locale.
     */
    <div dir={dir} lang={lang} className="mk-card grid text-start md:grid-cols-2">
      {/* What was pasted in */}
      <div className="mk-card-pad flex flex-col border-b border-[var(--hairline)] md:border-b-0 md:border-e">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[length:var(--fs-ui)] font-medium text-[var(--text)]">{tone.title}</p>
          <p className="rounded-[var(--mk-r-status)] bg-[var(--surface-2)] px-2.5 py-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
            {tone.channel}
          </p>
        </div>

        <div className="mk-inset mt-4 flex-1 p-4" dir="rtl" lang="ar">
          <p className="text-[length:var(--fs-ui)] leading-[1.9] text-[var(--text)]">
            أهلاً بيك!{" "}
            {/* The dialect slip, marked the way a checker marks one. */}
            <span className="decoration-wavy underline decoration-[var(--mk-state-rejected)] underline-offset-[6px]">
              إحنا آسفين
            </span>{" "}
            جداً على التأخير، والطلب هيوصلك بكرة إن شاء الله. لو عندك أي استفسار ثاني،
            كلّمنا في أي وقت.
          </p>
        </div>
      </div>

      {/* What came back */}
      <div className="mk-card-pad">
        <div className="flex flex-wrap items-baseline gap-3">
          <p className="text-[2rem] font-medium leading-none tracking-[-0.04em] text-[var(--text)]">
            72
          </p>
          <p className="text-[length:var(--fs-lead)] font-medium text-[var(--accent-text)]">{tone.verdict}</p>
          <p className="ms-auto text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{tone.outOf}</p>
        </div>

        <ul className="mt-5 space-y-4">
          {tone.traits.map((trait, i) => (
            <li key={trait.name}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[length:var(--fs-ui)] text-[var(--text)]">{trait.name}</span>
                <span className="text-[length:var(--fs-ui)] text-[var(--text-muted)]">
                  {SCORES[i]}
                </span>
              </div>
              {/* The bar restates the number beside it, so it is decoration
                  and announces nothing — a screen reader reads the score. */}
              <div
                aria-hidden="true"
                className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-[var(--track)]"
              >
                <div
                  className="h-full rounded-full bg-[image:var(--mk-data-bar)]"
                  style={{ inlineSize: `${SCORES[i]}%` }}
                />
              </div>
              <p className="mt-1.5 text-[length:var(--fs-eyebrow)] leading-[1.4] text-[var(--text-muted)]">
                {trait.why}
              </p>
            </li>
          ))}
        </ul>

        <div className="mk-inset mt-5 flex flex-wrap items-baseline gap-2.5 p-3">
          <span className="text-[length:var(--fs-eyebrow)] font-medium text-[var(--mk-state-expiring)]">{tone.flagLabel}</span>
          <span className="text-[length:var(--fs-eyebrow)] text-[var(--text)]">
            {tone.flagLine}
          </span>
        </div>
      </div>
    </div>
  );
}
