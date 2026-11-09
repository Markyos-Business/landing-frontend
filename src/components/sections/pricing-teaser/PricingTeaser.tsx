"use client";

import type { Locale } from "@/lib/i18n/locales";
import { Words } from "@/components/ui/Words";
import { useState } from "react";
import type { PricingTeaserCopy } from "@/content/types";
import { TextLink, Display, INK_55, Lead, Pool, TRACK } from "../landing";
import { Toggle } from "./Toggle";
import { Plan } from "./Plan";

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
