import { DOTS, RING } from "../landing";

export function PainCard({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure
      style={{
        /*
         * A column, so the frame below can take the height the grid gives
         * this card. The three cards are grid items and stretch to the
         * tallest of them; the frame used to be a fixed 200px inside that,
         * so a picture taller than 200 was simply clipped — the English
         * question queue lost its third row, and the sales slide lost its
         * top and bottom edge at 1024.
         */
        display: "flex",
        flexDirection: "column",
        margin: 0,
        background: "#fff",
        borderRadius: 28,
        boxShadow: RING,
        overflow: "clip",
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          minBlockSize: 200,
          margin: 10,
          borderRadius: 20,
          background: DOTS,
          overflow: "clip",
        }}
      >
        {children}
      </div>
      <figcaption
        className="mk-bidi"
        style={{ margin: 0, padding: "12px 26px 26px", fontSize: 16, fontWeight: 500 }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
