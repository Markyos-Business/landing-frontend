"use client";

import type { Locale } from "@/lib/i18n/locales";
import { Words } from "@/components/ui/Words";
import { useState } from "react";
import type { PlanCopy, PricingTeaserCopy } from "@/content/types";
import {
  TextLink,
  BLUE_DEEP,
  Cta,
  Display,
  INK,
  INK_55,
  Lead,
  Pool,
  RING_6,
  SELECTED,
  TRACK,
} from "./landing";

/*
 * One subscription instead of seven. And start free.
 *
 * ── Two audiences, one grid ──────────────────────────────────────────────
 *
 * Studios pay by active projects, companies pay by editors, and the two
 * ladders happen to cost the same. Showing both at once would mean six cards
 * and a reader working out which three are theirs; the toggle shows three.
 *
 * It is a real radio group, not two buttons: the two options are mutually
 * exclusive states of one control, so arrow keys move between them and a
 * screen reader announces "1 of 2". The sliding knob is a separate
 * absolutely-positioned element behind the labels — that way the labels
 * never move, and only `transform` animates.
 *
 * The recommended plan carries the lit ring and the badge. Exactly one, in
 * both ladders, because a recommendation that applies to two of three cards
 * is not one.
 */

export function PricingTeaser({ copy, locale }: {
  locale: Locale; copy: PricingTeaserCopy }) {
  const [audience, setAudience] = useState<"studio" | "company">("studio");
  const studio = audience === "studio";
  const plans = studio ? copy.studioPlans : copy.companyPlans;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      style={{
        position: "relative",
        padding: "clamp(72px,10vw,120px) 24px",
        background: "#fff",
        boxShadow: "0 0 0 1px rgba(11,11,15,.04)",
        /* clip, not hidden: `overflow: hidden` makes a scroll container, and
           a scroll-driven `view()` timeline resolves against the nearest one
           — so every reveal inside this section was pinned at full progress
           and silently did nothing. `clip` clips the same pixels without
           being scrollable, which is also closer to what this was for. */
        overflow: "clip",
        /* Centred heading, toggle and notes; the plan cards opt back out. */
        textAlign: "center",
      }}
    >
      <Pool
        style={{
          insetInlineStart: "50%",
          top: 120,
          inlineSize: 900,
          blockSize: 520,
          transform: "translateX(calc(-50% * var(--mk-dir)))",
          background:
            "radial-gradient(50% 50% at 50% 50%,rgba(0,153,255,.08),rgba(0,153,255,0) 70%)",
        }}
      />

      <div className="mk-seq" style={{ position: "relative", maxWidth: 1040, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBlockEnd: 60,
          }}
        >
          <Display id="pricing-heading">
            <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
          </Display>

          {/* v3 §2.9. The offer in one line, before the toggle asks the
              reader to choose a side and the cards spell out the limits. */}
          {copy.body ? (
            <Lead style={{ marginBlockStart: 20, maxWidth: "34em" }}>
              {copy.body}
            </Lead>
          ) : null}

          <div
            role="radiogroup"
            aria-label={copy.headline}
            style={{
              position: "relative",
              display: "inline-grid",
              gridTemplateColumns: "1fr 1fr",
              marginBlockStart: 40,
              padding: 4,
              borderRadius: 999,
              background: TRACK,
              inlineSize: 300,
            }}
          >
            {/*
             * The knob. Placed at the start edge and moved by `--mk-knob`,
             * which globals.css flips for RTL — so it starts at the right in
             * Arabic and travels leftwards, and this component never has to
             * know which locale it is in.
             */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 4,
                insetInlineStart: 4,
                inlineSize: "calc(50% - 4px)",
                blockSize: 44,
                borderRadius: 999,
                background: "#fff",
                boxShadow: "0 1px 2px rgba(11,11,15,.08),0 6px 14px -6px rgba(11,20,60,.2)",
                transition: "transform 420ms cubic-bezier(.32,.72,0,1)",
                transform: studio ? "none" : "translateX(var(--mk-knob))",
              }}
            />
            <Toggle
              label={copy.studioToggle}
              checked={studio}
              onSelect={() => setAudience("studio")}
            />
            <Toggle
              label={copy.companyToggle}
              checked={!studio}
              onSelect={() => setAudience("company")}
            />
          </div>
        </div>

        <ul
          className="mk-still mk-seq-pop"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
            gap: 16,
            alignItems: "stretch",
            margin: 0,
            padding: 0,
            listStyle: "none",
            textAlign: "start",
          }}
        >
          {plans.map((plan) => (
            <Plan
              key={plan.name}
              plan={plan}
              recommendedLabel={copy.recommendedLabel}
              locale={locale}
            />
          ))}
        </ul>

        {/* Capped: at 1040px these notes ran to 69–74em a line. Comfortable
            reading is nearer 35em, and `em` is the right unit here because
            Arabic sets more characters into the same width than Latin. */}
        <Lead
          style={{
            marginBlockStart: 32,
            marginInline: "auto",
            maxWidth: "38em",
            textAlign: "center",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {studio ? copy.studioNote : copy.companyNote}
        </Lead>
        <p
          className="mk-bidi"
          style={{
            margin: "6px auto 0",
            maxWidth: "40em",
            textAlign: "center",
            fontSize: 14,
            color: INK_55,
          }}
        >
          {copy.underBoth}{" "}
          <TextLink locale={locale} href={copy.link.href} style={{ fontSize: 14 }}>
            {copy.link.label}
          </TextLink>
        </p>
      </div>
    </section>
  );
}

function Toggle({
  label,
  checked,
  onSelect,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      tabIndex={checked ? 0 : -1}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className="mk-bidi"
      style={{
        position: "relative",
        blockSize: 44,
        border: 0,
        background: "transparent",
        borderRadius: 999,
        cursor: "pointer",
        fontSize: 15,
        fontWeight: 500,
        color: checked ? INK : INK_55,
        transition: "color 200ms",
      }}
    >
      {label}
    </button>
  );
}

function Plan({
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
