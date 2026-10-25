import type { ChipKey, FeatureId } from "@/lib/status";

/*
 * The copy contract.
 *
 * Page copy is typed data, not strings scattered through JSX. Three reasons,
 * all of them things that bite a bilingual marketing site specifically:
 *
 *   1. `check:locales` can prove the Arabic has the same shape as the English.
 *      A missing Arabic FAQ answer becomes a build-time report rather than a
 *      blank region that nobody who reads English will ever scroll past.
 *   2. Copy can be reviewed and transcreated without opening a component, and
 *      a component can be restyled without touching a word of approved copy.
 *   3. Structure is enforced. The problem section has exactly three pain
 *      cards because the type says three, so a fourth cannot be added without
 *      a deliberate decision about what it does to the layout.
 *
 * Section numbers below map to markyos_landing_page_copy.md §4.
 */

/** A feature mention that may carry a status chip. See lib/status.ts. */
export type ChippedItem = {
  feature: FeatureId;
  headline: string;
  body: string;
};

export type Cta = {
  label: string;
  /** Route below the locale, or an absolute URL for the app hand-off. */
  href: string;
};

// ── Chrome ──────────────────────────────────────────────────────────────────

/** A plain link, in the header, a dropdown or the footer. */
export type NavLink = { label: string; href: string };

/**
 * One audience column in the Solutions mega menu.
 *
 * Three of them — studios, freelancers, companies. Freelancers get a column
 * of their own even though they sign up as a Studio workspace, because they
 * buy for a different reason: a freelancer wants to look senior, a studio
 * wants control over many projects. Several of the solutions are therefore
 * the same page named twice, by the benefit each audience feels. See
 * markyos_solutions_menu.md §3.4.
 */
export type NavGroup = {
  /** The audience. */
  heading: string;
  /** One line naming their job. */
  line: string;
  /**
   * Up to four solutions, in priority order for this audience.
   *
   * Four, and the rule for which four is in the menu spec §2.1: only
   * solutions rated Critical or High for that audience, available at launch.
   * Everything else lives on the audience page. A menu that lists everything
   * is a sitemap, and a sitemap does not answer "is this for me?".
   */
  items: { title: string; line: string; href: string }[];
  /** "See everything for studios →" */
  more: NavLink;
};

export type NavItemCopy = {
  label: string;
  href: string;
  /** A simple dropdown — a list of links and nothing else. */
  links?: NavLink[];
  /** A mega menu. Mutually exclusive with `links`. */
  groups?: NavGroup[];
  /** The strip along the bottom of a mega menu. */
  strip?: NavLink[];
};

export type NavCopy = {
  items: NavItemCopy[];
  login: string;
  startFree: string;
  /** Accessible name for the language switcher. */
  languageLabel: string;
  /** Accessible name for the phone menu button. */
  menuLabel: string;
  /**
   * The first tab stop on every page.
   *
   * Here rather than in the layout because it is a word on the page, and
   * a word on the page in an English string literal is a word that never
   * gets translated — which is exactly what happened: the Arabic homepage
   * opened with an English instruction, read out to the one person who
   * most depends on it.
   */
  skipToContent: string;
};

export type FooterCopy = {
  columns: { heading: string; links: { label: string; href: string }[] }[];
  /** The closing line: "Markyos. Every asset. Every instruction. Both directions." */
  line: string;
  legal: { label: string; href: string }[];
};

export type AnnouncementCopy = {
  /** Post-launch version. */
  live: { text: string; cta: Cta };
  /** Pre-launch beta version, with the real beta sizes. §4 announcement bar. */
  beta: { text: string; cta: Cta };
};

// ── §4.1 Hero, §4.20 Final CTA ──────────────────────────────────────────────

export type HeroCopy = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  studioCta: Cta;
  companyCta: Cta;
  microcopy: string;
  /**
   * The pre-launch version of the ask (§6.3).
   *
   * Before 15 Feb 2027 there is no free plan to start, so "Start free" is a
   * promise the product cannot keep — the ask is a beta application. Only the
   * CTAs and the microcopy change; the headline and subheadline are true in
   * both phases, which is why they are not duplicated here.
   */
  beta?: {
    studioCta: Cta;
    companyCta: Cta;
    microcopy: string;
  };
};

// ── §4.2 Proof strip ────────────────────────────────────────────────────────

export type ProofStripCopy = {
  /** Four short facts, each one checkable. */
  facts: [string, string, string, string];
};

// ── §4.3 Product glimpse, §4.5 The shift ────────────────────────────────────

