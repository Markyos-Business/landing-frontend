"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n/locales";

/*
 * Reports a page view.
 *
 * About twenty lines of client JavaScript and no third-party script, which is
 * the point: nothing here follows anybody off this site, and there is no
 * cookie, so there is no banner.
 *
 * `usePathname` rather than a one-off on mount, because the site is a single
 * page application once it has loaded — navigating from the homepage to
 * /pricing never reloads, so a mount-only effect would count one view per
 * session and make the whole dashboard wrong in the same direction.
 */

export function Analytics() {
  const pathname = usePathname();
  /*
   * React runs effects twice in development's strict mode, and a navigation
   * can re-render without the path changing. Both would double-count, so the
   * last reported path is remembered and repeats are dropped.
   */
  const lastReported = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastReported.current) return;
    lastReported.current = pathname;

    // Never count the admin panel as marketing traffic.
    if (pathname.startsWith("/admin")) return;

    // Strip the locale segment so /ar/pricing and /en/pricing aggregate as
    // one page, with the language recorded separately. Otherwise every page
    // appears twice in the dashboard and neither row is the real total.
    const segments = pathname.split("/").filter(Boolean);
    const maybeLocale = segments[0];
    const locale = (LOCALES as readonly string[]).includes(maybeLocale ?? "")
      ? (maybeLocale as Locale)
      : undefined;
    const path = `/${(locale ? segments.slice(1) : segments).join("/")}`;

    const body = JSON.stringify({
      path,
      locale,
      // Only on the first page of a visit. After that the referrer is this
      // site, which the endpoint discards anyway.
      referrer: document.referrer || undefined,
    });

    /*
     * `sendBeacon` first: it survives the page being closed, which is exactly
     * when a reader who bounced is most worth counting. It cannot set
     * headers, so the endpoint accepts a text/plain body too.
     */
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      return;
    }

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // A view that was not counted is not worth a console error on a
      // reader's screen.
    });
  }, [pathname]);

  return null;
}
