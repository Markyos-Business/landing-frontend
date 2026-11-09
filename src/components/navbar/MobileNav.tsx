"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { NavCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Icon, Spark } from "@/components/ui";
import { LangSwitch } from "./LangSwitch";

/*
 * The navigation, on a phone.
 *
 * This exists now because the header stopped being five flat links. Until
 * the Solutions menu landed, hiding the nav below 48rem and keeping the CTA
 * was a defensible minimum — every nav destination was also in the footer.
 * It is not defensible once twelve solution pages and three audience pages
 * are only reachable through a dropdown: that would be a site whose entire
 * information architecture is desktop-only.
 *
 * Built from native `<details>` rather than from more state. The accordions
 * then open and close before any JavaScript arrives, the browser handles the
 * keyboard, and the only thing React is responsible for is the panel itself.
 *
 * Nested one level deep, as the menu spec asks: Solutions opens to three
 * audiences, each closed, each holding its four solutions. Fifteen links
 * unfolded at once is a scroll nobody reads.
 */

export function MobileNav({ copy, locale }: { copy: NavCopy; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [panelTop, setPanelTop] = useState<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  /*
   * Where the panel's top edge goes.
   *
   * It used to be `top-14` — a hard-coded 56px, commented as "the header's
   * own height". The header is 64px, and an announcement bar sits above it,
   * so on an unscrolled page the header's real bottom edge is around 156px.
   * The panel was starting 100px too high and covering the header, including
   * the button that closes it. Opening the menu on a phone was a trap: the
   * Escape handler below is no help without a keyboard, and the only way out
   * was to follow a link to somewhere you had not asked to go.
   *
   * Measured rather than named, because the number depends on whether the
   * announcement bar is showing and on how far the page has scrolled when
   * the menu opens. Reading it once per opening is enough: the effect below
   * locks body scroll, so the header cannot move while the panel is up.
   */
  useEffect(() => {
    if (!open) return;
    const header = toggleRef.current?.closest("header");
    if (header) setPanelTop(Math.round(header.getBoundingClientRect().bottom));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    // The panel scrolls on its own; letting the page scroll behind it means
    // closing the menu leaves you somewhere you did not choose to be.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        /*
         * `relative z-50` keeps this button above the panel it opens.
         *
         * MobileNav renders inside the header, so the panel is this button's
         * own sibling. The panel is positioned and this button was not, which
         * put the panel in front of it whatever their top edges did. Belt as
         * well as braces: the measured top above should already keep them
         * apart, but a button that closes a panel must never be underneath
         * it, and a rounding error should not be able to re-trap anyone.
         *
         * 44px on a coarse pointer, per §10. 36px clears the 24px WCAG
         * minimum but is small for the one control that dismisses a
         * full-screen overlay.
         */
        className="relative z-50 -me-1 grid size-9 place-items-center rounded-[var(--mk-r-button)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)] [@media(pointer:coarse)]:size-11 lg:hidden"
      >
        <Icon name={open ? "close" : "menu"} size={20} label={copy.menuLabel} />
      </button>

      <div
        id={panelId}
        hidden={!open}
        /*
         * The top edge is measured — see the effect above. The class is the
         * fallback for the first paint, before the measurement lands: the
         * header's own token, which is at least the right number when the
         * announcement bar is absent.
         */
        style={panelTop === null ? undefined : { insetBlockStart: `${panelTop}px` }}
        className="fixed inset-x-0 bottom-0 top-[var(--mk-header-h)] z-40 overflow-y-auto overscroll-contain border-t border-[var(--hairline)] bg-[var(--canvas)] lg:hidden"
        /*
         * Following a link closes the panel.
         *
         * These are client-side transitions, so the panel would otherwise
         * stay open over the page it just took you to. Keyed off the click
         * rather than off a pathname change, because the two are not the same
         * thing: a link to an anchor on the page you are already on changes
         * no path, and it still has to close the menu. The `closest("a")`
         * test is what keeps a tap on a `<summary>` from closing it.
         */
        onClick={(event) => {
          if ((event.target as Element).closest("a")) setOpen(false);
        }}
      >
        <nav aria-label="Main" className="mk-container py-6">
          <ul className="divide-y divide-[var(--hairline)]">
            {copy.items.map((item) => {
              const hasMenu = Boolean(item.groups?.length || item.links?.length);

              if (!hasMenu) {
                return (
                  <li key={item.href}>
                    <Link
                      href={localeHref(locale, item.href)}
                      className="mk-bidi block py-4 text-[0.9375rem] font-medium text-[var(--text)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4">
                      <span className="mk-bidi text-[0.9375rem] font-medium text-[var(--text)]">
                        {item.label}
                      </span>
                      <Icon
                        name="chevron"
                        size={16}
                        className="flex-none text-[var(--text-muted)] transition-transform group-open:rotate-180"
                      />
                    </summary>

                    <div className="pb-4">
                      {/*
                       * The desktop rail's way in, which on a phone is just a
                       * link — there is no room for the claim above it, and a
                       * 22px line of display type at the top of an accordion
                       * would read as a second heading for the item that is
                       * already open.
                       *
                       * It is here and not only on the desktop because the
                       * Platform menu's overview link lives in `intro` now
                       * rather than in `strip`. Without this the phone menu
                       * would have nine modules under «المنصة» and no way to
                       * reach /platform itself.
                       */}
                      {item.intro ? (
                        <Link
                          href={localeHref(locale, item.intro.more.href)}
                          className="inline-flex items-center gap-1.5 pb-3 text-[0.75rem] font-medium text-[var(--accent-text)]"
                        >
                          <span className="mk-bidi">{item.intro.more.label}</span>
                        </Link>
                      ) : null}

                      {item.groups?.map((group) => (
                        <details key={group.heading} className="group/g border-t border-[var(--hairline)]">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3">
                            <span className="mk-bidi text-[length:var(--fs-ui)] font-medium text-[var(--text-muted)]">
                              {group.heading}
                            </span>
                            <Icon
                              name="chevron"
                              size={14}
                              className="flex-none text-[var(--text-muted)] transition-transform group-open/g:rotate-180"
                            />
                          </summary>

                          <ul className="pb-3">
                            {group.items.map((solution) => (
                              <li key={solution.title}>
                                <Link
                                  href={localeHref(locale, solution.href)}
                                  className="mk-bidi block py-2 text-[length:var(--fs-ui)] text-[var(--text)]"
                                >
                                  {solution.title}
                                </Link>
                              </li>
                            ))}
                            {group.more ? (
                              <li>
                                <Link
                                  href={localeHref(locale, group.more.href)}
                                  className="inline-flex items-center gap-1.5 py-2 text-[0.75rem] font-medium text-[var(--accent-text)]"
                                >
                                  <span className="mk-bidi">{group.more.label}</span>
                                </Link>
                              </li>
                            ) : null}
                          </ul>
                        </details>
                      ))}

                      {item.links?.length ? (
                        <ul className="border-t border-[var(--hairline)] pt-2">
                          {item.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={localeHref(locale, link.href)}
                                className="mk-bidi block py-2 text-[length:var(--fs-ui)] text-[var(--text-muted)]"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {item.strip?.length ? (
                        <ul className="mt-2 space-y-2 border-t border-[var(--hairline)] pt-4">
                          {item.strip.map((link, i) => (
                            <li key={link.href}>
                              <Link
                                href={localeHref(locale, link.href)}
                                className={
                                  "inline-flex items-center gap-1.5 text-[0.75rem] " +
                                  (i === 0
                                    ? "font-medium text-[var(--text)]"
                                    : "font-medium text-[var(--text-muted)]")
                                }
                              >
                                <span className="mk-bidi">{link.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </details>
                </li>
              );
            })}

            <li>
              <Link
                href="/login"
                prefetch={false}
                className="mk-bidi block py-4 text-[0.9375rem] font-medium text-[var(--text)]"
              >
                {copy.login}
              </Link>
            </li>

            {/*
             * The language, in the menu.
             *
             * It was only ever in the header bar, which is fine until the bar
             * runs out of room: at 352px and below the English header laid the
             * lockup, the switch, "Start free" and this button into more than
             * the viewport. Something had to leave the bar, and this is the one
             * control that can, because a menu is where a phone keeps its
             * secondary navigation — but only once the menu actually has it.
             * Log in is here for the same reason.
             */}
            <li className="flex items-center justify-between gap-4 py-4">
              <span className="mk-bidi text-[0.9375rem] font-medium text-[var(--text)]">
                {copy.languageLabel}
              </span>
              <LangSwitch locale={locale} label={copy.languageLabel} />
            </li>
          </ul>

          {/* The margin and the width belong to the wrapper now — it is the
              flex item — and the pill fills it from `.mk-spark > a`. */}
          <Spark full>
            <Link href="/start" prefetch={false} className="mk-btn mk-solid mt-6 w-full">
              <span className="mk-bidi">{copy.startFree}</span>
            </Link>
          </Spark>
        </nav>
      </div>
    </>
  );
}