export type StatementCopy = {
  eyebrow?: string;
  headline: string;
  /** One paragraph per entry. */
  body: string[];
  cta?: Cta;
  /**
   * The four stages shown beside the product glimpse.
   *
   * Real page copy rather than part of the mock next to it, because a reader
   * reads these — they are the shortest statement of what the product does,
   * and the only one that survives with images off. The mock beside them is a
   * picture of a project and is not translated; this is, which is why it is
   * here and the mock's own strings are not.
   */
  flow?: { name: string; line: string }[];
};

// ── §4.4 The problem ────────────────────────────────────────────────────────

export type ProblemCopy = {
  eyebrow: string;
  headline: string;
  body: string[];
  cards: [PainCard, PainCard, PainCard];
  transition: string;
};

export type PainCard = { headline: string; line: string };

// ── §4.6 Choose your path ───────────────────────────────────────────────────

export type PathCardCopy = {
  label: string;
  who: string;
  headline: string;
  youGet: string;
  cta: Cta;
};

export type ChoosePathCopy = {
  headline: string;
  /**
   * The label over each card's summary — "You get".
   *
   * One value for both cards rather than one each: the two doors have to be
   * labelled identically or the label itself becomes a difference between
   * them, and the whole section depends on there being none.
   */
  youGetLabel: string;
  studio: PathCardCopy;
  company: PathCardCopy;
};

// ── §4.7 The studio project path ────────────────────────────────────────────

export type StepCopy = {
  /** "Discover", "Analyze" … Rendered with its index. */
  name: string;
  /**
   * The feature this step IS, when the step itself is not shipped yet.
   *
   * Distinct from `coming` below: `feature` chips the whole step (brief
   * analysis does not exist until v2.0, so before launch the step carries
   * "Arriving February 2027"), while `coming` is an addition to a step that
   * already works. §3 requires the first of these during the beta, and both
   * resolve through lib/status.ts so they disappear on their own when the
   * phase ships.
   */
  feature?: FeatureId;
  headline: string;
  body: string;
  /** The grey line under a step: "Forms and responses are free on every plan." */
  smallPrint?: string;
  /** A not-yet-shipped addition shown inside the same card, chipped. */
  coming?: ChippedItem;
};

export type StudioPathCopy = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  /**
   * The word before a step's number — "Step", rendered as "STEP 3 · EXPLORE".
   *
   * Here rather than in the component because it is a word on the page, and a
   * word on the page in an English string literal is a word that never gets
   * translated. Same reason as ChoosePathCopy.youGetLabel.
   */
  stepLabel: string;
  steps: StepCopy[];
  cta: Cta;
};

// ── §4.8 The handoff loop ───────────────────────────────────────────────────

export type HandoffLoopCopy = {
  /** The partner reward lands across v1.0–v2.0, so it is chipped before launch. */
  feature: FeatureId;
  headline: string;
  body: string[];
  strip: { label: string; line: string }[];
  cta: Cta;
};

// ── §4.9 For companies ──────────────────────────────────────────────────────

export type CompanyPartCopy = {
  name: string;
  /** Chips the whole part while it is unshipped. See StepCopy.feature. */
  feature?: FeatureId;
  headline: string;
  body?: string[];
  /** Part 1 is a "if you have X, do Y" table. */
  table?: { condition: string; action: string }[];
  coming?: ChippedItem;
};

export type CompanyCopy = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  /** The word before a part's number — "Part", as "PART 2 · ...". */
  partLabel: string;
  parts: CompanyPartCopy[];
  cta: Cta;
};

// ── §4.10 Tone checker spotlight ────────────────────────────────────────────

export type ToneCheckerCopy = {
  /** The tone checker ships in v2.0, so it is chipped before launch. */
  feature: FeatureId;
  eyebrow: string;
  headline: string;
  body: string;
  outputHeading: string;
  /** What you get back: a bolded term and the rest of the line. */
  outputs: { term: string; line: string }[];
  extrasHeading: string;
  extras: { term: string; line: string }[];
  privacy: string;
  comingHeading: string;
  coming: { feature: FeatureId; label: string }[];
  cta: Cta;
  smallPrint: string;
};

// ── §4.11 One source of truth ───────────────────────────────────────────────

export type PillarsCopy = {
  headline: string;
  body: string;
  pillars: { name: string; headline: string; line: string }[];
};

// ── §4.12 Bilingual by design ───────────────────────────────────────────────

export type BilingualCopy = {
  eyebrow: string;
  headline: string;
  body: string;
  points: { term: string; line: string }[];
  /** Shown in both scripts at once, whichever locale is being read. */
  lineEn: string;
  lineAr: string;
};

// ── §4.13 AI that drafts ────────────────────────────────────────────────────

