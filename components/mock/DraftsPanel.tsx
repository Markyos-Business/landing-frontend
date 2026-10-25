import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
import { Icon } from "@/components/ui/Icon";

/*
 * The second product shot: what the brief analysis hands back.
 *
 * Markup rather than a screenshot, for the reasons in BrandHub.tsx.
 *
 * This one is in English where the hero's hub is in Arabic, and that pairing
 * is the point rather than an oversight: the product runs projects in either
 * language, and showing one of each proves it in a way a caption claiming it
 * would not.
 *
 * The content is a picture of a fictional project, not site copy, so it lives
 * here and not in content/ — there is nothing here for a copywriter to
 * approve or a translator to transcreate.
 */

export function DraftsPanel({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const d = t.drafts;

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
      <p className="text-[0.75rem] text-[var(--text-muted)]">
        {d.heading}
      </p>

      <div className="mt-4 space-y-3">
        <div className="mk-inset p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[0.75rem] font-medium text-[var(--text)]">{d.positioningLabel}</p>
            <p className="flex items-center gap-1.5 text-[length:var(--fs-eyebrow)] font-medium text-[var(--accent-text)]">
              <Icon name="check" size={12} className="flex-none" />
              {d.acceptedLabel}
            </p>
          </div>
          <p className="mt-2.5 text-[0.875rem] leading-[1.5] text-[var(--text)]">
            {d.positioningLine}
          </p>
          <p className="mt-2.5 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
            {d.sources}
          </p>
        </div>

        <div className="mk-inset p-4">
          <p className="text-[0.75rem] font-medium text-[var(--text)]">
            {d.personaLabel}
          </p>
          <p className="mt-2.5 text-[0.875rem] leading-[1.5] text-[var(--text-muted)]">
            {d.personaLine}
          </p>

          {/*
           * Inert. These look like the product's controls because they are a
           * picture of them — they are not focusable, not in the tab order
           * and announce nothing, so nobody using a keyboard or a screen
           * reader is offered a button that does not exist.
           */}
          <div aria-hidden="true" className="mt-4 flex items-center gap-3">
            <span className="mk-btn mk-btn-sm mk-solid">Accept</span>
            <span className="text-[length:var(--fs-ui)] font-medium text-[var(--text-muted)]">
              Dismiss
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
