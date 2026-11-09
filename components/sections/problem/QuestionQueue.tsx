import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
import { INK_45, RING, BLUE_DEEP } from "../landing";

/* Every brand question lands on one desk. */
export function QuestionQueue({ first, locale }: { first: string; locale: Locale }) {
  const p = mockCopy(locale).t.problem;
  /*
   * The look of each row is this component's; the words are the
   * dictionary's. The two were one list until 8 Nov 2026, which is how the
   * English homepage came to show an Arabic chat under an English heading.
   */
  const style = [
    { tint: "rgba(0,153,255,.1)", ink: BLUE_DEEP, indent: 0, fade: 1 },
    { tint: "rgba(0,204,255,.12)", ink: "#00799A", indent: 14, fade: 0.85 },
    { tint: "rgba(138,88,255,.12)", ink: "#6A3BE0", indent: 28, fade: 0.7 },
  ];
  const rows = [
    { who: p.firstWho, q: first, when: p.firstWhen, ...style[0] },
    { ...p.queue[0], ...style[1] },
    { ...p.queue[1], ...style[2] },
  ];

  return (
    <div
      className="mk-pain-art mk-pain-art-b"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
        /* Vertical padding, so the first and last bubble do not sit on the
           frame's edge when the queue is at its tallest. */
        padding: "16px 20px",
        blockSize: "100%",
      }}
    >
      {rows.map((row) => (
        <div
          key={row.who}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 14,
            background: "#fff",
            boxShadow: RING,
            opacity: row.fade,
            marginInlineStart: row.indent,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              flex: "none",
              inlineSize: 28,
              blockSize: 28,
              borderRadius: "50%",
              background: row.tint,
              color: row.ink,
              fontSize: 13,
              fontWeight: 500,
              display: "grid",
              placeItems: "center",
            }}
          >
            {row.who}
          </span>
          <span className="mk-bidi" style={{ flex: 1, minInlineSize: 0, fontSize: 14 }}>
            {row.q}
          </span>
          <span style={{ fontSize: 12, color: INK_45 }}>{row.when}</span>
        </div>
      ))}
    </div>
  );
}
