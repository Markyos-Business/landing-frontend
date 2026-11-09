import type { ReactNode } from "react";

/*
 * The card, and the pieces that go inside one.
 *
 * The reference builds almost the whole page out of this one object: a
 * gradient fill, a 1px edge, 16px radius, 32px of padding. Eight step cards,
 * three pain cards, three plan cards, three roadmap cards, four promise cards.
 * Keeping them one component is the only reason a page of thirty cards lines
 * up — and the only reason changing the card changes all of them.
 *
 * The visual definition lives in app/globals.css under `.mk-card`, not here,
 * so that a card rendered by the CMS rich-text renderer or by a page outside
 * this component tree looks identical without importing React.
 */

export function Card({
  children,
  className = "",
  pad = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Off when the card's content needs to reach its edges — a table, a grid
      of thumbnails, a product mock that bleeds. */
  pad?: boolean;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag className={`mk-card${pad ? " mk-card-pad" : ""} ${className}`}>{children}</Tag>
  );
}

/**
 * A card's title.
 *
 * Defaults to a <p> rather than a heading, deliberately. Most cards on this
 * page are items in a list of parallel things, not sections of the document —
 * a grid of four AI promises is one idea, not four. Pass `as` where a card
 * really is a section of the argument, which on this page is the eight steps
 * of the studio path and the five parts of the company path.
 */
export function CardTitle({
  children,
  as: Tag = "p",
  id,
  className = "",
}: {
  children: ReactNode;
  /*
   * `h2` is here because a card grid is sometimes the first thing under the
   * page's own <h1>, with no section heading between them. The level has to
   * follow the outline in that case; `mk-h3` keeps the size either way.
   */
  as?: "p" | "h2" | "h3" | "h4";
  id?: string;
  className?: string;
}) {
  return (
    <Tag id={id} className={`mk-h3 mk-bidi ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * A panel recessed into a card.
 *
 * Drops to the canvas colour rather than lifting — inside an already-raised
 * surface that is the only direction left that still reads. See `.mk-inset`.
 */
export function Inset({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mk-inset ${className}`}>{children}</div>;
}
