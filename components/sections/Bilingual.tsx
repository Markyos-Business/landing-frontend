"use client";

import { Words, wordCount } from "@/components/ui/Words";
import { useState } from "react";
import type { BilingualCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";
import {
  Accent,
  TextLink,
  Display,
  INK,
  INK_45,
  INK_55,
  IconTile,
  Lead,
  PANEL,
  RING,
  TRACK,
  BLUE_DEEP,
} from "./landing";

/*
 * Built in Arabic. Not translated into it.
 *
 * ── The picture has to be the proof ──────────────────────────────────────
 *
 * This is the one section where a claim cannot be made in prose, because the
 * claim is about what happens when you type Arabic into a tool that was built
 * for English. So the section shows the same brand hub twice — once in each
 * language, each laid out the way its own reader sees it — and lets the
 * visitor flip between them.
 *
 * Both panels are rendered and stacked in one grid cell, with the inactive
 * one faded and `pointer-events: none`. That is deliberate rather than
 * convenient: mounting and unmounting would make the swap jump as the grid
 * resized to each language's text, and the point of the comparison is that
 * the two are the same object.
 *
 * ── Why the mocks keep an explicit dir ───────────────────────────────────
 *
 * The English panel is `dir="ltr"` even on the Arabic page, and the Arabic
 * panel is `dir="rtl"` even on the English one. A product mock is a picture
 * of the product, and mirroring the English screenshot on an Arabic page
 * would show something the product never does — and would quietly destroy
 * the only evidence the section offers.
 */

export function Bilingual({ copy, locale }: { copy: BilingualCopy; locale: Locale }) {
  /*
   * The panel the section opens on is the page's own language.
   *
   * It was always Arabic, in both editions, on the reasoning that the
   * section's claim is that Arabic is first-class. On the English page
   * that meant an English reader met a screen they could not read, under a
   * heading about reading direction. Opening in their language and letting
   * them press «العربية» makes the same point by invitation: the mirror is
   * one tap away, and it is the same hub.
   */
  const [lang, setLang] = useState<"ar" | "en">(locale);
  const arabic = lang === "ar";

  return (
    <section
      id="arabic"
      aria-labelledby="arabic-heading"
      style={{
        position: "relative",
        padding: "clamp(72px,10vw,120px) 24px",
        background: "#fff",
        boxShadow: "0 0 0 1px rgba(11,11,15,.04)",
        /*
         * The light pool below is `inset: -40px`, so it reaches 40px past
         * this section on every side. Without this it added 16px to the
         * document's scroll width at every viewport and gave the whole site
         * a horizontal scrollbar — the glow is decoration and must never be
         * able to do that.
         *
         * And `clip` rather than `hidden`, which would make this a scroll
         * container — a `view()` timeline resolves against the nearest one,
         * so every reveal in this section was pinned at full progress and
         * silently did nothing.
         */
        overflow: "clip",
      }}
    >
      <div
        className="mk-seq"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div className="mk-slide-start">
          <Display id="arabic-heading" size="h2lg">
            <span className="mk-bidi">
              <Words>{`${copy.headline.split(".")[0]}.`}</Words>
            </span>
            <br />
            <Accent at={wordCount(copy.headline.split(".")[0])}>
              <span className="mk-bidi">
                {copy.headline.split(".").slice(1).join(".").trim()}
              </span>
            </Accent>
          </Display>

          <Lead style={{ marginBlockStart: 18 }}>{copy.body}</Lead>

          {copy.features?.length ? (
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                margin: "28px 0 0",
                padding: 0,
                listStyle: "none",
              }}
            >
              {copy.features.map((feature) => (
                <li
                  key={feature.term}
                  style={{ display: "flex", gap: 14, alignItems: "center" }}
                >
                  <IconTile name={feature.icon} size={36} />
                  <span className="mk-bidi" style={{ fontSize: 15 }}>
                    <b style={{ fontWeight: 500, color: INK }}>{feature.term}</b> {feature.line}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {copy.link ? (
            <div style={{ marginBlockStart: 36 }}>
              <TextLink locale={locale} href={copy.link.href}>{copy.link.label}</TextLink>
            </div>
          ) : null}
        </div>

        <div className="mk-slide-end" style={{ position: "relative" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: -40,
              background:
                "radial-gradient(50% 50% at 50% 50%,rgba(0,153,255,.16),rgba(0,153,255,0) 70%)",
              pointerEvents: "none",
            }}
          />

          {/*
           * The language switch for the picture, not for the page.
           *
           * Its label is rendered rather than hidden in `aria-label`. The
           * switch is a real control and was being read as decoration — two
           * words above it is what says the picture below answers to it, and
           * the words were already written.
           */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBlockEnd: 24,
            }}
          >
            <span
              className="mk-eyebrow mk-bidi"
              aria-hidden="true"
              style={{ color: INK_45 }}
            >
              {copy.eyebrow}
            </span>
            <div
              role="radiogroup"
              aria-label={copy.eyebrow}
              style={{
                position: "relative",
                display: "inline-grid",
                gridTemplateColumns: "1fr 1fr",
                padding: 4,
                borderRadius: 999,
                background: TRACK,
                inlineSize: 260,
              }}
            >
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
                  transform: arabic ? "none" : "translateX(var(--mk-knob))",
                }}
              />
              <LangTab label="العربية" checked={arabic} onSelect={() => setLang("ar")} />
              <LangTab
                label="English"
                latin
                checked={!arabic}
                onSelect={() => setLang("en")}
              />
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "grid",
              borderRadius: 28,
              background: PANEL,
              padding: 12,
              boxShadow: "0 0 0 1px rgba(11,11,15,.05),0 40px 80px -40px rgba(0,85,255,.35)",
            }}
          >
            <HubPanel active={arabic} locale="ar" />
            <HubPanel active={!arabic} locale="en" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LangTab({
  label,
  checked,
  latin,
  onSelect,
}: {
  label: string;
  checked: boolean;
  latin?: boolean;
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
      style={{
        position: "relative",
        blockSize: 44,
        border: 0,
        background: "transparent",
        borderRadius: 999,
        cursor: "pointer",
        fontFamily: latin ? "Inter, sans-serif" : undefined,
        fontSize: latin ? 14 : 15,
        fontWeight: 500,
        color: checked ? INK : INK_55,
        transition: "color 200ms",
      }}
    >
      {label}
    </button>
  );
}

/*
 * One brand hub, in one language.
 *
 * Both panels share the grid cell, so the inactive one is faded out and
 * removed from the tab order and the accessibility tree rather than
 * unmounted — see the note at the top. `inert` would be the right attribute
 * here; `aria-hidden` plus `pointer-events` is the part that works today in
 * every browser this site supports.
 */
function HubPanel({ active, locale }: { active: boolean; locale: "ar" | "en" }) {
  const ar = locale === "ar";

  const nav = ar
    ? ["الشعار", "الألوان", "الخطوط", "الصوت", "الأصول"]
    : ["Logo", "Colour", "Typography", "Voice", "Assets"];

  const rows = ar
    ? [
        ["المساحة الآمنة", "نصف ارتفاع الرمز"],
        ["الحد الأدنى", "120 بكسل عرضاً"],
      ]
    : [
        ["Clear space", "Half the mark’s height"],
        ["Minimum size", "120 px wide"],
      ];

  return (
    <div
      dir={ar ? "rtl" : "ltr"}
      lang={locale}
      aria-hidden={!active}
      style={{
        gridArea: "1/1",
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
        /*
         * The panel that is leaving slides toward its own reading edge, and
         * the one arriving comes in from its own.
         *
         * A plain cross-fade in place was the whole problem: the two panels
         * are the same object and the section's claim is that the *layout*
         * turns around, so dissolving one into the other showed nothing
         * turning. 22px is small enough to stay a hand-off and large enough
         * to be a direction.
         *
         * Physical px and not a logical property, deliberately: each panel
         * carries its own `dir`, and which way it leaves is the point.
         */
        translate: active ? "0" : `${ar ? 22 : -22}px`,
        transition:
          "opacity 360ms cubic-bezier(.32,.72,0,1), translate 420ms cubic-bezier(.32,.72,0,1)",
        background: "#fff",
        borderRadius: 20,
        boxShadow: RING,
        overflow: "clip",
        fontFamily: ar ? undefined : "Inter, sans-serif",
        lineHeight: ar ? undefined : 1.5,
      }}
    >
      {/* The hub's title bar. The locale is a code, never a flag. */}
      <div
        style={{
          blockSize: 52,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          boxShadow: "0 1px 0 rgba(11,11,15,.06)",
        }}
      >
        <span
          style={{ inlineSize: 22, blockSize: 22, borderRadius: 7, background: "#3B2A20" }}
        />
        <span style={{ fontSize: ar ? 15 : 14, fontWeight: 500 }}>
          {ar ? "قهوة نخلة" : "Nakhla Coffee"}
        </span>
        <span style={{ fontSize: ar ? 14 : 13, color: INK_45 }}>
          · {ar ? "مركز العلامة" : "Brand hub"}
        </span>
        <span
          dir="ltr"
          style={{
            marginInlineStart: "auto",
            blockSize: 24,
            padding: "0 8px",
            borderRadius: 6,
            background: PANEL,
            fontSize: 12,
            display: "inline-flex",
            alignItems: "center",
            color: "rgba(11,11,15,.6)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {ar ? "ar-SA" : "en-US"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)" }}>
        <div
          style={{
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: ar ? 14 : 13,
            color: "rgba(11,11,15,.6)",
            /* The sidebar's divider is on its inline-end edge, which is the
               left in Arabic and the right in English — one logical shadow
               rather than two physical ones. */
            boxShadow: "1px 0 0 rgba(11,11,15,.06)",
          }}
        >
          {nav.map((item, i) => (
            <span
              key={item}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: i === 0 ? "rgba(0,153,255,.08)" : undefined,
                color: i === 0 ? BLUE_DEEP : undefined,
                fontWeight: i === 0 ? 500 : undefined,
              }}
            >
              {item}
            </span>
          ))}
        </div>

        <div
          style={{
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minInlineSize: 0,
          }}
        >
          <div>
            <span style={{ fontSize: ar ? 13 : 12, color: INK_45 }}>{nav[0]}</span>
            {/*
             * A <div>, not an <h4>.
             *
             * This is a label inside a picture of the product, and the
             * section's own heading is an <h2> — so an <h4> here put a hole
             * in the document outline (h2 → h4) for a string that is not a
             * section of this page at all. The earlier audit fixed four of
             * these; a mock is the easiest place to reintroduce one.
             */}
            <div
              style={{
                margin: ar ? 0 : "2px 0 0",
                fontWeight: 500,
                fontSize: 22,
                lineHeight: 1.4,
                letterSpacing: ar ? undefined : "-.025em",
              }}
            >
              {ar ? "الشعار الأساسي" : "Primary logo"}
            </div>
            <p
              style={{
                margin: ar ? "2px 0 0" : "4px 0 0",
                fontSize: ar ? 14 : 13,
                lineHeight: ar ? 1.7 : 1.45,
                color: "rgba(11,11,15,.6)",
              }}
            >
              {ar
                ? "استخدمه افتراضياً، ودائماً في أول ظهور للعلامة."
                : "Use it by default, and always the first time the brand appears."}
            </p>
          </div>

          {/* The client's logo slot, and their palette. These are a
              customer's brand shown as content, which is why they are hex. */}
          <div
            style={{
              blockSize: 110,
              borderRadius: 14,
              background: `repeating-linear-gradient(${
                ar ? "45deg" : "135deg"
              },#F4EDE3 0 10px,#EFE6D9 10px 20px)`,
              display: "grid",
              placeItems: "center",
              fontSize: ar ? 13 : 12,
              color: "rgba(59,42,32,.7)",
            }}
          >
            {ar ? "شعار العميل" : "Client logo"}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["#3B2A20", "#C9A27E", "#F3EAD9"].map((swatch) => (
              <span
                key={swatch}
                style={{
                  flex: 1,
                  blockSize: 30,
                  borderRadius: 8,
                  background: swatch,
                  boxShadow:
                    swatch === "#F3EAD9" ? "inset 0 0 0 1px rgba(11,11,15,.06)" : undefined,
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: ar ? 14 : 13 }}>
            {rows.map(([label, value], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: ar ? "8px 0" : "9px 0",
                  boxShadow: i === 0 ? "0 1px 0 rgba(11,11,15,.06)" : undefined,
                }}
              >
                <span style={{ color: INK_55 }}>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
