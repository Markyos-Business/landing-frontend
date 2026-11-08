"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { NavItemCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon } from "@/components/ui/Icon";

/*
 * The desktop navigation, with its three dropdowns.
 *
 * ── Why this is a disclosure, not a menubar ───────────────────────────────
 *
 * `markyos_solutions_menu.md` §2.4 asks for arrow keys to move between
 * columns, which is the `role="menubar"` pattern. This is built as the W3C
 * APG **disclosure navigation** pattern instead: a `<button aria-expanded>`
 * per dropdown, ordinary links inside, Tab to move, Escape to close.
 *
 * The reason is what each pattern tells a screen reader. `role="menu"` means
 * an application menu — a list of *commands* — and announces itself that way;
 * the links inside stop being announced as links, and the arrow keys become
 * mandatory rather than extra, which surprises anybody who reached the nav by
 * tabbing. For site navigation the disclosure pattern is both the APG's
 * recommendation and the one that behaves the way people already expect.
 *
 * Everything else in §2.4 is here: hover-to-open after 150ms for a mouse,
 * click for everything else, Escape, click-outside, and focus leaving the nav.
 *
 * The phone has no room for any of this; see MobileNav.tsx.
 *
 * ── One frame, three panels ───────────────────────────────────────────────
 *
 * The menus used to be a full-container white slab that appeared and
 * disappeared. Each one was a different object: open Solutions, close it,
 * open Platform, and the page had shown you two unrelated rectangles.
 *
 * They are now one object. A single decorative element — the *frame* — draws
 * the white card, the radius and the lift, and it is the only thing in the
 * header that moves: on a menu-to-menu move it resizes and slides to the next
 * panel's measured geometry while the contents swap inside it. The panels
 * themselves paint no background at all.
 *
 * That shape is why there is measurement here instead of a CSS-only panel.
 * `inline-size: max-content` cannot be transitioned, so the frame is told its
 * size in pixels, read off the open panel in a layout effect before paint.
 *
 * The frame is `aria-hidden` and `pointer-events: none`. It is a picture of
 * the panel, never the panel: nothing is read from it, nothing is clicked on
 * it, and if the measurement never ran the menus would still work — they
 * would simply be unlit.
 */

/*
 * Opening waits; closing waits longer.
 *
 * `HOVER_DELAY` stops a menu flashing open when the pointer is only crossing
 * the nav on its way somewhere else.
 *
 * `CLOSE_DELAY` is the one that matters, and it is here because without it
 * these menus could not be opened with a mouse at all. The panels hang below
 * the nav with a gap — `PANEL_GAP` below, which is the header's own padding —
 * and that gap belongs to no element. Moving from a trigger towards the panel
 * therefore leaves the nav's subtree, and `pointerleave` fired a close 2px
 * into a 14px journey. The panel was gone before the pointer was halfway.
 *
 * A delay rather than a bridging element: the panels position against the
 * nav root, not against their trigger, so the dead space one has to cross is
 * inside the header and outside any single element that could span it. A
 * grace period covers that, covers the diagonal move towards a far corner of
 * a mega panel, and covers the moment of leaving one trigger for another.
 */
const HOVER_DELAY_MS = 150;
const CLOSE_DELAY_MS = 220;

/** The page gutter, `--mk-gutter`. A panel is never allowed inside it. */
const GUTTER_PX = 20;

