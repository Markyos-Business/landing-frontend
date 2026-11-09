import type { SiteCopy } from "@/content/types";
import { chipFor, type FeatureId } from "@/lib/status";

/*
 * The status chip.
 *
 * This component is the honesty layer made visible, and it is built so that
 * the page cannot lie by omission: a section does not decide whether to show a
 * chip, it names the feature and asks. If `lib/status.ts` says that feature is
 * not shipped, a chip appears — in every place the feature is mentioned, in
 * both languages, with no section able to forget.
 *
 * Renders nothing for a feature that is already built, so a card can mark
 * itself up unconditionally and simply be clean when the feature ships. That
 * is the whole point: "update the chips the day each phase ships" becomes one
 * edit to a status value rather than a hunt through the page.
 *
 * ── On light ──────────────────────────────────────────────────────────────
 *
 * The landing design draws this as a soft blue pill rather than an outlined
 * one: a blue tint with the deep blue as the label, which sits inside a
 * tinted table cell or a feature row without reading as a second card.
 *
 * This file is shared chrome rather than one of the traced homepage
 * sections, so it composes `--accent-soft` and `--accent-on-soft` instead of
 * carrying the design file's hex — which also means it follows if the
 * palette moves again.
 *
 * It is set at 12px rather than the design file's 11px: the one place this
 * trace rounds a value up, because 12px is the type floor and a status chip
 * is exactly the small secondary text the floor exists for.
 */

export function Chip({
  feature,
  chips,
  className = "",
}: {
  feature: FeatureId;
  /** Chip labels for the locale being rendered. */
  chips: SiteCopy["chips"];
  className?: string;
}) {
  const key = chipFor(feature);
  if (!key) return null;

  return (
    <span
      className={`mk-bidi ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        blockSize: 22,
        paddingInline: 8,
        borderRadius: 999,
        background: "var(--accent-soft)",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1,
        color: "var(--accent-on-soft)",
        whiteSpace: "nowrap",
        verticalAlign: "1px",
      }}
    >
      {chips[key]}
    </span>
  );
}
