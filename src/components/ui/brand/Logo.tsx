import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n/locales";

/*
 * The Markyos lockup and iconmark.
 *
 * ── Files, not path data ──────────────────────────────────────────────────
 *
 * §12 is literal about this: "Files only, from `public/brand/`. Never
 * retype, redraw, recolour, stretch, rotate or add effects." This component
 * used to inline the path data, which is retyping — and it cost exactly what
 * you would expect: when the brand files were replaced on 3 Nov 2026 the site
 * went on rendering the previous artwork from a copy nobody thought to
 * regenerate.
 *
 * So the shape comes from the file, and the colour comes from a mask: the
 * element is a block of `currentColor` with the SVG as its alpha mask. That
 * keeps the one thing inlining was for — the mark inheriting the colour of
 * its text context, so it is correct on a light header and a dark one — while
 * the geometry stays in `public/brand/` where the designer can replace it.
 *
 * It also means a file whose paths declare no fill (all three of ours) is
 * fine: a mask reads alpha, not colour.
 *
 * ── Two lockups ──────────────────────────────────────────────────────────
 *
 * The brand has an Arabic lockup and a Latin one, and they are different
 * artwork, not a mirrored pair — «ماركيوس» is set in Arabic letterforms with
 * the iconmark on its right, "Markyos" in Latin with the iconmark on its
 * left. §12 says logos never mirror, which is exactly why there are two
 * files: the Arabic lockup reads correctly in RTL because it was drawn that
 * way, not because anything flipped it.
 *
 * So `Logo` takes a locale and picks. Getting this wrong is quiet — a Latin
 * lockup on the Arabic homepage looks deliberate until somebody notices the
 * site's own claim is that Arabic was not an afterthought.
 */

const LOCKUP = {
  /* w/h from each file's own viewBox, so the box is never the wrong shape. */
  ar: { file: "markyos-lockup-ar", ratio: 1698.77 / 412.51 },
  en: { file: "markyos-lockup", ratio: 2139.19 / 412.51 },
} as const;

function masked(file: string, height: number, ratio: number): CSSProperties {
  const mask = `url("/brand/${file}.svg") center / contain no-repeat`;
  return {
    display: "block",
    blockSize: height,
    inlineSize: Math.round(height * ratio * 100) / 100,
    background: "currentColor",
    mask,
    WebkitMask: mask,
    flex: "none",
  };
}

/**
 * The lockup — the iconmark and the wordmark together.
 *
 * §12: the default, and always the first time the brand appears on a page.
 * Minimum 120px wide, which at the Latin lockup's 5.19:1 is a height of 24px
 * and at the Arabic lockup's 4.12:1 is 30px — so `height` should not go
 * below 24.
 */
export function Logo({
  locale = "en",
  height = 24,
  className = "",
  title = locale === "ar" ? "ماركيوس" : "Markyos",
}: {
  locale?: Locale;
  /** Height in px. The width follows from the file's own aspect ratio. */
  height?: number;
  className?: string;
  /** Only set this when the logo is not already inside a labelled link. */
  title?: string;
}) {
  const { file, ratio } = LOCKUP[locale === "ar" ? "ar" : "en"];
  const name = title.trim();

  return (
    <span
      role={name ? "img" : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
      className={className}
      style={masked(file, height, ratio)}
    />
  );
}

/**
 * The iconmark on its own.
 *
 * §12: for favicons and app icons, minimum 16px, and on the page only when
 * the mark is already on screen. The Payload admin's `Icon` slot is a small
 * square, and feeding it the lockup there cropped the artwork — in LTR the
 * crop happened to land on the mark and looked right, which is why it
 * survived a review; in RTL it showed the tail of the wordmark instead.
 */
export function Mark({
  size = 24,
  className = "",
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
      style={masked("markyos-mark", size, 1)}
    />
  );
}
