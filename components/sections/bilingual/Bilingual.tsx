"use client";

import { Words, wordCount } from "@/components/ui/Words";
import { useState } from "react";
import type { BilingualCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { Accent, TextLink, Display, INK, INK_45, IconTile, Lead, PANEL, TRACK } from "../landing";
import { LangTab } from "./LangTab";
import { HubPanel } from "./HubPanel";

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
