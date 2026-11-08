"use client";

import { useId, useRef, useState, type ReactNode } from "react";

/*
 * Pick a solution, see the product.
 *
 * ── What this replaces ───────────────────────────────────────────────────
 *
 * A three-column table on /solutions: nine solution names, a line each, and
 * who each one is for. The content was right and the object was wrong. A
 * table is for comparing things somebody has already chosen between; a
 * reader arriving at the hub has not chosen anything yet, and what they are
 * doing is the one thing a table cannot help with. Nine rows of text also
 * left the hub as the only page in this set showing nothing of the product.
 *
 * Same nine rows, as a control. The name and the audience are the tab, the
 * line and the real screen are the panel.
 *
 * ── Tabs, not a radio group ──────────────────────────────────────────────
 *
 * The homepage's two switches are radio groups, because each is one question
 * with two mutually exclusive answers — "which of these am I". This is not
 * that. These nine are not answers to a question about the reader; they are
 * nine things to look at, each with its own panel, which is what the tabs
 * pattern is for and what "tab, 3 of 9" tells a screen-reader user that
 * "radio button, 3 of 9" would not.
 *
 * Roving tabindex: one tab in the page's tab order, arrows move between
 * them and take focus with them, Home and End jump the ends.
 *
 * `ArrowRight` moves the ring to the right of the *screen*, which in a
 * mirrored list is the previous item — so on /ar it is `i - 1`. The arrow
 * follows the key under the finger rather than the reading order, which is
 * what the ARIA practices ask for and what the two switches now do as well:
 * pressing Right and watching the ring travel left is the bug all three of
 * these replaced.
 *
 * ── Why every panel is in the HTML ───────────────────────────────────────
 *
 * The trade AudienceTabs makes. All nine render on the server and eight are
 * `hidden`, so the hub is crawlable as nine solutions rather than one, and
 * with JavaScript off it is the first solution plus nine working links —
 * not a control that does nothing. `hidden` keeps the eight out of the
 * accessibility tree and out of Find-in-page while leaving them in the
 * document, and none of it reaches the client bundle: the panels are server
 * components passed in as a prop.
 */

export function SolutionExplorer({
  label,
  tabs,
  panels,
}: {
  label: string;
  /** The tab's own face: name, who it is for, and its glyph. */
  tabs: { title: string; audience: string; icon: ReactNode }[];
  /** One server-rendered panel per tab, in the same order. */
  panels: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const move = (to: number) => {
    const next = (to + tabs.length) % tabs.length;
    setActive(next);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div className="mk-explorer">
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        className="mk-explorer-list mk-seq"
      >
        {tabs.map((tab, i) => {
          const on = i === active;
          return (
            <button
              key={tab.title}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={on}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => {
                const rtl = document.dir === "rtl";
                const keys: Record<string, number> = {
                  ArrowDown: i + 1,
                  ArrowUp: i - 1,
                  ArrowRight: rtl ? i - 1 : i + 1,
                  ArrowLeft: rtl ? i + 1 : i - 1,
                  Home: 0,
                  End: tabs.length - 1,
                };
                if (event.key in keys) {
                  event.preventDefault();
                  move(keys[event.key]);
                }
              }}
              className={`mk-explorer-tab${on ? " is-active" : ""}`}
            >
              <span className="mk-explorer-tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="min-w-0">
                <span className="mk-bidi mk-explorer-tab-title">{tab.title}</span>
                <span className="mk-bidi mk-explorer-tab-who">{tab.audience}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mk-explorer-stage">
        {/* The section's one light pool, behind the panel it is about. A
            plain span rather than the `Glow` component, which lives in a
            server module this client component does not import. */}
        <span aria-hidden="true" className="mk-glow mk-center-x mk-explorer-glow" />
        {panels.map((panel, i) => (
          <div
            key={i}
            role="tabpanel"
            id={`${id}-panel-${i}`}
            aria-labelledby={`${id}-tab-${i}`}
            hidden={i !== active}
            /*
             * `tabIndex={0}` on the shown panel, which the tabs pattern asks
             * for whenever a panel holds no focusable control of its own —
             * and eight of these nine hold only a picture. Without it a
             * keyboard user tabbing off the list jumps straight past the
             * thing the list just changed.
             */
            tabIndex={i === active ? 0 : undefined}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
