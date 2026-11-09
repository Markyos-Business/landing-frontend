import type { AiAlongsideCopy, SiteCopy } from "@/content/types";
import { Chip } from "@/components/ui/Chip";
import { INK_62, PANEL } from "../landing";

/* What it will not do. */
export function Limits({ copy, chips }: { copy: AiAlongsideCopy; chips: SiteCopy["chips"] }) {
  return (
    <div
      className="mk-rise"
      style={{
        marginBlockStart: 44,
        padding: "clamp(18px,2.6vw,28px)",
        borderRadius: 24,
        background: PANEL,
      }}
    >
      {copy.limitsHeadline ? (
        <h3
          className="mk-bidi"
          style={{ margin: 0, fontWeight: 500, fontSize: 17, lineHeight: 1.4 }}
        >
          {copy.limitsHeadline}
        </h3>
      ) : null}

      {copy.limits?.map((line) => (
        <p
          key={line}
          className="mk-bidi"
          style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.85, color: INK_62 }}
        >
          {line}
        </p>
      ))}

      {copy.connector ? (
        <p
          className="mk-bidi"
          style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.85, color: INK_62 }}
        >
          <span style={{ marginInlineEnd: 8, display: "inline-block" }}>
            <Chip feature={copy.connector.chip} chips={chips} />
          </span>
          {copy.connector.line}
        </p>
      ) : null}
    </div>
  );
}
