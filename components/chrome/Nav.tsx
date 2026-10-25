"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NavItemCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Arrow, Icon } from "@/components/ui/Icon";

/*
 * The desktop navigation, with its two dropdowns.
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
 */

/*
 * Opening waits; closing waits longer.
 *
 * `HOVER_DELAY` stops a menu flashing open when the pointer is only crossing
 * the nav on its way somewhere else.
 *
 * `CLOSE_DELAY` is the one that matters, and it is here because without it
 * these menus could not be opened with a mouse at all. Both panels hang below
 * their trigger with a gap — 8px under Resources, 14px under Solutions, which
 * is the header's own padding — and that gap belongs to no element. Moving
 * from the trigger towards the panel therefore leaves the nav's subtree, and
 * `pointerleave` fired a close 2px into a 14px journey. The panel was gone
 * before the pointer was halfway to it.
 *
 * A delay rather than a bridging element: the Solutions panel positions
 * against the <header>, not against its trigger, so the dead space it has to
 * cross is inside the header and outside the nav — there is no single element
 * that could span it. A grace period covers that, covers the diagonal move
 * towards a far corner of the mega panel, and covers the moment of leaving
 * one trigger for another.
 */
const HOVER_DELAY_MS = 150;
const CLOSE_DELAY_MS = 220;

export function Nav({ items, locale }: { items: NavItemCopy[]; locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      className="flex items-center gap-1"
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
      {items.map((item, i) => {
        const hasMenu = Boolean(item.groups?.length || item.links?.length);
        const panelId = `${baseId}-panel-${i}`;
        const isOpen = open === i;

        if (!hasMenu) {
          return (
            <Link
              key={item.href}
              href={localeHref(locale, item.href)}
              className="mk-bidi rounded-[var(--mk-r-button)] px-3 py-2 text-[length:var(--fs-ui)] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
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
            // A list panel hangs off its own trigger, so that wrapper is the
            // containing block. A mega panel spans the header, so it must not
            // be — it positions against the <header>, which is sticky and
            // therefore already a containing block.
            className={item.links ? "relative" : undefined}
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
              onClick={() => {
                cancelHover();
                cancelClose();
                setOpen(isOpen ? null : i);
              }}
              className={
                "mk-bidi flex items-center gap-1.5 rounded-[var(--mk-r-button)] px-3 py-2 text-[length:var(--fs-ui)] font-medium transition-colors " +
                (isOpen ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]")
              }
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
             * trigger controls would measure nothing.
             */}
            {item.groups?.length ? (
              <MegaPanel id={panelId} hidden={!isOpen} item={item} locale={locale} />
            ) : (
              <ListPanel id={panelId} hidden={!isOpen} item={item} locale={locale} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── The Solutions mega menu ─────────────────────────────────────────────── */

function MegaPanel({
  id,
  hidden,
  item,
  locale,
}: {
  id: string;
  hidden: boolean;
  item: NavItemCopy;
  locale: Locale;
}) {
  return (
    <div
      id={id}
      hidden={hidden}
      /*
       * Capped at the viewport, and scrollable past that.
       *
       * The panel is absolutely positioned inside a sticky header, so it
       * travels with the header rather than with the page: anything taller
       * than the viewport is not just below the fold, it is unreachable. That
       * is exactly what happened between 768px and 1024px, where the columns
       * stack and the panel ran to 1190px on an 800px screen. It would also
       * happen on any short window.
       */
      className="absolute start-0 end-0 top-full max-h-[calc(100vh-3.5rem)] overflow-y-auto overscroll-contain"
    >
      {/*
       * A panel, not a slab.
       *
       * This used to paint the canvas edge-to-edge with a rule above and
       * below, which made opening a menu look like the page had grown a
       * second header — there was nothing to tell you the thing was
       * temporary. The design system's overlay is a #111 panel at 15px with
       * the raised shadow (§7, §10), and that reads as something laid on top
       * of the page, which is what it is.
       *
       * The positioning stays on the wrapper above, so the panel still
       * measures itself against the sticky header and still caps at the
       * viewport — the reason that wrapper exists.
       */}
      <div className="mk-container pb-5 pt-2">
        <div className="rounded-[var(--mk-r-ui)] bg-[var(--surface-0)] p-7 shadow-[var(--mk-shadow-raised)]">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {item.groups?.map((group, i) => (
            <div
              key={group.heading}
              className={i ? "lg:border-s lg:border-[var(--hairline)] lg:ps-10" : undefined}
            >
              <p className="mk-bidi text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
                {group.heading}
              </p>
              <p className="mk-bidi mt-1 text-[length:var(--fs-eyebrow)] leading-[1.5] text-[var(--text-muted)]">
                {group.line}
              </p>

              <ul className="mt-5 space-y-1">
                {group.items.map((solution) => (
                  <li key={solution.title}>
                    <Link
                      href={localeHref(locale, solution.href)}
                      className="block rounded-[var(--mk-r-button)] px-3 py-2 transition-colors hover:bg-[var(--surface-3)]"
                    >
                      <span className="mk-bidi block text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
                        {solution.title}
                      </span>
                      <span className="mk-bidi mt-0.5 block text-[length:var(--fs-eyebrow)] leading-[1.45] text-[var(--text-muted)]">
                        {solution.line}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={localeHref(locale, group.more.href)}
                className="mt-4 inline-flex items-center gap-1.5 px-3 text-[length:var(--fs-eyebrow)] font-medium text-[var(--accent-text)] hover:underline"
              >
                <span className="mk-bidi">{group.more.label}</span>
                <Arrow size={13} />
              </Link>
            </div>
          ))}
        </div>

        {item.strip?.length ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[var(--hairline)] pt-5">
            {item.strip.map((link, i) => (
              <Link
                key={link.href}
                href={localeHref(locale, link.href)}
                className={
                  "inline-flex items-center gap-1.5 text-[length:var(--fs-eyebrow)] hover:underline " +
                  // The first strip item is a claim, not a signpost, so it is
                  // set as one — no arrow, and in the page's own ink.
                  (i === 0
                    ? "font-medium text-[var(--text)]"
                    : "font-medium text-[var(--text-muted)]")
                }
              >
                <span className="mk-bidi">{link.label}</span>
                {i === 0 ? null : <Arrow size={12} />}
              </Link>
            ))}
          </div>
        ) : null}
        </div>
      </div>
    </div>
  );
}

/* ── A plain list dropdown ───────────────────────────────────────────────── */

function ListPanel({
  id,
  hidden,
  item,
  locale,
}: {
  id: string;
  hidden: boolean;
  item: NavItemCopy;
  locale: Locale;
}) {
  return (
    <div
      id={id}
      hidden={hidden}
      className="mk-card absolute top-full mt-2 min-w-[12rem] p-2 shadow-[var(--mk-shadow-raised)]"
    >
      <ul>
        {item.links?.map((link) => (
          <li key={link.href}>
            <Link
              href={localeHref(locale, link.href)}
              className="mk-bidi block rounded-[var(--radius-widget)] px-3 py-2 text-[length:var(--fs-ui)] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
