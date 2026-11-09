import { Icon } from "@/components/ui";
import type { HelpCategory } from "../types";

/* The category tiles: each one filters the list in place. */
export function CategoryTiles({
  categories,
  counts,
  picked,
  onToggle,
}: {
  categories: HelpCategory[];
  counts: Record<string, string>;
  picked: string | null;
  onToggle: (name: string) => void;
}) {
  return (
    <>
    {/* `mk-seq-load` and not `mk-seq`: at desktop these tiles are on the
        first screen, where a `cover` range is already complete and a
        scroll-driven reveal has nothing to be driven by. */}
    <ul className="mk-seq-load mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const on = picked === category.name;
        return (
          <li key={category.name}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(category.name)}
              className="mk-help-tile"
            >
              <span className="mk-help-tile-icon" aria-hidden="true">
                <Icon name={category.icon} size={17} />
              </span>
              <span className="min-w-0">
                <span className="mk-bidi block text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
                  {category.name}
                </span>
                <span className="mk-bidi mt-0.5 block text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                  {counts[category.name]}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
    </>
  );
}
