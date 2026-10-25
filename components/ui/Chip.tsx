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
      className={
        "mk-bidi inline-flex items-center rounded-[var(--mk-r-status)] " +
        // An outlined pill on the canvas, not a filled one. The reference
        // draws it this way so a chip can sit inside a card without reading
        // as a second, brighter card: the warm edge says "not yet" quietly
        // enough that the sentence it annotates is still the thing you read.
        "border border-[var(--accent-edge)] bg-[var(--canvas)] " +
        "text-[var(--accent-text)] " +
        "px-2.5 py-1 text-[length:var(--fs-eyebrow)] font-medium leading-none " +
        className
      }
    >
      {chips[key]}
    </span>
  );
}
