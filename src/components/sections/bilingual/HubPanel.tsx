import { INK_45, INK_55, PANEL, RING, BLUE_DEEP } from "../landing";

/*
 * One brand hub, in one language.
 *
 * Both panels share the grid cell, so the inactive one is faded out and
 * removed from the tab order and the accessibility tree rather than
 * unmounted — see the note at the top. `inert` would be the right attribute
 * here; `aria-hidden` plus `pointer-events` is the part that works today in
 * every browser this site supports.
 */
export function HubPanel({ active, locale }: { active: boolean; locale: "ar" | "en" }) {
  const ar = locale === "ar";

  const nav = ar
    ? ["الشعار", "الألوان", "الخطوط", "الصوت", "الأصول"]
    : ["Logo", "Colour", "Typography", "Voice", "Assets"];

  const rows = ar
    ? [
        ["المساحة الآمنة", "نصف ارتفاع الرمز"],
        ["الحد الأدنى", "120 بكسل عرضاً"],
      ]
    : [
        ["Clear space", "Half the mark’s height"],
        ["Minimum size", "120 px wide"],
      ];

  return (
    <div
      dir={ar ? "rtl" : "ltr"}
      lang={locale}
      aria-hidden={!active}
      style={{
        gridArea: "1/1",
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
        /*
         * The panel that is leaving slides toward its own reading edge, and
         * the one arriving comes in from its own.
         *
         * A plain cross-fade in place was the whole problem: the two panels
         * are the same object and the section's claim is that the *layout*
         * turns around, so dissolving one into the other showed nothing
         * turning. 22px is small enough to stay a hand-off and large enough
         * to be a direction.
         *
         * Physical px and not a logical property, deliberately: each panel
         * carries its own `dir`, and which way it leaves is the point.
         */
        translate: active ? "0" : `${ar ? 22 : -22}px`,
        transition:
          "opacity 360ms cubic-bezier(.32,.72,0,1), translate 420ms cubic-bezier(.32,.72,0,1)",
        background: "#fff",
        borderRadius: 20,
        boxShadow: RING,
        overflow: "clip",
        fontFamily: ar ? undefined : "Inter, sans-serif",
        lineHeight: ar ? undefined : 1.5,
      }}
    >
      {/* The hub's title bar. The locale is a code, never a flag. */}
      <div
        style={{
          blockSize: 52,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          boxShadow: "0 1px 0 rgba(11,11,15,.06)",
        }}
      >
        <span
          style={{ inlineSize: 22, blockSize: 22, borderRadius: 7, background: "#3B2A20" }}
        />
        <span style={{ fontSize: ar ? 15 : 14, fontWeight: 500 }}>
          {ar ? "قهوة نخلة" : "Nakhla Coffee"}
        </span>
        <span style={{ fontSize: ar ? 14 : 13, color: INK_45 }}>
          · {ar ? "مركز العلامة" : "Brand hub"}
        </span>
        <span
          dir="ltr"
          style={{
            marginInlineStart: "auto",
            blockSize: 24,
            padding: "0 8px",
            borderRadius: 6,
            background: PANEL,
            fontSize: 12,
            display: "inline-flex",
            alignItems: "center",
            color: "rgba(11,11,15,.6)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {ar ? "ar-SA" : "en-US"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)" }}>
        <div
          style={{
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: ar ? 14 : 13,
            color: "rgba(11,11,15,.6)",
            /* The sidebar's divider is on its inline-end edge, which is the
               left in Arabic and the right in English — one logical shadow
               rather than two physical ones. */
            boxShadow: "1px 0 0 rgba(11,11,15,.06)",
          }}
        >
          {nav.map((item, i) => (
            <span
              key={item}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: i === 0 ? "rgba(0,153,255,.08)" : undefined,
                color: i === 0 ? BLUE_DEEP : undefined,
                fontWeight: i === 0 ? 500 : undefined,
              }}
            >
              {item}
            </span>
          ))}
        </div>

        <div
          style={{
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minInlineSize: 0,
          }}
        >
          <div>
            <span style={{ fontSize: ar ? 13 : 12, color: INK_45 }}>{nav[0]}</span>
            {/*
             * A <div>, not an <h4>.
             *
             * This is a label inside a picture of the product, and the
             * section's own heading is an <h2> — so an <h4> here put a hole
             * in the document outline (h2 → h4) for a string that is not a
             * section of this page at all. The earlier audit fixed four of
             * these; a mock is the easiest place to reintroduce one.
             */}
            <div
              style={{
                margin: ar ? 0 : "2px 0 0",
                fontWeight: 500,
                fontSize: 22,
                lineHeight: 1.4,
                letterSpacing: ar ? undefined : "-.025em",
              }}
            >
              {ar ? "الشعار الأساسي" : "Primary logo"}
            </div>
            <p
              style={{
                margin: ar ? "2px 0 0" : "4px 0 0",
                fontSize: ar ? 14 : 13,
                lineHeight: ar ? 1.7 : 1.45,
                color: "rgba(11,11,15,.6)",
              }}
            >
              {ar
                ? "استخدمه افتراضياً، ودائماً في أول ظهور للعلامة."
                : "Use it by default, and always the first time the brand appears."}
            </p>
          </div>

          {/* The client's logo slot, and their palette. These are a
              customer's brand shown as content, which is why they are hex. */}
          <div
            style={{
              blockSize: 110,
              borderRadius: 14,
              background: `repeating-linear-gradient(${
                ar ? "45deg" : "135deg"
              },#F4EDE3 0 10px,#EFE6D9 10px 20px)`,
              display: "grid",
              placeItems: "center",
              fontSize: ar ? 13 : 12,
              color: "rgba(59,42,32,.7)",
            }}
          >
            {ar ? "شعار العميل" : "Client logo"}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["#3B2A20", "#C9A27E", "#F3EAD9"].map((swatch) => (
              <span
                key={swatch}
                style={{
                  flex: 1,
                  blockSize: 30,
                  borderRadius: 8,
                  background: swatch,
                  boxShadow:
                    swatch === "#F3EAD9" ? "inset 0 0 0 1px rgba(11,11,15,.06)" : undefined,
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: ar ? 14 : 13 }}>
            {rows.map(([label, value], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: ar ? "8px 0" : "9px 0",
                  boxShadow: i === 0 ? "0 1px 0 rgba(11,11,15,.06)" : undefined,
                }}
              >
                <span style={{ color: INK_55 }}>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
