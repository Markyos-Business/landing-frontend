import { Mark } from "../landing";

/* The brand brain, lit. The one light pool of the section. */
export function BrandMark({ label }: { label: string }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 2,
      }}
    >
      <div
        style={{
          inlineSize: 128,
          blockSize: 128,
          borderRadius: 32,
          background: "#fff",
          boxShadow:
            "0 0 0 1px rgba(11,11,15,.04),0 24px 60px -12px rgba(0,153,255,.5),0 0 48px rgba(0,153,255,.22)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Mark size={64} />
      </div>
      <span className="mk-bidi" style={{ marginBlockStart: 18, fontSize: 22, fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}
