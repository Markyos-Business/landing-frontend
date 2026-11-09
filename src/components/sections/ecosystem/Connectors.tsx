/*
 * The two small diagrams around the mark: six lines converging into it, and
 * three fanning out of it to the stage cards. Both aria-hidden.
 */

/* Into the mark. */
export function IntoMark() {
  return (
    <div aria-hidden="true" style={{ position: "relative", blockSize: 130, marginBlockStart: 8 }}>
      <svg
        viewBox="0 0 1000 130"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, inlineSize: "100%", blockSize: "100%" }}
      >
        <defs>
          <linearGradient id="bg1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="130">
            <stop offset="0" stopColor="#0099FF" stopOpacity="0" />
            <stop offset="1" stopColor="#0099FF" stopOpacity=".9" />
          </linearGradient>
          <linearGradient id="bg2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="130">
            <stop offset="0" stopColor="#0055FF" stopOpacity="0" />
            <stop offset="1" stopColor="#0055FF" stopOpacity=".8" />
          </linearGradient>
          <linearGradient id="bg3" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="130">
            <stop offset="0" stopColor="#00CCFF" stopOpacity="0" />
            <stop offset="1" stopColor="#00CCFF" stopOpacity=".9" />
          </linearGradient>
        </defs>
        <g fill="none" strokeWidth="1.4">
          {[360, 415, 470, 530, 585, 640].map((x, i) => (
            <path
              key={x}
              d={`M${x} 0 C${x} 70 500 60 500 130`}
              stroke={`url(#bg${(i % 3) + 1})`}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* And out into the three stages. */
export function IntoStages() {
  return (
    <div aria-hidden="true" style={{ position: "relative", blockSize: 110 }}>
      <svg
        viewBox="0 0 1000 110"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, inlineSize: "100%", blockSize: "100%" }}
      >
        <g fill="none" stroke="rgba(0,85,255,.35)" strokeWidth="1.2">
          <path d="M500 0 C500 60 833 50 833 110" vectorEffect="non-scaling-stroke" />
          <path d="M500 0 L500 110" vectorEffect="non-scaling-stroke" />
          <path d="M500 0 C500 60 167 50 167 110" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </div>
  );
}
