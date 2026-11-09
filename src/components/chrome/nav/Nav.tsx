"use client";

import Link from "next/link";
import type { NavItemCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon } from "@/components/ui/Icon";
import { useNavMenus } from "./useNavMenus";
import { MegaPanel } from "./MegaPanel";
import { ListPanel } from "./ListPanel";

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

export function Nav({ items, locale }: { items: NavItemCopy[]; locale: Locale }) {
  const {
    open,
    rootRef,
    triggers,
    panels,
    baseId,
    onRootPointerEnter,
    onRootPointerLeave,
    onRootBlur,
    onLinkPointerEnter,
    onMenuPointerEnter,
    onTriggerClick,
  } = useNavMenus();

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
      onPointerEnter={onRootPointerEnter}
      onPointerLeave={onRootPointerLeave}
      onBlur={onRootBlur}
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
              onPointerEnter={onLinkPointerEnter}
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
            onPointerEnter={(event) => onMenuPointerEnter(i, event)}
          >
            <button
              type="button"
              ref={(node) => {
                triggers.current[i] = node;
              }}
              aria-expanded={isOpen}
              aria-controls={panelId}
              data-open={isOpen}
              onClick={() => onTriggerClick(i)}
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
