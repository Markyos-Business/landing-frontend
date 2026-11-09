import { Words, wordCount } from "@/components/ui/Words";
import type { CSSProperties, ReactNode } from "react";
import type { SiteCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/*
 * What more than one block renderer needs: the render context, the bidi
 * span, the CTA row, the accented headline and the caveat note. The
 * reasoning for the renderers as a whole is in `./index.tsx`.
 */

export type Ctx = {
  locale: Locale;
  chips: SiteCopy["chips"];
};

/** A string from the copy, in its own resolved direction. */
export function T({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`mk-bidi ${className}`}>{children}</span>;
}

export function Buttons({
  buttons,
  links,
  locale,
  align = "start",
  tone = "page",
}: {
  buttons?: { label: string; href: string }[];
  links?: { label: string; href: string }[];
  locale: Locale;
  /*
   * Passed straight through to each button. The variants are unchanged on the
   * closing panel — first loudest, second equal, the rest signposts — and only
   * the fills invert; see the tone table in `components/ui/Button.tsx`.
   */
  tone?: "page" | "deep";
  align?: "start" | "center";
}) {
  if (!buttons?.length && !links?.length) return null;

  /*
   * Two buttons and nothing else is the studio/company fork — the same choice
   * the homepage opens and closes on — so it gets the same object: one pair,
   * both pills sized to the wider label. See `.mk-doors`. Any other shape
   * (one button, a button plus signposts) stays a wrapping row.
   */
  const doors = buttons?.length === 2 && !links?.length;

  return (
    <div
      className={
        doors
          ? "mk-doors"
          : `flex flex-wrap items-center gap-x-5 gap-y-3 ${
              align === "center" ? "justify-center" : ""
            }`
      }
    >
      {buttons?.map((cta, i) => (
        <Button
          key={cta.href + cta.label}
          cta={cta}
          locale={locale}
          // The first button is the page's one job. A second button of equal
          // weight is the studio/company fork, which genuinely is two equal
          // jobs — anything after that is a signpost and is set as one.
          // In a door pair both are solid: the homepage makes that choice for
          // the same reason, that marking one primary tells half the audience
          // they are the wrong half.
          variant={doors ? "solid" : i === 0 ? "solid" : i === 1 ? "outline" : "link"}
          tone={tone}
        />
      ))}
      {links?.map((cta) => (
        <Button key={cta.href + cta.label} cta={cta} locale={locale} variant="link" tone={tone} />
      ))}
    </div>
  );
}

/*
 * A page headline's closing clause, in blue.
 *
 * The homepage opens on "Your whole brand in one place. / From the first
 * question to the last post." — the subject in ink, the claim in blue — and it
 * is the thing a visitor recognises when they land on any other page. These
 * pages' headlines are written the same way, as two sentences where the second
 * is the payoff: "Built in Arabic. Not translated into it.", "Start free. And
 * pay when you see the result."
 *
 * Split on a sentence terminator with text after it, and only on one: a comma
 * inside a single sentence is a clause boundary too, but accenting from there
 * cuts a sentence in half, and a third of these headlines are one sentence
 * with commas in it. A headline with no terminator — every legal page, "Ten
 * projects, ten clients, one place." — renders unchanged, so there is no
 * headline this can break, only ones it declines to touch.
 */
/*
 * ── The words resolve, which they did not until now ──────────────────────
 *
 * `.mk-words` is this site's kinetic heading and it was on the homepage
 * only. Thirty data-driven pages opened on a headline that was the one
 * thing on the screen which never moved — and that is most of what "the
 * page looks plain" means when the first thing a reader meets is a wall of
 * static type.
 *
 * The accent clause does *not* resolve word by word, and that is forced
 * rather than chosen: `.mk-accent-clause` paints its blue through
 * `background-clip: text` with a transparent colour, so the glyphs
 * themselves paint nothing and fading the words inside it fades nothing at
 * all. It arrives as one phrase instead, placed after the words above it by
 * `--i`, which is what `.mk-word-at` exists for. The same pair the
 * homepage's `Words` and `Accent` have always used.
 */
/*
 * Where the headline hands over to its blue clause.
 *
 * A sentence break first, which is how most of these are written: "ابدأ
 * مجاناً. | وادفع حين ترى النتيجة."
 *
 * Then a comma, which is the case this missed. Eleven of the twenty-five
 * hero titles have no internal sentence break, and three of those are plainly
 * two clauses joined by one — including /solutions' own "من يصنع العلامة،
 * ومن يعيش معها." So the page the brand's most recognisable device was most
 * wanted on rendered its headline in flat ink.
 *
 * The *last* comma, so the blue is the closing phrase rather than everything
 * after the first pause in a three-part line. `c > 0` keeps a leading comma
 * from producing an empty head, and the tail has to be worth colouring.
 *
 * The Latin comma is deliberately not in the set. No English hero exists yet
 * — `/en` for these pages serves the untranslated notice — and when one does,
 * an English enumeration would hand its last item to the accent. A sentence
 * break still works there; this fallback stays Arabic until there is a line
 * to test it against.
 */
function splitTitle(title: string): [string, string] | null {
  const at = title.search(/[.؟?!](?=\s*\S)/u);
  if (at !== -1) return [title.slice(0, at + 1), title.slice(at + 1).trimStart()];

  const c = title.lastIndexOf("،");
  if (c > 0 && c < title.length - 2) {
    return [title.slice(0, c + 1), title.slice(c + 1).trimStart()];
  }
  return null;
}

export function AccentedTitle({ title, load = false }: { title: string; load?: boolean }) {
  const split = splitTitle(title);
  if (!split) return <Words load={load}>{title}</Words>;

  const [head, tail] = split;
  return (
    <>
      <Words load={load}>{head}</Words>{" "}
      <span
        className={`mk-accent-clause mk-word-at${load ? " mk-word-at-load" : ""}`}
        style={{ "--i": wordCount(head) } as CSSProperties}
      >
        {tail}
      </span>
    </>
  );
}

/*
 * The caveat under a section.
 *
 * Seven blocks carry a `note` and each used to render it as a muted
 * paragraph with its own hand-set margin — four different margins between
 * them, which is how a shared vocabulary drifts. It is one object now; the
 * design is `.mk-note` in globals.css and the reasoning for it is there.
 *
 * The glyph is a sibling of the paragraph rather than a child of it, for the
 * bidi reason given beside the CSS: an inline-flex box inside a <p> is
 * atomic, and a paragraph whose only content is atomic has no strong
 * character to resolve its own direction from.
 */
export function Note({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mk-note ${className}`}>
      <span className="mk-note-mark" aria-hidden="true">
        <Icon name="info" size={15} />
      </span>
      <p className="mk-bidi">{children}</p>
    </div>
  );
}
