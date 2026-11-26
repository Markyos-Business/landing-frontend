import type { Locale } from "@/lib/i18n/locales";
import type { PlanCopy } from "@/content/types";
import { BLUE_INK, Cta, INK_55 } from "../landing";

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
      /*
       * The card's ground, edge and radius now come from `.mk-plan`, and the
       * recommended one's lit edge, halo and pool from `.mk-plan-lit`, so this
       * card and the one on /pricing are the same object described once. The
       * inline values that used to say it here are gone rather than
       * overridden: an inline style beats a class, so leaving them would have
       * meant the two surfaces drifting apart the next time one was edited.
       */
      className={`mk-reach mk-plan${plan.recommended ? " mk-plan-lit" : ""}`}
      style={{ padding: "30px 28px 28px" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}
      >
        <h3 className="mk-bidi" style={{ margin: 0, fontWeight: 500, fontSize: 20 }}>
          {plan.name}
        </h3>
        {plan.recommended ? (
          /* `.mk-plan-tag`: the accent edge with the canvas as ink, uppercase
             and tracked in Latin and neither in Arabic, per §11. */
          <span className="mk-bidi mk-plan-tag">{recommendedLabel}</span>
        ) : null}
      </div>

      {/*
       * The number carries the weight, the unit does not — §11, and now
       * literally: the amount is 44px at 600 in page ink, the unit 14px at
       * 500 in muted, the way /pricing has always set the same two values.
       *
       * They were one string here until v5.2, which is the whole of the bug
       * the owner photographed. `.mk-plan-amount` is `white-space: nowrap`
       * so that an amount never breaks from its currency; glue the unit on
       * and the unit cannot break away either. "$19 a month per brand" at
       * 44px is wider than a 280px card, so it ran out of the card and over
       * its neighbour, and "$29 a month + add-ons" did the same.
       *
       * `flex-wrap` as well as the split: the unit belongs beside the amount
       * when it fits and under it when it does not, and neither case should
       * depend on how long a future plan's unit is.
       */}
      <p
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          columnGap: 8,
          rowGap: 4,
          margin: "18px 0 0",
        }}
      >
        <span className="mk-bidi mk-plan-amount" style={{ fontSize: 44 }}>
          {plan.price}
        </span>
        {plan.period ? (
          <span
            className="mk-bidi"
            style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3, color: INK_55 }}
          >
            {plan.period}
          </span>
        ) : null}
      </p>

      {/*
       * The ledger: ruled above and below as one block, rather than a top rule
       * drawn on each row. `.mk-plan-limit dd` carries `tabular-nums`, which is
       * what the reference's mono face was actually for — the values line up
       * down the column without a third font family being loaded for figures.
       */}
      <dl className="mk-plan-limits" style={{ margin: "22px 0 0", flex: 1 }}>
        {plan.rows.map((row) => (
          <div key={row.label} className="mk-plan-limit">
            <dt className="mk-bidi">{row.label}</dt>
            <dd className="mk-bidi">{row.value}</dd>
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
            color: plan.recommended ? "#fff" : BLUE_INK,
            boxShadow: plan.recommended ? undefined : "inset 0 0 0 1px rgba(0,85,255,.25)",
          }}
        >
          {plan.cta.label}
        </Cta>
      </div>
    </li>
  );
}
