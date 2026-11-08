import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";

/*
 * The moment of handover, as a receipt.
 *
 * Four facts that /solutions/client-handoff states in four paragraphs: the
 * hub changes owner, the studio keeps the role it agreed, the project's seat
 * comes back, and the reward starts. Stated, they sound like terms; shown as
 * one screen, they read as a thing that has already happened — which is the
 * difference the page needed, because the objection it answers ("what do I
 * lose when I hand it over") is answered by the three rows under the owner,
 * not by the sentence above them.
 *
 * The ownership row is the picture. Two names with the transfer between
 * them, the studio's struck through, so nobody has to read a sentence to
 * learn which way it went.
 *
 * Markup rather than a screenshot — see BrandHub.tsx.
 */

export function HandoffCard({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const h = t.handoff;

  return (
    <div dir={dir} lang={lang} className="mk-card mk-card-pad text-start">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[length:var(--fs-ui)] font-medium text-[var(--text)]">{h.heading}</p>
        {/* The address is the client's own, which is half of what "they own
            it now" means. `ltr` because a web address is never Arabic. */}
        <p dir="ltr" lang="en" className="text-[length:var(--fs-eyebrow)] text-[var(--text-faint)]">
          {h.hubUrl}
        </p>
      </div>

      <div className="mk-inset mt-4 p-4">
        <p className="text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{h.ownerLabel}</p>
        {/*
         * No arrow between the two names, which was the first draft and the
         * wrong one: arrows came off this site on 6 Nov. The transfer is
         * drawn instead — the studio struck through and sitting at the ink's
         * faintest step, the client in a tinted pill at full weight — and
         * that reads in one glance and in both directions, which an arrow
         * pointing the wrong way in Arabic would not.
         */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
          <span className="text-[0.875rem] text-[var(--text-faint)] line-through">
            {h.ownerFrom}
          </span>
          <span
            className="rounded-[var(--mk-r-status)] px-2.5 py-1 text-[0.875rem] font-medium"
            style={{ background: "var(--accent-soft)", color: "var(--accent-on-soft)" }}
          >
            {h.ownerTo}
          </span>
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 text-[0.8125rem]">
        {h.rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{row.label}</dt>
            <dd
              className="text-end text-[0.875rem] font-medium"
              style={{ color: row.good ? "var(--mk-state-approved)" : "var(--text)" }}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* The reward, on its own tinted row: it is the part of this page
          nobody believes on first reading, so it is the part that is drawn
          rather than listed. */}
      <div
        className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[var(--radius-widget)] p-3.5"
        style={{ background: "var(--accent-soft)" }}
      >
        <span className="text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          {h.rewardLabel}
        </span>
        <span className="text-[0.875rem] font-medium text-[var(--accent-on-soft)]">
          {h.rewardValue}
        </span>
        <span className="w-full text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          {h.rewardNote}
        </span>
      </div>
    </div>
  );
}
