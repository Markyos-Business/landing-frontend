import Link from "next/link";
import type { CSSProperties } from "react";
import { localeHref } from "@/lib/i18n/href";
import type { PanelProps } from "./types";

/* ── The Solutions and Platform mega menus ───────────────────────────────── */

export function MegaPanel({ id, hidden, item, locale, panelRef }: PanelProps) {
  const groups = item.groups ?? [];
  /*
   * Solutions labels its columns and Platform does not, and the difference
   * is in what the columns are rather than in how either menu should look:
   * an audience is a thing the visitor picks, a stage is not. The data says
   * which — see `grouping` in content/types.ts — because a flag in the
   * component would have to be read as "Platform is special" by everyone who
   * met it afterwards.
   */
  const labelled = item.grouping !== "stage";

  return (
    <div
      id={id}
      hidden={hidden}
      ref={panelRef}
      data-open={!hidden}
      className="mk-nav-panel"
      /* The column count decides the panel's natural width, and the panel is
         `max-content` wide, so the grid has to know it rather than discover
         it from a parent that is sizing itself to the grid. */
      style={{ "--mk-nav-cols": groups.length } as CSSProperties}
    >
      <div className="mk-nav-body">
        {/*
         * The rail: what the menu is for, and the one way in that does not
         * ask the visitor to pick a column first. Both strings are approved
         * copy used verbatim — see the note on `NavIntro` in content/types.ts.
         */}
        {item.intro ? (
          <div className="mk-nav-rail">
            <p className="mk-nav-rail-title mk-bidi">{item.intro.title}</p>
            <Link href={localeHref(locale, item.intro.more.href)} className="mk-nav-rail-link">
              <span className="mk-bidi">{item.intro.more.label}</span>
            </Link>
          </div>
        ) : null}

        {/*
         * Headings and rows, and nothing else in the panel.
         *
         * Three things were cut here by review on 5 Nov 2026, all of them
         * furniture rather than destinations: the line under each column
         * heading, the arrow on every overview link, and the strip of three
         * links along the floor. What is left is what a menu is for — where
         * you can go, and what you will find there.
         *
         * The strip's three links are still in the copy and still rendered by
         * the phone menu, which is a different surface and was not part of
         * that review. `group.line` is now rendered nowhere; see the note on
         * it in content/types.ts.
         */}
        <div className="mk-nav-cols" data-labelled={labelled}>
          {groups.map((group) => (
            <div key={group.heading}>
              {labelled ? <p className="mk-nav-group mk-bidi">{group.heading}</p> : null}

              <ul className="mk-nav-rows">
                {group.items.map((solution) => (
                  <li key={solution.title}>
                    <Link href={localeHref(locale, solution.href)} className="mk-nav-row">
                      <span className="mk-nav-row-title mk-bidi">{solution.title}</span>
                      <span className="mk-nav-row-line mk-bidi">{solution.line}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Optional since the Platform menu: its three groups are the
                  three stages a module belongs to, and a stage has no page. */}
              {group.more ? (
                <Link href={localeHref(locale, group.more.href)} className="mk-nav-more">
                  <span className="mk-bidi">{group.more.label}</span>
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
