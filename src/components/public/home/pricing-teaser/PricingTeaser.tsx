"use client";

import type { Locale } from "@/lib/i18n/locales";
import { Words } from "@/components/ui";
import { useRef, useState } from "react";
import type { PricingTeaserCopy } from "@/content/types";
import { TextLink, Display, Lead, Pool, TRACK } from "../landing";
import { Toggle } from "./Toggle";
import { Plan } from "./Plan";

/*
 * One subscription instead of seven. And start free.
 *
 * ── Three audiences, one grid ────────────────────────────────────────────
 *
 * Freelancers, studios and agencies, and companies — the same three /pricing
 * has, from the same catalogue, in the same order. It was two until copy deck
 * v4.3 split freelancers off from studios, and the count is the copy's now
 * rather than this component's: the track, the knob and the keyboard all read
 * `copy.audiences.length`.
 *
 * It is a real radio group, not three buttons: the options are mutually
 * exclusive states of one control, so arrow keys move between them and a
 * screen reader announces "1 of 3". The sliding knob is a separate
 * absolutely-positioned element behind the labels — that way the labels
 * never move, and only `transform` animates.
 *
 */

export function PricingTeaser({ copy, locale }: {
  locale: Locale; copy: PricingTeaserCopy }) {
  const [active, setActive] = useState(copy.audiences[0]?.id ?? "");
  const count = copy.audiences.length;
  const index = Math.max(
    0,
    copy.audiences.findIndex((audience) => audience.id === active),
  );
  const audience = copy.audiences[index];
  const groupRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      style={{
        position: "relative",
        padding: "clamp(72px,10vw,120px) 24px",
        background: "var(--surface-1)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
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
            ref={groupRef}
            role="radiogroup"
            aria-label={copy.headline}
            style={{
              position: "relative",
              display: "inline-grid",
              gridTemplateColumns: `repeat(${count}, 1fr)`,
              marginBlockStart: 40,
              padding: 4,
              borderRadius: 999,
              background: TRACK,
              /*
               * Sized by its labels, not by a number.
               *
               * This was a flat `inlineSize: 300`, which gives each half about
               * 146px. «للاستديوهات والمستقلين» does not fit in 146px at 15px,
               * so the Arabic label was overrunning its own half of the track
               * -- the same fault this codebase keeps finding, a width chosen
               * against one language's words.
               *
               * `inline-grid` with equal `1fr` tracks and no width sizes every
               * column to the widest label in any of them, so the segments stay
               * equal (which the knob's width depends on) and the track grows
               * to whatever the copy needs, in either locale.
               */
              maxInlineSize: "100%",
            }}
          >
            {/*
             * The knob. Placed at the start edge and moved by `--mk-dir`,
             * which tailwind/ sets to -1 in RTL — so it starts at the right in
             * Arabic and travels leftwards, and this component never has to
             * know which locale it is in.
             *
             * `--mk-knob` was the token for this and is one travel of 100%:
             * right for a two-way switch, and silent about a three-way one.
             * The distance is `index * 100%` of the knob's own width now,
             * which is the same arithmetic the /pricing switch does.
             */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                /* Anchored at both ends, not given a height, so a label that
                   wraps to two lines on a narrow screen grows the track and
                   the knob with it. */
                top: 4,
                bottom: 4,
                insetInlineStart: 4,
                inlineSize: `calc((100% - 8px) / ${count})`,
                borderRadius: 999,
                background: "var(--surface-1)",
                boxShadow: "0 1px 2px rgba(255,255,255,0.12),0 6px 14px -6px rgba(0,0,0,.6)",
                transition: "transform 420ms cubic-bezier(.32,.72,0,1)",
                transform: `translateX(calc(${index * 100}% * var(--mk-dir)))`,
              }}
            />
            {copy.audiences.map((option, i) => (
              <Toggle
                key={option.id}
                label={option.label}
                checked={i === index}
                onSelect={() => setActive(option.id)}
                onMove={(delta) => {
                  const next = (i + delta + count) % count;
                  setActive(copy.audiences[next].id);
                  /* And take focus with it. The pick carries `tabIndex={0}`,
                     so leaving focus behind would strand it on a button the
                     tab key can no longer reach. */
                  groupRef.current
                    ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]
                    ?.focus();
                }}
              />
            ))}
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
          {audience.plans.map((plan) => (
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
          {audience.note}
        </Lead>
        {/*
         * The reference section closes its row with a bar: the small print at
         * one end, the one way out at the other, on the card surface inside
         * the same hairline. The copy is unchanged — this is the sentence that
         * was already here, given the shape the rest of the row now has.
         *
         * `space-between` rather than a side, so it needs no mirroring: the
         * small print starts at the start edge and the link ends at the end
         * edge in both editions.
         */}
        <div className="mk-plan-strip" style={{ marginBlockStart: 18 }}>
          <p className="mk-bidi mk-plan-strip-items" style={{ margin: 0 }}>
            {copy.underBoth}
          </p>
          <TextLink locale={locale} href={copy.link.href} style={{ fontSize: 15 }}>
            {copy.link.label}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
