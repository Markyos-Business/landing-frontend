import type { Cta } from "../types";
import type { FeatureId } from "@/lib/status";

/*
 * The page contract.
 *
 * ── Why the subpages are data and the homepage is components ───────────────
 *
 * The homepage has eighteen sections and every one of them is its own
 * argument, with its own layout, its own product mock and its own reason to
 * exist. It earns bespoke components.
 *
 * The thirty-odd pages under it do not. Read `docs/copy/pages_ar_*.md` end to
 * end and the same nine or ten shapes repeat: a hero, a problem stated in
 * three paragraphs, an ordered list of solutions each with a link, a
 * comparison table, a definition list, an FAQ, a closing CTA. Written as
 * components that would be thirty files that drift apart — the fifth one
 * would round a card differently and nobody would notice for a month.
 *
 * So they are data, and the blocks below are the only vocabulary available.
 * Three things follow from that, and they are the whole reason for it:
 *
 *   - A new page is a content file, not a component. The design cannot drift
 *     because there is nowhere for it to drift to.
 *   - Translating the site is translating data. The English edition is
 *     another file with the same shape, not thirty rebuilt pages — which is
 *     exactly what was asked for: Arabic now, English from it later.
 *   - Status chips stay honest. A block names a `feature` id and the chip is
 *     resolved from `lib/status.ts`, so a page cannot hard-code "coming
 *     spring 2027" and then keep saying it after it ships.
 *
 * When a page genuinely needs something this cannot express, add a block —
 * don't reach for a one-off class. That is the same rule `docs/DESIGN.md`
 * sets for the design vocabulary, for the same reason.
 */

/**
 * A table cell.
 *
 * A bare string is the common case. The object form exists because the source
 * documents put three other things in cells: a status chip (so the cell is a
 * feature id, not a label), an emphasised value in a plan column, and a
 * deliberately empty cell — which is `{}` rather than `""` so that "nothing
 * here" is distinguishable from "not written yet" when reading the data.
 */
export type Cell =
  | string
  | {
      text?: string;
      /** Resolves to a status chip via lib/status.ts. Never a literal label. */
      feature?: FeatureId;
      /** The cell is the point of its row — a price, a recommended plan's limit. */
      strong?: boolean;
    };

/** A `**term** — line` pair, which the source documents use constantly. */
export type TermItem = {
  term: string;
  body?: string;
  feature?: FeatureId;
  cta?: Cta;
};

export type PlanCard = {
  name: string;
  /** Rendered as written: "24 دولاراً" or "مجاناً". Never computed. */
  price: string;
  /** "شهرياً" — the unit under the figure. */
  period?: string;
  /** The annual equivalent, shown as a second line. */
  annual?: string;
  /** One line on who the plan is for. */
  who?: string;
  rows: { label: string; value: string; strong?: boolean }[];
  cta?: Cta;
  /** Set when the plan itself has not shipped: the CTA becomes a chip. */
  feature?: FeatureId;
  recommended?: boolean;
};

export type CardItem = {
  title: string;
  body?: string;
  /** A short list under the body — "أهم ما ستجده". */
  bullets?: string[];
  cta?: Cta;
  feature?: FeatureId;
  /** A last line set apart by a rule, for a caveat or a price. */
  note?: string;
};

export type PageBlock =
  /** The page opener. One per page, first. */
  | {
      kind: "hero";
      eyebrow?: string;
      title: string;
      lead?: string;
      buttons?: Cta[];
      links?: Cta[];
      /** Microcopy under the buttons. */
      note?: string;
      feature?: FeatureId;
    }
  /** A heading and prose. The workhorse. */
  | {
      kind: "prose";
      id?: string;
      eyebrow?: string;
      title?: string;
      body?: string[];
      align?: "split" | "start" | "center";
      /** The closing paragraph carries the point, so it is set in page ink. */
      emphasiseLast?: boolean;
      cta?: Cta;
      links?: Cta[];
    }
  /** An ordered list of solutions, each with its own heading and link. */
  | {
      kind: "numbered";
      id?: string;
      eyebrow?: string;
      title?: string;
      lead?: string;
      items: {
        title: string;
        body: string[];
        cta?: Cta;
        feature?: FeatureId;
      }[];
    }
  /** A definition list: `**term:** line`. */
  | {
      kind: "terms";
      id?: string;
      eyebrow?: string;
      title?: string;
      lead?: string;
      cols?: 1 | 2 | 3;
      items: TermItem[];
      note?: string;
    }
  /** A grid of cards. */
  | {
      kind: "cards";
      id?: string;
      eyebrow?: string;
      title?: string;
      lead?: string;
      cols?: 2 | 3 | 4;
      items: CardItem[];
      note?: string;
    }
  /** A real table, with a scrollable region on narrow screens. */
  | {
      kind: "table";
      id?: string;
      eyebrow?: string;
      title?: string;
      lead?: string;
      head?: Cell[];
      rows: Cell[][];
      /** First column is a row header — `<th scope="row">`. Default true. */
      rowHeaders?: boolean;
      /** A full-width heading row inside the body, for grouped comparisons. */
      note?: string;
      /** Centre every column but the first — right for figures, wrong for prose. */
      numeric?: boolean;
    }
  /** A numbered rail: step, then what happens. */
  | {
      kind: "steps";
      id?: string;
      eyebrow?: string;
      title?: string;
      lead?: string;
      items: { title?: string; body: string }[];
      note?: string;
    }
  /** A single statement set apart from the page. */
  | {
      kind: "callout";
      id?: string;
      title?: string;
      body: string[];
      cta?: Cta;
      feature?: FeatureId;
    }
  | {
      kind: "faq";
      id?: string;
      title?: string;
      items: { q: string; a: string; feature?: FeatureId }[];
    }
  /** Pricing cards. */
  | {
      kind: "plans";
      id?: string;
      eyebrow?: string;
      title?: string;
      lead?: string;
      recommendedLabel: string;
      plans: PlanCard[];
      note?: string;
    }
  /** Email capture. Posts to /api/waitlist, which is honest about being 501. */
  | {
      kind: "signup";
      id?: string;
      title?: string;
      lead?: string;
      placeholder: string;
      submit: string;
      note?: string;
      topic: string;
    }
  /** The closing call to action. One per page, last. */
  | {
      kind: "cta";
      id?: string;
      title?: string;
      lead?: string;
      buttons?: Cta[];
      links?: Cta[];
      note?: string;
    };

export type Breadcrumb = { label: string; href: string };

export type PageDoc = {
  /** Route below the locale segment, with a leading slash. */
  path: string;
  /** <title>. From the source document's "SEO title" row. */
  title: string;
  /**
   * The page's name in a breadcrumb trail and a structured-data graph.
   *
   * Separate from `title` because an SEO title is a sentence — "ماركيوس
   * للاستوديوهات · أدِر مشاريع العلامات من الاستبيان حتى التسليم" — and a
   * breadcrumb needs two words. Falls back to `title` when they are the same.
   */
  shortTitle?: string;
  /** <meta description>. From the source document's own row. */
  description: string;
  breadcrumbs?: Breadcrumb[];
  blocks: PageBlock[];
  /**
   * Keep the page out of the index.
   *
   * For the legal frames, which carry a real plain-language summary but no
   * legal text yet, and for anything else that would rank for a term and then
   * disappoint. A page that drops this becomes indexable and enters the
   * sitemap in the same edit — see lib/pages/registry.ts.
   */
  noindex?: boolean;
  /** Sitemap priority. Audience and solution pages earn more than legal. */
  priority?: number;
};
