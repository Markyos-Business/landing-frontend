import type { SignupTopic } from "@/lib/waitlist";
import type { ContactTopic } from "@/lib/contact";
import type { Cta } from "../types";
import type { FeatureId } from "@/lib/status";
import type { IconName } from "@/components/ui";
import type { MockName } from "@/components/public/mock/registry";

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
 *     resolved from `src/lib/status.ts`, so a page cannot hard-code "coming
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
      /** Resolves to a status chip via src/lib/status.ts. Never a literal label. */
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
  /**
   * A DOM id for the card, so something else on the page can point at it.
   *
   * Only the chooser uses it: a chip answers "how many clients at once?" and
   * the card it names is the one that lights up. It has to be unique across
   * the whole document and not just the block, because the free plan appears
   * in all three audience panels and every panel is in the HTML — so these are
   * written as `plan-<audience>-<plan>` by whoever builds both ends.
   */
  id?: string;
  name: string;
  /**
   * The amount, rendered as written. Absent when the figure is unknown: the
   * current plans come from the backend (`/billing/plans/`), and a page built
   * while it was unreachable shows the plan without inventing a number.
   */
  price?: string;
  /** "شهرياً" — the unit under the figure. */
  period?: string;
  /**
   * The same plan billed yearly.
   *
   * It used to be one prose line under the price — "19 دولاراً شهرياً
   * بالاشتراك السنوي" — which told a reader the annual rate existed and then
   * made them do the comparison themselves, across four cards, in their head.
   * Split into its own amount so the billing switch above the grid can show
   * one rate or the other, and `note` carries what the figure does not say
   * ("يُدفع سنوياً"). Both are written, never computed, like `price`.
   *
   * A plan with no annual rate — free, or a contract — simply keeps showing
   * its own price when the switch is on yearly, which is the truth about it.
   */
  annual?: { price: string; note?: string };
  /** One line on who the plan is for. */
  who?: string;
  /**
   * The two sentences that decide a plan, from copy deck v4.3.
   *
   * A price and a list of limits answer "what do I get"; they do not answer
   * "is this one mine", which is the only question a visitor on this page
   * actually has. `pick` is the condition that makes this the right card and
   * `moveUp` is the condition that ends it — so a reader can run down one
   * column and stop at the first card whose `pick` describes them.
   *
   * Their labels are the block's, not the card's: eleven cards would
   * otherwise carry eleven copies of the same two words.
   */
  pick?: string;
  moveUp?: string;
  rows: { label: string; value: string; strong?: boolean }[];
  /** What the plan includes, as a checklist under the rows. */
  features?: string[];
  cta?: Cta;
  /** Set when the plan itself has not shipped: the CTA becomes a chip. */
  feature?: FeatureId;
  recommended?: boolean;
};

