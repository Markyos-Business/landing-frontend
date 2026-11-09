import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import localFont from "next/font/local";

/*
 * Three faces, and the design system decides all three.
 *
 * Latin is **Inter**, loaded as its variable font so 400 and 500 — the only
 * two weights the website uses — come from one file. The character variants
 * `cv01 cv05 cv09 cv11` are always on (set in tailwind/ from
 * `--mk-features`): single-storey a, tailed l, alternate 1, flat-top 3. They
 * exist to warm Inter up where it sits beside Arabic.
 *
 * Arabic is **Thmanya Sans**, self-hosted from ./fonts. It is the Arabic face
 * of the brand, not a fallback, and it is weight-matched to Inter rather than
 * tracked — tracking Arabic breaks the joins between letters.
 *
 * IBM Plex Sans Arabic stays loaded deliberately, as the last-resort fallback
 * in the stacks: `tailwind/tokens.generated.js` still references
 * `--font-plex-arabic`, and that file is generated and never edited here.
 *
 * ── Bricolage Grotesque ───────────────────────────────────────────────────
 *
 * Not loaded, and that is correct rather than an omission. Bricolage is the
 * *wordmark's* typeface — it is never set as live text anywhere on the site,
 * because the wordmark is always one of the SVGs in public/brand/. Declaring
 * it here would preload two .ttf files that nothing renders.
 *
 * Source of truth: MARKYOS-DESIGN-SYSTEM.md §2.1 and §5.
 */

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const thmanya = localFont({
  src: [
    { path: "./fonts/thmanyahsans-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/thmanyahsans-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/thmanyahsans-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/thmanyahsans-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-thmanya",
  display: "swap",
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${thmanya.variable} ${plexArabic.variable}`;
