import type { Locale } from "@/lib/i18n/locales";
import { mockCopy } from "@/content/mocks";
/*
 * The product shot in the hero.
 *
 * Markup, not a screenshot. Three reasons, and the third is the real one:
 *
 *   - It stays sharp on every display and costs about 3KB of HTML against the
 *     ~400KB a retina PNG of this would weigh.
 *   - It cannot go out of date in the quiet way a screenshot does, where the
 *     product ships a new sidebar and the marketing site keeps showing the old
 *     one for a year. That is the exact decay this product is sold against.
 *   - A screenshot of Arabic type is an image of text, which no screen reader,
 *     no translator and no search engine can read. Rendered as markup it is
 *     text, in the right language, with the right `lang` on it.
 *
 * ── It follows the page's language (8 Nov 2026) ───────────────────────────
 *
 * It used to be Arabic in both editions, with an argument: the hub belongs
 * to a fictional Gulf client, and showing it in Arabic told an
 * English-reading studio owner "this is what your client's brand hub looks
 * like, and it is not an afterthought". Site Copy v3, Part A §3, decides
 * otherwise — "Window content: the demo brand's published hub, in English" —
 * and in the hero, where this is the first picture of the product anyone
 * sees, a screen the reader cannot read is the worse trade.
 *
 * It is the same brand either way. Nakhla is a coffee roaster in both
 * editions; only the script it writes in changes, which is the product's
 * own claim demonstrated rather than stated.
 *
 * The strings moved to `content/mocks.ts` with the other five mocks, for
 * the reason that file's header gives: a word on the page in a string
 * literal is a word that never gets translated.
 */

/* The client's palette, sampled from the reference. Local to the mock on
   purpose: these are one fictional brand's colours, not the site's, and
   nothing outside this file should be able to reach them. They do not
   change with the language — a brand's colours are not words. */
const BRAND = {
  cream: "#f3e9dc",
  green: "#2f5d50",
  gold: "#c9a227",
  brown: "#6b3e26",
};

export function BrandHub({ locale }: { locale: Locale }) {
  const { t, dir, lang } = mockCopy(locale);
  const h = t.hub;
  return (
    /*
     * The frame is LTR and the page inside it is RTL.
     *
     * A browser's own chrome does not mirror because the document inside it
     * does — the traffic lights stay where the operating system puts them. So
     * the title bar inherits the page's direction and the viewport below it
     * states its own.
     */
    <div className="mk-card overflow-clip text-start" dir="ltr">
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-[var(--hairline)] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-[var(--track)]" />
          <span className="size-2 rounded-full bg-[var(--track)]" />
          <span className="size-2 rounded-full bg-[var(--track)]" />
        </div>

        <span className="mx-auto rounded-[var(--mk-r-status)] bg-[var(--surface-2)] px-3 py-1 text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
          {h.url}
        </span>

        {/* The product's own language toggle, inert — it is part of the
            picture, not a control on this page. */}
        <div
          aria-hidden="true"
          className="flex items-center gap-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-2)] p-0.5 text-[length:var(--fs-eyebrow)] font-medium"
        >
          <span className="rounded-[var(--radius-pill)] px-2 py-0.5 text-[var(--text-muted)]">
            EN
          </span>
          <span
            className="rounded-[var(--radius-pill)] bg-[var(--surface-3)] px-2 py-0.5 text-[var(--text)]"
            // §9: Arabic in a mock is set in Thmanya Sans, which is what
            // `--font-arabic` resolves to. `--font-plex-arabic` is the fallback
            // behind it, not the face.
            style={{ fontFamily: "var(--font-arabic)" }}
          >
            ع
          </span>
        </div>
      </div>

      {/* The hub itself */}
      <div dir={dir} lang={lang} className="grid grid-cols-[9rem_1fr] text-[0.75rem]">
        <nav className="border-s border-[var(--hairline)] p-4" aria-label={h.name}>
          <p className="mb-4 flex items-center justify-between gap-2 font-medium text-[var(--text)]">
            {h.name}
            <span
              className="grid size-5 place-items-center rounded-full text-[length:var(--fs-eyebrow)] font-medium"
              style={{ background: BRAND.brown, color: BRAND.cream }}
            >
              {h.initial}
            </span>
          </p>

          <ul className="space-y-0.5">
            {h.nav.map((label) => (
              <li key={label}>
                <span
                  className={
                    "block rounded-[var(--mk-r-status)] px-2 py-1.5 " +
                    (label === h.activeNav
                      ? "bg-[var(--surface-3)] text-[var(--text)]"
                      : "text-[var(--text-muted)]")
                  }
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-5">
          <p className="text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
            {h.breadcrumb}
          </p>
          <p className="mt-2 text-[length:var(--fs-lead)] font-medium text-[var(--text)]">
            {h.title}
          </p>
          <p className="mt-1 text-[var(--text-muted)]">{h.lead}</p>

          {/*
           * Four specimen tiles. In RTL the first child is the rightmost, so
           * the order here reads the way the reference shows it: the primary
           * lockup on the right, the type specimen on the left.
           */}
          <ul className="mt-4 grid grid-cols-4 gap-2.5">
            <Specimen caption={h.captions.lockup}>
              <div
                className="grid h-full w-full place-items-center"
                style={{ background: BRAND.cream }}
              >
                <span
                  className="border border-dashed px-3 py-1 text-[0.875rem] font-medium"
                  style={{ color: BRAND.brown, borderColor: `${BRAND.brown}66` }}
                >
                  {h.name}
                </span>
              </div>
            </Specimen>

            <Specimen caption={h.captions.symbol}>
              <div
                className="grid h-full w-full place-items-center"
                style={{ background: BRAND.brown }}
              >
                <span
                  className="grid size-7 place-items-center rounded-full text-[0.75rem] font-medium"
                  style={{ background: BRAND.cream, color: BRAND.brown }}
                >
                  {h.initial}
                </span>
              </div>
            </Specimen>

            <Specimen caption={h.captions.colour}>
              <div className="flex h-full w-full">
                {[BRAND.cream, BRAND.green, BRAND.gold, BRAND.brown].map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
            </Specimen>

            <Specimen caption={h.captions.type}>
              <div className="flex h-full w-full flex-col justify-between bg-[var(--surface-1)] p-2.5">
                <span className="text-end text-[length:var(--fs-d3)] font-medium leading-none text-[var(--text)]">
                  {h.specimenGlyph}
                </span>
                <span className="text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
                  {h.specimenLine}
                </span>
              </div>
            </Specimen>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Specimen({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <div className="h-20 overflow-clip rounded-[var(--mk-r-button)] border border-[var(--hairline)]">
        {children}
      </div>
      <p className="mt-2 text-center text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">{caption}</p>
    </li>
  );
}