export type CardItem = {
  title: string;
  body?: string;
  /**
   * A glyph above the title, on a tinted tile.
   *
   * Optional and off by default, because most card grids on this site are
   * prose — a claim and a paragraph — and an icon over a claim is decoration.
   * It earns its place on a grid that is a *directory*: /resources lists six
   * places to go, and a reader scanning six destinations is helped by six
   * different shapes. Set it for a whole grid or for none of it; half a grid
   * with icons reads as a grid with something missing.
   */
  icon?: IconName;
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
      /**
       * Centre the heading over the table.
       *
       * For a section that answers a switch: the control is centred, so a
       * heading on the start edge below it reads as two unrelated things. The
       * homepage's comparison table centres its head over a full-width table
       * for the same reason. Default `start`.
       */
      align?: "start" | "center";
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
  /*
   * A dated offer, with the clock on it.
   *
   * Every other block here is true whenever it is read. This one stops being
   * true at a stated instant, which is why it is its own kind rather than a
   * `callout` with a date typed into its body: the block carries `opens` and
   * `closes` as machine-readable instants, and the renderer is what decides
   * whether a reader sees "opens in", "ends in", or that it is over.
   *
   * `window` is not decoration either. The countdown is a client component --
   * it cannot run on the server without the server's clock disagreeing with
   * the reader's and tearing hydration apart -- so the server sends the
   * window as a sentence and the live figures replace it on mount. A reader
   * with no JavaScript, and a crawler, get the two dates in words. That is
   * also what keeps a page built in December from promising anything in
   * March: the sentence names an end date, and the timer that would claim
   * time remaining never starts.
   *
   * `rows` are written by the content file and derived there from
   * CURRENT_PRICES, so the discounted figures cannot drift from the prices
   * check:pricing guards.
   */
  | {
      kind: "offer";
      id?: string;
      eyebrow?: string;
      title: string;
      lead?: string;
      /** ISO instants. The renderer compares the reader's clock to these. */
      opens: string;
      closes: string;
      /** The two dates as a sentence, for the server render and for no-JS. */
      window: string;
      countdown: {
        /** Before `opens`. */
        before: string;
        /** Between `opens` and `closes`. */
        during: string;
        /** After `closes`, in place of the whole offer. */
        after: string;
        units: { days: string; hours: string; minutes: string; seconds: string };
      };
      rowHead?: [string, string, string];
      rows?: { label: string; was: string; now: string }[];
      terms?: string[];
      cta?: Cta;
    }
  /** Pricing cards. */
  | {
      kind: "plans";
      id?: string;
      eyebrow?: string;
      title?: string;
      lead?: string;
      /** Centre the heading over the cards — see the note on `table`. */
      align?: "start" | "center";
      recommendedLabel: string;
      /**
       * The monthly/yearly switch above the grid.
       *
       * Omitted when no plan in the block has an annual rate — a switch over
       * four cards that all ignore it is a control that does nothing.
       */
      billing?: { label: string; monthly: string; annual: string };
      /** The two headings for every card's `pick` and `moveUp`. */
      labels?: { pick: string; moveUp: string };
      plans: PlanCard[];
      note?: string;
    }
  /*
   * One question, and the card that answers it.
   *
   * Copy deck v4.3 added this because the page it describes has eleven plans
   * in it. A visitor who has already said which of the three audiences they
   * belong to still faces three to five cards, and the thing that decides
   * between them is never the price — it is one fact about how they work:
   * how many clients at once, how many people on the team, how many brands
   * and editors. So the page asks that one question, in the tab, above the
   * cards, and the answer lights the card.
   *
   * It is not navigation and it is not a filter: nothing is hidden, and a
   * reader who ignores it sees exactly the page they would have seen anyway,
   * with the recommended card already lit. Each option names a `target`:
   * either a `PlanCard.id` in the same panel, or `tab:<audience>` for the
   * answer that means "you are on the wrong tab" — the deck's "others work
   * with me", which belongs on the studios tab rather than anywhere on this
   * one.
   */
  | {
      kind: "chooser";
      id?: string;
      /** The question itself, set as the section's heading. */
      title: string;
      lead?: string;
      /** Names the group of chips for a screen reader. */
      label: string;
      options: { label: string; target: string; note?: string }[];
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
      topic: SignupTopic;
    }
  /*
   * A message, sent to a real inbox.
   *
   * ── Why this is not the `signup` block with more fields ─────────────────
   *
   * `signup` captures an address for a list that does not exist yet, so it
   * posts to `/api/waitlist` and that route answers 501 on purpose. /contact
   * used it, which meant the page that says "a small team, and we read every
   * message" offered one email box and a Send that could not succeed.
   *
   * A message is a different object with a different fate: it has a
   * destination today, it is sent rather than stored, and the only thing the
   * reader wants back is confirmation that it arrived. Four fields, posted to
   * `/api/contact`, which sends and reports honestly when it cannot — see
   * that route's header.
   *
   * `topic` is the fallback only. Six `/contact?topic=…` links already exist
   * across the copy and the one in the URL wins, so a reader who clicked
   * "report a vulnerability" finds the topic already chosen.
   */
  | {
      kind: "contact";
      id?: string;
      title?: string;
      lead?: string;
      /** The topic selected when the URL names none. Defaults to `other`. */
      topic?: ContactTopic;
      /** The button's word, when the page wants its own. */
      submit?: string;
      /** A last line under the form — what to expect, or where else to go. */
      note?: string;
    }
  /**
   * Two audiences, one place on the page.
   *
   * Several pages say the same thing twice — once for studios and freelancers,
   * once for companies — and stacking both made /pricing 10,700px tall, with
   * four of its eleven sections being two parallel ladders and two parallel
   * eleven-row comparison tables. A reader only ever wants one of them, and had
   * to scroll past the other to reach the FAQ.
   *
   * So the two runs become one switch. Both panels are rendered into the HTML
   * and only one is shown, which keeps the whole page crawlable and keeps the
   * copy in one file; `options[0]` is what a reader without JavaScript sees.
   *
   * Each option's `id` doubles as a deep link: `/pricing#companies` opens on
   * the companies panel. The blocks inside an option drop their own `id` and
   * `eyebrow` — the switch is the eyebrow now, and an anchor into a hidden
   * panel scrolls to nothing.
   */
  | {
      kind: "audience";
      /** The id the switch itself carries, for the nav and the hero's links. */
      id?: string;
      eyebrow?: string;
      title?: string;
      lead?: string;
      /** Accessible name for the group — "who are you", not "pricing". */
      label: string;
      /**
       * A query parameter that names the options, for a link somebody shares.
       *
       * `"for"` on /pricing, so copy deck v4.3's `/pricing?for=studios` opens
       * on studios and every pick writes itself back into the address bar. Omit
       * it and the switch is hash-only, which is what /platform wants: its two
       * tool tables are not something anybody sends to a colleague.
       */
      param?: string;
      options: { id: string; label: string; blocks: PageBlock[] }[];
    }
  /*
   * The feature, as it looks in the product.
   *
   * Every page under /solutions argues for one thing at length and, until
   * now, showed it never. Six pictures of the product already existed and
   * were used only on the homepage — where each feature gets a paragraph —
   * while the page devoted to that same feature had two thousand words and
   * no screen. This block puts the picture on the page that earned it.
   *
   * `mock` names a view in `src/components/public/mock/registry.tsx` rather than
   * importing one, because a content file is data. Same indirection as
   * `icon`, for the same reason.
   *
   * The head is centred and the frame is lifted over a pool of the brand's
   * light, which is the one place these pages use the homepage's full
   * vocabulary: a product shot is the thing a section is about, and §8 says
   * that is what a light pool marks.
   */
  | {
      kind: "showcase";
      id?: string;
      eyebrow?: string;
      title: string;
      lead?: string;
      mock: MockName;
      /** One line under the frame, naming what the picture is of. */
      caption?: string;
    }
  /*
   * Nine solutions, one at a time, with the product behind each.
   *
   * /solutions listed them in a three-column table — name, line, who it is
   * for — which is the right *content* and the wrong object: a reader
   * arriving at the hub is choosing, and a table is for comparing things you
   * have already chosen between. Nine rows of text also meant the hub was
   * the one page in this set that still showed nothing of the product.
   *
   * So the same nine rows are a control now. Pick one and its real screen
   * appears beside it — the same `src/components/public/mock/` views the nine detail
   * pages use, so the hub shows what the product looks like before asking
   * anybody to click into it.
   *
   * Every panel is rendered on the server and all but one is `hidden`, the
   * trade AudienceTabs makes and for the same reasons: the page stays
   * crawlable, and without JavaScript it is the first solution plus nine
   * links rather than a control that does nothing.
   */
  | {
      kind: "explorer";
      id?: string;
      eyebrow?: string;
      title: string;
      lead?: string;
      /** Names the control — "choose a solution", not "solutions". */
      label: string;
      items: {
        title: string;
        /** The one line the table carried in its second column. */
        line: string;
        /** Who it is for — the table's third column. */
        audience: string;
        icon: IconName;
        mock: MockName;
        cta: Cta;
      }[];
    }
  /*
   * Three kinds of people, one platform, nine solutions.
   *
   * /solutions opens on a headline and a paragraph and then asks the reader
   * to choose, which is a lot of choosing to do from prose. This is the
   * choice as a picture: the three audiences above, the mark at the waist,
   * and the nine solutions fanning out below, with the rule between them
   * drawing itself as the section arrives.
   *
   * ── Why it is boxes and not a drawing ────────────────────────────────
   *
   * The homepage's ecosystem funnel is inline SVG and had to be — six
   * bezier curves that leave one node vertically and arrive at another
   * vertically cannot be built from boxes, which is the exemption that file
   * carries. This diagram's geometry is three straight runs and a row of
   * stubs, so it needs no curve, no exemption, and no second way of drawing
   * things on this site.
   *
   * ── Why it is `aria-hidden` ──────────────────────────────────────────
   *
   * Everything in it is said again, in order, immediately below: the three
   * audiences are the three cards, and the nine solutions are the nine tabs
   * of the explorer. A screen-reader user gets one clean pass through the
   * page instead of twelve unlabelled nodes and then the same twelve as
   * controls.
   */
  | {
      kind: "web";
      id?: string;
      /** The three who make a brand or live with it. */
      from: { label: string; icon: IconName }[];
      /** The nine solutions, short enough to be a chip. */
      to: string[];
    }
  /**
   * A section whose figures are the backend's current plans.
   *
   * The copy is here; the prices and limits are not. The block renderer reads
   * `/billing/plans/` and turns this into a `plans` or `table` block with
   * `resolvePriced` (content/current-pricing.ts), so the site never keeps a
   * second copy of what the app charges.
   */
  | {
      kind: "priced";
      id?: string;
      /** `plans`: the three account cards. `compare`: free vs each type. `audience`: free vs one type. */
      part: "plans" | "compare" | "audience";
      /** Which account type an `audience` table is about. */
      type?: "freelancer" | "studio" | "company";
      title?: string;
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

/**
 * How a page sets its section headings.
 *
 * `start` is the site's default and what the thirty-odd pages were built
 * with: a heading at the reading edge with its table or its cards beneath.
 *
 * `center` is what the nine pages under /solutions use. They are the longest
 * pages here — five to eight thousand pixels of one argument — and every
 * section opened the same way, at the same edge, in the same size, so a
 * reader scrolling could not tell where one ended and the next began. A
 * centred head is a full stop: it breaks the column, gives the eye something
 * to land on, and it is what the design reference does on a page this long.
 *
 * It moves the *heading* only. Prose stays at the reading edge, because
 * centred body copy at sixty characters gets harder to read with every line,
 * and the FAQ keeps its own sticky two-column head.
 */

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
   * sitemap in the same edit — see src/lib/pages/registry.ts.
   */
  noindex?: boolean;
  /** Sitemap priority. Audience and solution pages earn more than legal. */
  priority?: number;
};
