"use client";

import type { Locale } from "@/lib/i18n/locales";
import { Words } from "@/components/ui/Words";
import { useId, useState } from "react";
import type { ModuleCopy, PlatformGridCopy, SiteCopy } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import {
  TextLink,
  BLUE_DEEP,
  INK,
  INK_45,
  INK_50,
  INK_55,
  INK_62,
  Lead,
  LIFT_BLUE,
  PANEL,
  RING,
  Display,
} from "./landing";

/*
 * Everything a brand needs, and what is inside each part.
 *
 * ── Why this is a tab list and not nine cards ────────────────────────────
 *
 * Nine modules with six or seven sub-features each is around sixty lines of
 * copy. As nine open cards that is a wall nobody reads and a section four
 * screens tall; as a list of nine names with one open panel it is a reader
 * choosing which of the nine they came for. The design file picks the second,
 * and groups the names under the three stage headings so the shape of the
 * product — create, hand over, manage — is visible before anything is opened.
 *
 * ── Which means it is a real tab list ────────────────────────────────────
 *
 * Nine buttons that swap one panel is the `tablist` pattern, so it is built
 * as one: roles, `aria-selected`, `aria-controls`, and arrow-key navigation
 * between the tabs. A row of divs with click handlers would look identical
 * and be unusable from a keyboard, which for the section carrying the whole
 * feature list is not a small loss.
 *
 * The stage headings sit inside the tab list as plain text. They are not
 * tabs and must not be focus stops, which is why they are `<span>`s and why
 * the arrow-key handler walks the module array rather than the DOM.
 */

