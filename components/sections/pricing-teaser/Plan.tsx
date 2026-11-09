import type { Locale } from "@/lib/i18n/locales";
import type { PlanCopy } from "@/content/types";
import { BLUE_DEEP, Cta, INK_55, RING_6, SELECTED } from "../landing";

export function Plan({
  plan,
  recommendedLabel,
  locale,
}: {
  plan: PlanCopy;
  recommendedLabel: string;
  locale: Locale;
}) {
  return (
    <li
      /* A plan card is a card with one CTA in it, so the card answers the
         pointer and the button inside it still does not move. */
      className="mk-reach"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: 28,
        borderRadius: 26,
        background: "#fff",
        boxShadow: plan.recommended ? SELECTED : RING_6,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}
      >
        <h3 className="mk-bidi" style={{ margin: 0, fontWeight: 500, fontSize: 20 }}>
          {plan.name}
        </h3>
        {plan.recommended ? (
          <span
            className="mk-bidi"
            style={{
              blockSize: 26,
              paddingInline: 10,
              borderRadius: 999,
              /* The design file fills this with a #3DB0FF→#0077FF gradient.
                 White on its top stop is 2.4:1 at 12px, so the badge takes
                 the deep blue flat — 5.9:1, and the one gradient the page
                 keeps is the one inside a headline. */
              background: BLUE_DEEP,
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {recommendedLabel}
          </span>
        ) : null}
      </div>

      {/* The number carries the weight, the unit does not — §11. */}
      <p style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "18px 0 0" }}>
        <span className="mk-bidi" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1 }}>
          {plan.price}
        </span>
      </p>

      <dl style={{ display: "flex", flexDirection: "column", margin: "22px 0 0", flex: 1 }}>
        {plan.rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              padding: "12px 0",
              boxShadow: "0 -1px 0 rgba(11,11,15,.06)",
              fontSize: 14,
            }}
          >
            <dt className="mk-bidi" style={{ color: INK_55 }}>
              {row.label}
            </dt>
            <dd className="mk-bidi" style={{ margin: 0, fontWeight: 500 }}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mk-bidi" style={{ margin: "14px 0 0", fontSize: 14, color: INK_55 }}>
        {plan.line}
      </p>

      {/*
       * The recommended plan's button is the filled one and carries the
       * cursor light; the other is quiet.
       *
       * Said with `tone` rather than by overriding `background` on a solid
       * pill, which is how it used to be said and which stopped being
       * harmless the day the filled pill grew a lit edge — a glowing ring
       * around a transparent button is a button announcing itself as the ask
       * when the whole point of it is that it is not.
       *
       * The 22px is on a wrapper and no longer on the pill, for the same
       * reason: `Spark` draws its ring 4.5px outside its own box, and a
       * margin on the pill inside it put 22px of empty space inside that box
       * — so the ring was drawn around the gap as well as the button.
       */}
      <div style={{ marginBlockStart: 22, display: "flex" }}>
        <Cta
          locale={locale}
          href={plan.cta.href}
          size="sm"
          tone={plan.recommended ? "solid" : "quiet"}
          style={{
            inlineSize: "100%",
            blockSize: 46,
            justifyContent: "center",
            color: plan.recommended ? "#fff" : BLUE_DEEP,
            boxShadow: plan.recommended ? undefined : "inset 0 0 0 1px rgba(0,85,255,.25)",
          }}
        >
          {plan.cta.label}
        </Cta>
      </div>
    </li>
  );
}