export type AiRulesCopy = {
  headline: string;
  body: string;
  promises: { term: string; line: string }[];
};

// ── v2 §03 AI alongside ─────────────────────────────────────────────────────

/*
 * The three things the AI actually does, each shown before it is explained.
 *
 * Distinct from `AiRulesCopy`, which is the *stance* — the four promises about
 * what the AI will never do. This is the demonstration. v2 leads the homepage
 * with the demonstration and moves the stance to /platform, on the reasoning
 * that a promise means nothing until you have seen the thing it is a promise
 * about.
 */
export type AiArticleCopy = {
  /** The short white line under the picture. */
  title: string;
  /** Two or three muted lines under the title. */
  line: string;
  cta: Cta;
};

export type AiAlongsideCopy = {
  headline: string;
  cta: Cta;
  articles: [AiArticleCopy, AiArticleCopy, AiArticleCopy];
};

// ── v2 §04 Platform grid ────────────────────────────────────────────────────

/*
 * A cell in the platform grid.
 *
 * `line` is optional because the reference's first cell carries only its name
 * — the picture above it is self-evident and a sentence would be restating it.
 */
export type PlatformCellCopy = {
  name: string;
  line?: string;
  href: string;
};

export type PlatformGridCopy = {
  headline: string;
  cta: Cta;
  cells: PlatformCellCopy[];
};

// ── §4.14 Replace the stack ─────────────────────────────────────────────────

export type ReplaceStackCopy = {
  headline: string;
  columns: { job: string; usually: string; markyos: string };
  rows: { job: string; usually: string; markyos: string }[];
  line: string;
};

// ── §4.15 What's coming next ────────────────────────────────────────────────

export type ComingNextCopy = {
  headline: string;
  subheadline: string;
  phases: { season: string; theme: string; items: string[] }[];
  link: Cta;
};

// ── §4.16 Pricing teaser ────────────────────────────────────────────────────

export type PlanCopy = {
  name: string;
  price: string;
  /** Plan-shape rows: "Active projects: 3" / "Editors: 5". */
  rows: { label: string; value: string }[];
  line: string;
  recommended?: boolean;
  /**
   * The button on the plan's own card.
   *
   * Per plan rather than one shared "Start free" under the grid, because the
   * label is the plan — "Start with Pro" tells somebody what they are about
   * to choose, where three identical buttons make them scroll back up to
   * check which column they were in.
   */
  cta: Cta;
};

export type PricingTeaserCopy = {
  headline: string;
  studioToggle: string;
  companyToggle: string;
  studioPlans: PlanCopy[];
  companyPlans: PlanCopy[];
  /** The badge under the recommended plan's price. */
  recommendedLabel: string;
  studioNote: string;
  companyNote: string;
  underBoth: string;
  link: Cta;
};

// ── §4.17 Founder note ──────────────────────────────────────────────────────

export type FounderNoteCopy = {
  headline: string;
  body: string[];
  signature: string;
};

// ── §4.19 FAQ ───────────────────────────────────────────────────────────────

export type FaqCopy = {
  headline: string;
  items: { question: string; answer: string; coming?: FeatureId }[];
};

// ── The whole site ──────────────────────────────────────────────────────────

export type SiteCopy = {
  meta: {
    /** 60 characters max. §7. */
    title: string;
    /** 155 characters max. §7. */
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  /** Status chip labels, resolved from lib/status.ts keys. */
  chips: Record<ChipKey, string>;
  nav: NavCopy;
  footer: FooterCopy;
  announcement: AnnouncementCopy;
  home: {
    hero: HeroCopy;
    proofStrip: ProofStripCopy;
    productGlimpse: StatementCopy;
    problem: ProblemCopy;
    shift: StatementCopy;
    choosePath: ChoosePathCopy;
    studioPath: StudioPathCopy;
    handoffLoop: HandoffLoopCopy;
    company: CompanyCopy;
    toneChecker: ToneCheckerCopy;
    pillars: PillarsCopy;
    bilingual: BilingualCopy;
    aiRules: AiRulesCopy;
    /* v2: the two sections the homepage now leads with. */
    aiAlongside: AiAlongsideCopy;
    platformGrid: PlatformGridCopy;
    replaceStack: ReplaceStackCopy;
    comingNext: ComingNextCopy;
    pricingTeaser: PricingTeaserCopy;
    founderNote: FounderNoteCopy;
    faq: FaqCopy;
    finalCta: HeroCopy;
  };
};

/**
 * Used by the Arabic dictionary, which supplies only the fields that have been
 * transcreated and inherits the rest.
 */
export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
