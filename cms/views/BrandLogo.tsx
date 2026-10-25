import React from "react";
import { Logo, Mark } from "@/components/brand/Logo";

/*
 * The Markyos mark inside the Payload admin.
 *
 * Payload takes two graphics: `Logo` for the login screen and `Icon` for the
 * sidebar header. Both reuse `components/brand/Logo.tsx` — the same inline
 * lockup the marketing header renders — rather than pointing an <img> at the
 * file in public/brand/.
 *
 * Three reasons, and the first is the one that decided it. The source asset
 * declares no fill, so every path defaults to black; an <img> cannot inherit
 * colour, which on this near-black panel would render the wordmark invisible.
 * That is the same trap the marketing component's own header note records,
 * and it is why that component exists. Second, one copy of the artwork:
 * nothing to keep in step when the brand asset changes. Third, `<img>` on a
 * local SVG trips the lint rule the build runs with `--max-warnings=0`.
 *
 * Sizing lives in app/(payload)/custom.css, so nothing about the artwork is
 * decided here (§12: files only, never retyped, redrawn or recoloured).
 */

export function BrandLogo() {
  return <Logo className="mk-admin-logo" />;
}

/*
 * The sidebar slot is a small square, so it gets the mark — not the lockup.
 * The lockup was clipped there: in LTR the crop landed on the mark and looked
 * right, in RTL it showed the tail of the wordmark (§12).
 */
export function BrandIcon() {
  return <Mark className="mk-admin-icon" />;
}

export default BrandLogo;
