"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { NavCopy } from "@/content/types";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { Arrow, Icon } from "@/components/ui/Icon";

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
  const panelId = useId();

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
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="-me-1 grid size-9 place-items-center rounded-[var(--mk-r-button)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)] md:hidden"
      >
        <Icon name={open ? "close" : "menu"} size={20} label={copy.menuLabel} />
      </button>

      <div
        id={panelId}
        hidden={!open}
        // `top-14` is the header's own height: the panel starts where the
        // header ends rather than under it.
        className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto overscroll-contain border-t border-[var(--hairline)] bg-[var(--canvas)] md:hidden"
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
                            <li>
                              <Link
                                href={localeHref(locale, group.more.href)}
                                className="inline-flex items-center gap-1.5 py-2 text-[0.75rem] font-medium text-[var(--accent-text)]"
                              >
                                <span className="mk-bidi">{group.more.label}</span>
                                <Arrow size={12} />
                              </Link>
                            </li>
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
                                {i === 0 ? null : <Arrow size={12} />}
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
          </ul>

          <Link href="/start" prefetch={false} className="mk-btn mk-solid mt-6 w-full">
            <span className="mk-bidi">{copy.startFree}</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
