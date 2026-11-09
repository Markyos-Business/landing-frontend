import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
import { Icon } from "@/components/ui";
import { INK_45 } from "../landing";

/* Sales is still using the old logo. */
export function OldLogoSlide({ label, locale }: { label: string; locale: Locale }) {
  const { oldLogo } = mockCopy(locale).t.problem;
  return (
    <div
      className="mk-pain-art"
      style={{ display: "grid", placeItems: "center", blockSize: "100%" }}
    >
      <div
        style={{
          inlineSize: "74%",
          aspectRatio: "16/10",
          /*
           * 74% of the frame's *width* is a height too, through the ratio,
           * and at 1024 the single-column grid makes the frame 458px wide
           * — a 212px slide in a 200px box. The cap lets the ratio shrink
           * the width instead of the box clipping the slide.
           */
          maxBlockSize: "calc(100% - 56px)",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 0 0 1px rgba(11,11,15,.06),0 16px 30px -18px rgba(11,20,60,.3)",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: "rotate(2deg)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mk-bidi" style={{ fontSize: 12, color: INK_45 }}>
            {label}
          </span>
          <span
            style={{
              inlineSize: 46,
              blockSize: 14,
              borderRadius: 3,
              background:
                "repeating-linear-gradient(45deg,rgba(11,11,15,.12) 0 4px,rgba(11,11,15,.04) 4px 8px)",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ blockSize: 10, inlineSize: "70%", borderRadius: 4, background: "rgba(11,11,15,.1)" }} />
          <span style={{ blockSize: 10, inlineSize: "46%", borderRadius: 4, background: "rgba(11,11,15,.06)" }} />
        </div>
      </div>
      {/*
       * The tag sits at the foot of the frame, not its head.
       *
       * The design file puts it at `top: 16`, which clears the slide at
       * 1440 because the card is centred and narrow there. Below about
       * 1100 the card's edge moves under it and the tag lands on top of
       * "Sales deck · slide 4" — caught by measuring rendered boxes, not by
       * looking, because at a glance it reads as a deliberate overlap.
       */}
      <span
        style={{
          position: "absolute",
          insetInlineStart: 16,
          bottom: 16,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          blockSize: 28,
          padding: "0 10px",
          borderRadius: 999,
          background: "#fff",
          boxShadow: "0 0 0 1px rgba(255,0,102,.18)",
          fontSize: 12,
          color: "#C2004E",
        }}
      >
        <Icon name="history" size={15} />
        <span className="mk-bidi">{oldLogo}</span>
      </span>
    </div>
  );
}
