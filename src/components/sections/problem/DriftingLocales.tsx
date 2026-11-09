import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
import { INK_45, RING, BLUE_DEEP } from "../landing";

/*
 * The Arabic says something the English never did.
 *
 * Both rows keep an explicit `dir` and do not mirror: the claim of the
 * picture is that these two locales disagree, and that is only visible if
 * each one is laid out the way its own reader sees it. Locales appear as
 * codes, never as flags.
 */
export function DriftingLocales({ line, locale }: { line: string; locale: Locale }) {
  const { drift } = mockCopy(locale).t.problem;
  const other = locale === "ar" ? "en" : "ar";
  const [before, accent, after] = splitOn(drift.other.text, drift.other.accent);

  return (
    <div
      className="mk-pain-art"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
        padding: "20px",
        blockSize: "100%",
      }}
    >
      {/* The page's own language, carrying the card's line. */}
      <Row code={drift.code} dir={locale === "ar" ? "rtl" : "ltr"} lang={locale} ring={DRIFT_RING}>
        {line}
      </Row>

      {/* The other language, saying something else. */}
      <Row
        code={drift.other.code}
        dir={other === "ar" ? "rtl" : "ltr"}
        lang={other}
        ring={RING}
      >
        {before}
        <b style={{ fontWeight: 500, color: BLUE_DEEP }}>{accent}</b>
        {after}
      </Row>
    </div>
  );
}

const DRIFT_RING = "0 0 0 1px rgba(255,0,102,.22)";

/** Split a line around the one phrase that should be set in full ink. */
function splitOn(text: string, phrase: string): [string, string, string] {
  const at = text.indexOf(phrase);
  if (at === -1) return [text, "", ""];
  return [text.slice(0, at), phrase, text.slice(at + phrase.length)];
}

/*
 * One locale's row.
 *
 * `min-block-size`, not `block-size`: the line inside is real copy and its
 * length is not this component's to decide. At 46px fixed, the English
 * line wrapped to two lines inside a one-line box and ran over the locale
 * code beside it.
 */
function Row({
  code,
  dir,
  lang,
  ring,
  children,
}: {
  code: string;
  dir: "rtl" | "ltr";
  lang: string;
  ring: string;
  children: React.ReactNode;
}) {
  return (
    <div
      dir={dir}
      lang={lang}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        minBlockSize: 46,
        padding: "8px 14px",
        borderRadius: 14,
        background: "#fff",
        boxShadow: ring,
      }}
    >
      <span
        dir="ltr"
        style={{
          flex: "none",
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          color: INK_45,
        }}
      >
        {code}
      </span>
      <span
        style={{
          fontSize: 14,
          lineHeight: 1.45,
          fontFamily: lang === "ar" ? undefined : "Inter, sans-serif",
        }}
      >
        {children}
      </span>
    </div>
  );
}