export function PlatformGrid({
  copy,
  chips, locale }: {
  locale: Locale;
  copy: PlatformGridCopy;
  chips: SiteCopy["chips"];
}) {
  const modules = copy.modules ?? [];
  const [open, setOpen] = useState(0);
  const base = useId();

  /*
   * Arrow keys move between tabs, as the pattern requires, and wrap at both
   * ends. Home and End jump to the first and last module — with nine of them
   * that is the difference between one key and eight.
   */
  function onKeyDown(event: React.KeyboardEvent) {
    const last = modules.length - 1;
    const next = {
      ArrowDown: open === last ? 0 : open + 1,
      ArrowUp: open === 0 ? last : open - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (next === undefined) return;
    event.preventDefault();
    setOpen(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  }

  if (!modules.length) return null;
  const active = modules[open];

  return (
    <section
      id="modules"
      aria-labelledby="modules-heading"
      style={{
        position: "relative",
        padding: "clamp(72px,10vw,120px) 24px",
        background: "#fff",
        boxShadow: "0 0 0 1px rgba(11,11,15,.04)",
      }}
    >
      <div className="mk-seq" style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBlockEnd: 48,
          }}
        >
          <Display id="modules-heading">
            <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
          </Display>
          {copy.subheadline ? (
            <Lead style={{ marginBlockStart: 14, maxWidth: 560, lineHeight: 1.75 }}>
              {copy.subheadline}
            </Lead>
          ) : null}
        </div>

        <div
          className="mk-rise-soft"
          style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}
        >
          {/* The nine names, under their three stages. */}
          <div
            className="mk-slide-start"
            role="tablist"
            aria-orientation="vertical"
            aria-label={copy.headline}
            onKeyDown={onKeyDown}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: 12,
              borderRadius: 26,
              background: PANEL,
              flex: "1 1 280px",
              minInlineSize: 0,
            }}
          >
            {modules.map((module, i) => (
              <ModuleTab
                key={module.n}
                base={base}
                index={i}
                module={module}
                selected={i === open}
                stageLabel={stageHeading(copy, modules, i)}
                onSelect={() => setOpen(i)}
              />
            ))}
          </div>

          {/* The open module. */}
          <div
            className="mk-slide-end"
            role="tabpanel"
            id={`${base}-panel`}
            aria-labelledby={`${base}-tab-${open}`}
            tabIndex={0}
            style={{
              flex: "999 1 480px",
              minInlineSize: 0,
              position: "relative",
              borderRadius: 28,
              background: "#fff",
              boxShadow: LIFT_BLUE,
              padding: "clamp(24px,3.4vw,40px)",
              overflow: "clip",
            }}
          >
            {/* The panel's own light, in its leading corner. */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                insetInlineStart: -120,
                top: -160,
                inlineSize: 420,
                blockSize: 420,
                borderRadius: "50%",
                background:
                  "radial-gradient(closest-side,rgba(0,153,255,.12),rgba(0,153,255,0))",
                pointerEvents: "none",
              }}
            />

            {/*
             * Picking a module is the one real interaction on this page, and
             * until now it was the one that produced no motion: the panel
             * swapped its text in place. `key={open}` remounts this subtree on
             * every selection, which restarts the clock-driven cascade on it —
             * so the stage, the name, what it replaces, the promise, the
             * sub-features and the link arrive one after another, the way the
             * section's own children do when you scroll to it.
             *
             * Clock-driven and not scroll-driven, for the reason `.mk-load`
             * exists at all: the panel is already in view when you click, so a
             * `view()` range is complete before the new content exists.
             */}
            <div key={open} className="mk-seq-load" style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "8px 14px",
                  fontSize: 13,
                  color: INK_55,
                }}
              >
                <span className="mk-bidi">{stageName(copy, active.stage)}</span>
                <span
                  aria-hidden="true"
                  style={{
                    inlineSize: 4,
                    blockSize: 4,
                    borderRadius: "50%",
                    background: "rgba(11,11,15,.25)",
                  }}
                />
                <span className="mk-bidi">
                  {copy.moduleLabel} {active.n}
                </span>
              </div>

              <h3
                className="mk-bidi"
                style={{
                  margin: "10px 0 0",
                  fontWeight: 500,
                  fontSize: "clamp(26px,3vw,36px)",
                  lineHeight: 1.3,
                }}
              >
                {active.name}
              </h3>

              <span
                className="mk-bidi"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginBlockStart: 12,
                  blockSize: 30,
                  paddingInline: 12,
                  borderRadius: 999,
                  background: PANEL,
                  fontSize: 13,
                  color: INK_62,
                }}
              >
                <Icon name="exchange" size={15} />
                {copy.replacesLabel} {active.replaces}
              </span>

              {/* The module's whole pitch, and the only blue line in it. */}
              <p
                className="mk-bidi"
                style={{
                  margin: "22px 0 0",
                  fontSize: "clamp(19px,2vw,23px)",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  color: BLUE_DEEP,
                  textWrap: "pretty",
                }}
              >
                {active.promise}
              </p>

              <ul
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
                  gap: "4px 28px",
                  marginBlockStart: 24,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {active.feats.map((feat) => (
                  <li
                    key={feat.name}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "14px 0",
                      boxShadow: "0 -1px 0 rgba(11,11,15,.06)",
                    }}
                  >
                    <Icon
                      name={feat.chip ? "plus" : "check"}
                      size={18}
                      style={{
                        flex: "none",
                        marginBlockStart: 4,
                        color: feat.chip ? INK_45 : BLUE_DEEP,
                      }}
                    />
                    <div style={{ minInlineSize: 0 }}>
                      {feat.chip ? (
                        <div style={{ marginBlockEnd: 4 }}>
                          <Chip feature={feat.chip} chips={chips} />
                        </div>
                      ) : null}
                      <div className="mk-bidi" style={{ fontSize: 15, fontWeight: 500 }}>
                        {feat.name}
                      </div>
                      <div
                        className="mk-bidi"
                        style={{ fontSize: 14, lineHeight: 1.75, color: INK_62 }}
                      >
                        {feat.line}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* One link per feature page. Module 8 has two of them: brand
                  voice and the tone checker are one module here and two
                  pages under /platform. */}
              {active.link || active.link2 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 24px",
                    marginBlockStart: 20,
                  }}
                >
                  {active.link ? (
                    <TextLink locale={locale} href={active.link.href}>{active.link.label}</TextLink>
                  ) : null}
                  {active.link2 ? (
                    <TextLink locale={locale} href={active.link2.href}>{active.link2.label}</TextLink>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The stage heading, printed only above the first module of each stage. */
function stageHeading(copy: PlatformGridCopy, modules: ModuleCopy[], i: number) {
  const stage = modules[i].stage;
  if (i > 0 && modules[i - 1].stage === stage) return null;
  return stageName(copy, stage);
}

function stageName(copy: PlatformGridCopy, stage: ModuleCopy["stage"]) {
  return copy.stageLabels?.[stage] ?? "";
}

function ModuleTab({
  base,
  index,
  module,
  selected,
  stageLabel,
  onSelect,
}: {
  base: string;
  index: number;
  module: ModuleCopy;
  selected: boolean;
  stageLabel: string | null;
  onSelect: () => void;
}) {
  return (
    <>
      {stageLabel ? (
        <span
          className="mk-bidi"
          style={{ padding: "14px 12px 6px", fontSize: 13, color: INK_50 }}
        >
          {stageLabel}
        </span>
      ) : null}
      <button
        type="button"
        role="tab"
        id={`${base}-tab-${index}`}
        aria-selected={selected}
        aria-controls={`${base}-panel`}
        /* Only the selected tab is a tab stop; the arrow keys move between
           them from there. That is the pattern, and with nine of them it is
           also the difference between one Tab and nine. */
        tabIndex={selected ? 0 : -1}
        onClick={onSelect}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          inlineSize: "100%",
          minBlockSize: 52,
          padding: "8px 12px",
          border: 0,
          borderRadius: 16,
          cursor: "pointer",
          textAlign: "start",
          background: selected ? "#fff" : "transparent",
          boxShadow: selected ? RING : "none",
          transition: "background 200ms, box-shadow 200ms",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            flex: "none",
            inlineSize: 34,
            blockSize: 34,
            borderRadius: 10,
            background: selected ? "rgba(0,153,255,.1)" : "rgba(11,11,15,.04)",
            display: "grid",
            placeItems: "center",
            transition: "background 200ms",
          }}
        >
          <Icon name={module.icon} size={18} style={{ color: selected ? BLUE_DEEP : INK_55 }} />
        </span>
        <span
          className="mk-bidi"
          style={{ flex: 1, fontSize: 15, fontWeight: 500, color: selected ? INK : INK_62 }}
        >
          {module.name}
        </span>
        {/* The design file sets this at 40% ink, which measures 2.66:1 at
            12px. It is a visible ordinal, not decoration, so it takes the
            accessible grey. */}
        <span style={{ fontSize: 12, color: INK_45 }}>{module.n}</span>
      </button>
    </>
  );
}
