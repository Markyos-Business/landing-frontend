import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
import { Icon } from "@/components/ui";

/*
 * Six editors, two hundred and forty-eight viewers, one bill.
 *
 * /solutions/company-rollout makes a claim that sounds like a catch —
 * "you pay for whoever changes the brand, not whoever uses it" — and the
 * only convincing way to make it is to show the screen where 248 people
 * cost nothing. A sentence saying so reads as marketing; a seat count
 * reads as a fact.
 *
 * The partner link under it is the same argument from outside the company:
 * the print house is not a seat either, and the row says when its access
 * stops, because "share it with anyone" and "and it expires" have to arrive
 * together or the first one is the scary half.
 *
 * Markup rather than a screenshot — see BrandHub.tsx.
 */

export function SeatsPanel({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const s = t.seats;

  return (
    <div dir={dir} lang={lang} className="mk-card mk-card-pad text-start">
      <p className="text-[length:var(--fs-ui)] font-medium text-[var(--text)]">{s.heading}</p>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {s.groups.map((group) => (
          <li
            key={group.label}
            className="rounded-[var(--radius-widget)] p-4"
            style={{
              background: group.free ? "var(--accent-soft)" : "var(--canvas)",
              boxShadow: group.free ? "none" : "inset 0 0 0 1px var(--hairline)",
            }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                {group.label}
              </span>
              <span
                className="text-[length:var(--fs-eyebrow)] font-medium"
                style={{ color: group.free ? "var(--accent-on-soft)" : "var(--text-muted)" }}
              >
                {group.price}
              </span>
            </div>
            {/* The number is the argument, so it is the biggest thing in the
                card — 22px, the one size above the product's own 14. */}
            <p className="mt-1.5 text-[1.375rem] leading-none font-medium tracking-[-0.04em] text-[var(--text)]">
              {group.count}
            </p>
            <p className="mt-2.5 text-[length:var(--fs-eyebrow)] leading-[1.55] text-[var(--text-muted)]">
              {group.line}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--hairline)] pt-4">
        <span className="flex items-center gap-2 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          <Icon name="lock" size={13} className="text-[var(--text-faint)]" />
          {s.partnerLabel}
        </span>
        <span className="text-[0.8125rem] text-[var(--text)]">{s.partnerValue}</span>
        <span className="text-[length:var(--fs-eyebrow)] text-[var(--text-faint)]">
          {s.partnerExpiry}
        </span>
      </div>
    </div>
  );
}
