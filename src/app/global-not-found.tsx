import type { Metadata } from "next";
import { NOT_FOUND_COPY } from "@/content/not-found";
import { localeHref } from "@/lib/i18n/href";
import { LOCALE_DIR } from "@/lib/i18n/locales";
import { fontVariables } from "./fonts";
import "./tailwind.css";

/*
 * The 404 for a URL that matches no route at all (25 Nov 2026).
 *
 * The registry's catch-all keeps `dynamicParams: false`, so an unknown path is
 * refused at routing, before the locale layout runs, and never costs a
 * function invocation. Without this file that refusal rendered Next's bare
 * default: white, English, no `lang` or `dir`, no way back in — on a site
 * whose claim is that it is built in Arabic.
 *
 * Routing has not chosen a language at this point, so the page carries both:
 * the Arabic edition first (it is the default, unprefixed one) and English
 * after it, each block with its own `lang` and `dir`, each linking into its
 * own edition. Known routes that call notFound() still get the single-language
 * page in src/app/[lang]/not-found.tsx; both read content/not-found.ts.
 */

export const metadata: Metadata = {
  title: "404 · Markyos",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body>
        <main className="mk-container relative overflow-clip py-24">
          {(["ar", "en"] as const).map((locale, i) => {
            const copy = NOT_FOUND_COPY[locale];
            const Heading = i === 0 ? "h1" : "h2";
            return (
              <section
                key={locale}
                lang={locale}
                dir={LOCALE_DIR[locale]}
                aria-labelledby={`not-found-${locale}`}
                className="mk-measure relative py-10"
              >
                {i === 0 ? <p className="mk-eyebrow">404</p> : null}
                <Heading id={`not-found-${locale}`} className="mk-h2 mk-bidi mt-4">
                  {copy.title}
                </Heading>
                <p className="mk-lead mk-bidi mt-5">{copy.body}</p>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a href={localeHref(locale, "/")} className="mk-btn mk-solid">
                    <span className="mk-bidi">{copy.home}</span>
                  </a>
                  {copy.links.map((link) => (
                    <a
                      key={link.href}
                      href={localeHref(locale, link.href)}
                      className="mk-bidi text-sm font-medium text-[var(--accent-text)] mk-underline-reveal underline-offset-4"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
}
