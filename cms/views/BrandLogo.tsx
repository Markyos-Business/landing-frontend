import React from "react";
import { Logo, Mark } from "@/components/ui";

/*
 * The Markyos mark inside the Payload admin.
 *
 * Payload takes two graphics: `Logo` for the login screen and `Icon` for the
 * sidebar header. Both reuse `src/components/ui/brand/Logo.tsx` — the same component
 * the marketing header renders — rather than pointing an <img> at the file in
 * public/brand/.
 *
 * Three reasons, and the first is the one that decided it. The source assets
 * declare no fill, so every path defaults to black; an <img> cannot inherit
 * colour, and the panel's ground has now been both near-black and paper
 * within a week. That component masks `currentColor` through the file
 * instead, so the mark follows the panel's ink whichever way it goes and
 * nothing had to change here when the admin turned light (§12 — the file is
 * never recoloured; `currentColor` is the file being used as a mask, not a
 * colour decision). Second, one source of truth: the
 * shape is the file in public/brand/, so replacing the brand asset reaches
 * the admin too. Third, `<img>` on a local SVG trips the lint rule the build
 * runs with `--max-warnings=0`.
 *
 * Sizing lives in tailwind/admin.js, so nothing about the artwork is
 * decided here (§12: files only, never retyped, redrawn or recoloured).
 */

export function BrandLogo() {
  /* The admin is English-only, so the Latin lockup. */
  return <Logo locale="en" height={28} className="mk-admin-logo" />;
}

/*
 * The sidebar slot is a small square, so it gets the mark — not the lockup.
 * The lockup was clipped there: in LTR the crop landed on the mark and looked
 * right, in RTL it showed the tail of the wordmark (§12).
 */
export function BrandIcon() {
  return <Mark size={24} className="mk-admin-icon" title="Markyos" />;
}

export default BrandLogo;
