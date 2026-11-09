import type { AiAlongsideCopy, SiteCopy } from "@/content/types";
import { Chip, Icon } from "@/components/ui";
import { BLUE_DEEP, INK_62, RING_6 } from "../landing";

/* The six seams where the parts of a brand come apart. */
export function Seams({ copy, chips }: { copy: AiAlongsideCopy; chips: SiteCopy["chips"] }) {
  return (
    <div style={{ marginBlockStart: 64 }}>
      {copy.seamsHeadline ? (
        <h3
          className="mk-bidi"
          style={{
            margin: "0 0 20px",
            fontWeight: 500,
            fontSize: "clamp(20px,2.4vw,26px)",
            lineHeight: 1.45,
            textWrap: "pretty",
          }}
        >
          {copy.seamsHeadline}
        </h3>
      ) : null}

      <ul
        className="mk-seq-pop"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
          gap: 14,
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {copy.seams?.map((seam) => (
          <li
            key={seam.title}
            style={{
              padding: 20,
              borderRadius: 20,
              background: "#fff",
              boxShadow: RING_6,
            }}
          >
            <div
              style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}
            >
              <Icon name="exchange" size={16} style={{ color: BLUE_DEEP }} />
              {seam.chip ? <Chip feature={seam.chip} chips={chips} /> : null}
            </div>
            <p
              className="mk-bidi"
              style={{
                margin: "10px 0 0",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 1.5,
                textWrap: "pretty",
              }}
            >
              {seam.title}
            </p>
            <p
              className="mk-bidi"
              style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.75, color: INK_62 }}
            >
              {seam.line}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
