import type { PageBlock } from "@/content/pages/types";
import { Icon, Mark } from "@/components/ui";

/* ── web ──────────────────────────────────────────────────────────────────── */

/*
 * The choice, as a picture. The block's note in `content/pages/types.ts`
 * says why it is boxes rather than a drawing and why it is aria-hidden.
 *
 * The motion is the page's own: the three tiles arrive with depth, the rule
 * under them draws itself from the reading edge as the section crosses, and
 * the nine chips cascade. Three classes, no JavaScript, and all of it dies
 * cleanly on a browser without `animation-timeline` — the one that matters
 * is `.mk-draw`, whose note explains why a missing divider is worse than a
 * missing reveal.
 */
export function WebBlock({ block }: { block: Extract<PageBlock, { kind: "web" }> }) {
  return (
    <section id={block.id} className="mk-web-section">
      <div className="mk-container">
        <div className="mk-web" aria-hidden="true">
          <ul className="mk-web-row mk-seq-pop">
            {block.from.map((node) => (
              <li key={node.label} className="mk-web-node">
                <span className="mk-web-tile">
                  <span className="mk-web-tile-icon">
                    <Icon name={node.icon} size={16} />
                  </span>
                  {node.label}
                </span>
                <span className="mk-web-stub" />
              </li>
            ))}
          </ul>

          <div className="mk-web-rail">
            <span className="mk-web-line mk-draw" />
            <span className="mk-web-hub">
              <Mark size={18} />
            </span>
            <span className="mk-web-line mk-draw" />
          </div>

          <ul className="mk-web-row mk-web-chips mk-seq">
            {block.to.map((label) => (
              <li key={label} className="mk-web-node">
                <span className="mk-web-stub" />
                <span className="mk-web-chip">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
