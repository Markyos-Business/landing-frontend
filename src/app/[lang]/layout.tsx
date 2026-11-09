import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "../fonts";
import { Header } from "@/components/navbar";
import { Footer } from "@/components/public/Footer";
import { Analytics } from "@/components/public/Analytics";
import { getCopyFor } from "@/lib/i18n/dictionary";
import { isLocale, LOCALES, LOCALE_DIR } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import "../globals.css";
/*
 * Line Awesome 1.3.0 — the one icon system (MARKYOS-DESIGN-SYSTEM.md §1.10).
 * It supplies the `.la-*` class map that `components/ui/Icon.tsx` renders, and
 * the package carries its own woff2 files, so nothing is fetched from a CDN.
 */
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";

/*
 * The root layout.
 *
 * It lives under `[lang]` rather than at `app/`, which Next supports and which
 * this site needs: `dir` and `lang` belong on <html>, and both are properties
 * of the locale. Putting the root layout above the locale segment would mean
 * the one attribute the entire bilingual layout depends on could only be set
 * on the client, after first paint — so the Arabic page would load
 * left-to-right and visibly flip.
 */

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const copy = await getCopyFor(lang);
  return pageMetadata({
    locale: lang,
    path: "",
    title: copy.meta.title,
    description: copy.meta.description,
    ogTitle: copy.meta.ogTitle,
    ogDescription: copy.meta.ogDescription,
  });
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // A path like /de/pricing matches the segment but is not a locale we
  // publish. 404 rather than falling back, so a crawler is told the page does
  // not exist instead of being served English under a German URL.
  if (!isLocale(lang)) notFound();

  // The approved copy, straight from `content/`. There used to be a CMS layer
  // over this — the `navigation` and `announcement` globals — which was
  // removed on 8 Nov 2026 when the admin became the resources CMS. The same
  // call `generateMetadata` above already makes, so the chrome and the
  // metadata can no longer disagree about what the nav says.
  const copy = await getCopyFor(lang);

  return (
    <html lang={lang} dir={LOCALE_DIR[lang]} className={fontVariables}>
      <body>
        {/* First tab stop on every page. The header holds a nav, a language
            switcher and two CTAs, which is a lot to tab past to reach the
            content a screen-reader user came for. */}
        <a href="#main" className="mk-sr-only">
          {copy.nav.skipToContent}
        </a>

        <Header copy={copy.nav} locale={lang} />

        <main id="main">{children}</main>

        <Footer copy={copy.footer} locale={lang} />

        {/* Counts page views first-party: no cookie, no stored IP, no banner.
            See app/api/track/route.ts. */}
        <Analytics />
      </body>
    </html>
  );
}