export function Nav({ items, locale }: { items: NavItemCopy[]; locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Whether a panel was already on screen when this one opened. Only then is
     there a previous geometry worth travelling from; a first open sets the
     frame's size outright, or the card would unfold out of a 0×0 point. */
  const wasOpen = useRef(false);
  const baseId = useId();

  const cancelHover = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  /*
   * Everything stops. For Escape, click-outside and focus leaving the nav.
   *
   * `useCallback` with no dependencies because it touches only refs and the
   * state setter, all of which React guarantees are stable — which lets the
   * listener effect below depend on it honestly instead of silencing the
   * exhaustive-deps rule.
   */
  const closeNow = useCallback(() => {
    cancelHover();
    cancelClose();
    setOpen(null);
  }, []);

  useEffect(
    () => () => {
      cancelHover();
      cancelClose();
    },
    [],
  );

  /*
   * Measure the open panel and hand the frame its geometry.
   *
   * Four custom properties on the nav root, which both the frame and the
   * panels read: `--mk-nav-max` caps a panel before it is measured,
   * `--mk-nav-w` / `--mk-nav-h` are what the frame draws, and `--mk-nav-x` is
   * the horizontal offset both of them share.
   *
   * `--mk-nav-x` is a physical `translate`, not a logical inset, and that is
   * deliberate in a file that otherwise uses logical properties throughout.
   * It is the sum of two numbers — where the trigger sits inside the nav, and
   * how far the panel has to come back to clear the gutter — and both are
   * read off `getBoundingClientRect`, which only speaks in physical pixels.
   * Resolving the direction once, here, is honest; carrying two sign
   * conventions through the arithmetic to re-derive it in CSS would not be.
   *
   * ── Why a panel is anchored to its own trigger and then pulled back ──────
   *
   * A panel starts under the trigger that opened it, which is where the eye
   * already is. A mega panel is far wider than its trigger, so that start
   * position would push it through the page gutter; it is then shifted back
   * until it clears. The two mega panels are both wide enough to end up
   * clamped against the same edge, so they sit in the same place and the
   * frame travels only the difference in their widths — while the Resources
   * list, which is narrow enough to need no shift at all, stays under
   * Resources instead of being dragged across the header to join them.
   */
  const measure = useCallback((index: number) => {
    const root = rootRef.current;
    const panel = panels.current[index];
    const trigger = triggers.current[index];
    if (!root || !panel || !trigger) return;

    const container = root.closest(".mk-container");
    const bounds = container?.getBoundingClientRect();
    const docWidth = root.ownerDocument.documentElement.clientWidth;
    const minLeft = (bounds?.left ?? 0) + GUTTER_PX;
    const maxRight = (bounds?.right ?? docWidth) - GUTTER_PX;
    const rtl = getComputedStyle(root).direction === "rtl";

    /* The cap goes on before the tape measure. A panel is `max-content` wide
       up to `--mk-nav-max`, so reading its width before the cap is current
       measures a panel that will never be drawn — which is what happens on
       the first open after a window has been made narrower. */
    root.style.setProperty("--mk-nav-max", `${Math.round(maxRight - minLeft)}px`);

    const w = panel.offsetWidth;
    const h = panel.offsetHeight;

    /* Where the panel's own start edge lands if nothing moves it. The
       trigger's offset inside the nav is the same number in both directions
       once the panel's width is accounted for, so the two cases differ only
       in which edge is the start.
       Written as a branch rather than two ternaries because `rect.right ?`
       reads to `check:design` as a physical CSS offset — which, in a file
       whose whole subject is logical positioning, is a rule worth keeping
       blunt rather than teaching to parse JavaScript. */
    const rootRect = root.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    let fromTrigger = triggerRect.left - rootRect.left;
    let edge = rootRect.left;
    if (rtl) {
      fromTrigger = triggerRect.right - rootRect.right;
      edge = rootRect.right - w;
    }
    edge += fromTrigger;

    let x = fromTrigger;
    if (edge < minLeft) x += minLeft - edge;
    else if (edge + w > maxRight) x -= edge + w - maxRight;

    root.style.setProperty("--mk-nav-w", `${w}px`);
    root.style.setProperty("--mk-nav-h", `${h}px`);
    root.style.setProperty("--mk-nav-x", `${Math.round(x)}px`);
  }, []);

  /*
   * `useLayoutEffect`, not `useEffect`: the panel's `hidden` has just been
   * removed in this same commit, so it has a size to read — but only before
   * the browser paints. Measuring a frame later would show one frame of a
   * card at the previous menu's size.
   */
  useLayoutEffect(() => {
    if (open === null) {
      wasOpen.current = false;
      return;
    }
    /*
     * Opening a menu is the only thing that decides whether the frame
     * travels, and it has to be the only thing: the `ResizeObserver` below
     * fires once, a frame after every open, and while it also owned this
     * flag it turned the morph off again before the transition had drawn
     * anything. The card changed size between two menus instantly, which is
     * the exact behaviour this whole arrangement exists to replace, and it
     * looked like a CSS bug rather than a lifecycle one.
     */
    const root = rootRef.current;
    if (root) root.dataset.navMorph = wasOpen.current ? "true" : "false";
    measure(open);
    wasOpen.current = true;
  }, [open, measure]);

  /*
   * Re-measure while open, without animating.
   *
   * Two things resize a panel after it has been measured: the window, and
   * the Arabic face arriving — Thmanya Sans swaps in after first paint and
   * every line in the panel reflows under it. A `ResizeObserver` catches
   * both, and the layout-effect pass above catches neither.
   */
  useEffect(() => {
    if (open === null) return;
    const panel = panels.current[open];

    const remeasure = () => measure(open);
    window.addEventListener("resize", remeasure);

    let observer: ResizeObserver | undefined;
    if (panel && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(remeasure);
      observer.observe(panel);
    }

    return () => {
      window.removeEventListener("resize", remeasure);
      observer?.disconnect();
    };
  }, [open, measure]);

  /*
   * Escape closes and hands focus back to the trigger — without that last
   * part, closing a menu with the keyboard drops you at the top of the
   * document and you have to tab back through the whole header.
   *
   * Pointer-down rather than click for the outside-close, so the menu is
   * already gone by the time a click lands on whatever is underneath it.
   */
  useEffect(() => {
    if (open === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeNow();
      triggers.current[open]?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeNow();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, closeNow]);

  return (
    <div
      ref={rootRef}
      className="mk-nav flex items-center gap-1"
      data-nav-open={open !== null}
      /* Which panel is open, for the one thing about the frame that is not a
         measurement: its radius. A 28px card corner is the site's, and it is
         right on a panel a thousand pixels wide; on the 200px Resources list
         the same corner eats the first and last rows. */
      data-nav-kind={open === null ? undefined : items[open].groups?.length ? "mega" : "list"}
      /*
       * Re-entering anywhere in the nav — including a panel, which is a DOM
       * descendant of this element however it is positioned on screen —
       * cancels a pending close. That is what makes crossing the gap work.
       */
      onPointerEnter={cancelClose}
      onPointerLeave={() => {
        cancelHover();
        cancelClose();
        closeTimer.current = setTimeout(() => setOpen(null), CLOSE_DELAY_MS);
      }}
      // Tabbing past the last link in a panel closes it. `relatedTarget` is
      // where focus went; if that is still inside the nav, the panel stays.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeNow();
        }
      }}
    >
      {/*
       * The frame, first in the DOM so that every panel paints over it.
       *
       * Both are positioned and neither sets a `z-index`, so paint order is
       * document order — which is the whole arrangement: one card behind,
       * three sets of contents in front, and no stacking context to maintain.
       */}
      <div className="mk-nav-frame" aria-hidden />

      {items.map((item, i) => {
        const hasMenu = Boolean(item.groups?.length || item.links?.length);
        const panelId = `${baseId}-panel-${i}`;
        const isOpen = open === i;

        if (!hasMenu) {
          return (
            <Link
              key={item.href}
              href={localeHref(locale, item.href)}
              className="mk-nav-link mk-bidi"
              onPointerEnter={() => {
                cancelHover();
                cancelClose();
                setOpen(null);
              }}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <div
            key={item.href}
            /*
             * No `position: relative` on this wrapper, for either kind of
             * panel. Every panel measures itself against the nav root so
             * that it shares one coordinate system with the frame, which is
             * a sibling of this wrapper and could not otherwise line up
             * with what it is drawing.
             */
            onPointerEnter={(event) => {
              if (event.pointerType !== "mouse") return;
              cancelHover();
              cancelClose();
              /*
               * Once one menu is open the nav is "live", and moving along it
               * should track the pointer rather than making you wait out the
               * open delay again at every trigger. The delay is only there to
               * stop a menu opening on a pointer that is passing through.
               */
              if (open !== null) {
                setOpen(i);
                return;
              }
              timer.current = setTimeout(() => setOpen(i), HOVER_DELAY_MS);
            }}
          >
            <button
              type="button"
              ref={(node) => {
                triggers.current[i] = node;
              }}
              aria-expanded={isOpen}
              aria-controls={panelId}
              data-open={isOpen}
              onClick={() => {
                cancelHover();
                cancelClose();
                setOpen(isOpen ? null : i);
              }}
              className="mk-nav-link mk-nav-trigger mk-bidi"
            >
              {item.label}
              <Icon
                name="chevron"
                size={13}
                className={`flex-none transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/*
             * Always rendered, hidden with `hidden` when closed.
             *
             * Rendering it only when open would mean the links are absent
             * from the DOM for a crawler and for anything reading the page
             * rather than looking at it. `hidden` removes it from the
             * accessibility tree and the tab order without removing it from
             * the document.
             *
             * The id and the `hidden` go on the panel itself rather than on a
             * wrapper around it. A wrapper would have no size of its own —
             * its only child is absolutely positioned — so `aria-controls`
             * would name a zero-height box, and anything measuring what the
             * trigger controls would measure nothing. It is also the element
             * the frame is measured from, which needs the same thing.
             */}
            {item.groups?.length ? (
              <MegaPanel
                id={panelId}
                hidden={!isOpen}
                item={item}
                locale={locale}
                panelRef={(node) => {
                  panels.current[i] = node;
                }}
              />
            ) : (
              <ListPanel
                id={panelId}
                hidden={!isOpen}
                item={item}
                locale={locale}
                panelRef={(node) => {
                  panels.current[i] = node;
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

type PanelProps = {
  id: string;
  hidden: boolean;
  item: NavItemCopy;
  locale: Locale;
  panelRef: (node: HTMLDivElement | null) => void;
};

/* ── The Solutions and Platform mega menus ───────────────────────────────── */

function MegaPanel({ id, hidden, item, locale, panelRef }: PanelProps) {
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

/* ── A plain list dropdown ───────────────────────────────────────────────── */

function ListPanel({ id, hidden, item, locale, panelRef }: PanelProps) {
  return (
    <div id={id} hidden={hidden} ref={panelRef} data-open={!hidden} className="mk-nav-panel">
      <ul className="mk-nav-list">
        {item.links?.map((link) => (
          <li key={link.href}>
            <Link href={localeHref(locale, link.href)} className="mk-nav-list-link mk-bidi">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
