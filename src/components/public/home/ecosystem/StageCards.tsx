import type { EcosystemCopy } from "@/content/types";
import { Icon } from "@/components/ui";
import { BLUE_DEEP, INK, INK_55, LIFT_CARD, SELECTED } from "../landing";

/* The three stages the mark fans out into. */
export function StageCards({ stages }: { stages: EcosystemCopy["stages"] }) {
  return (
    <ul
      className="mk-trio"
      style={{
        gap: 16,
        margin: 0,
        padding: 0,
        listStyle: "none",
        textAlign: "start",
      }}
    >
      {stages.map((stage, i) => (
        <li
          key={stage.name}
          style={{
            background: "var(--surface-1)",
            borderRadius: 24,
            /* The third stage — Manage — is the one the page is heading
               towards, so it takes the lit ring. One per composition. */
            boxShadow: i === 2 ? `${SELECTED},0 24px 50px -30px rgba(0,85,255,.45)` : LIFT_CARD,
            padding: 26,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              aria-hidden="true"
              style={{
                inlineSize: 36,
                blockSize: 36,
                borderRadius: 11,
                background: i === 2 ? BLUE_DEEP : INK,
                /* White on the blue tile, the canvas colour on the ink one:
                   `INK` follows the ground now, so a fixed white glyph would
                   be white on near-white for two of the three stages. */
                color: i === 2 ? "#fff" : "var(--canvas)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name={stage.icon} size={19} />
            </span>
            <span className="mk-bidi" style={{ fontSize: 24, fontWeight: 500 }}>
              {stage.name}
            </span>
          </div>
          <p
            className="mk-bidi"
            style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.8 }}
          >
            {stage.what}
          </p>
          <p className="mk-bidi" style={{ margin: "8px 0 0", fontSize: 14, color: INK_55 }}>
            {stage.who}
          </p>
        </li>
      ))}
    </ul>
  );
}
