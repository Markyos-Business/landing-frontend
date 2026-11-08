import type { ChipKey, FeatureId } from "@/lib/status";
import type { IconName } from "@/components/ui/Icon";

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
  /**
   * One line naming their job.
   *
   * **Not rendered anywhere as of 5 Nov 2026.** It sat under the heading in
   * the desktop mega menu and was cut by review, along with the strip and the
   * link arrows; the phone menu never showed it. Kept rather than deleted
   * because it is approved, transcreated copy for the three audiences and the
   * audience pages are the obvious place for it — but if nothing has claimed
   * it by the time somebody reads this, it is nine strings of dead weight in
   * two languages and should go.
   */
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
  /**
   * "See everything for studios →".
   *
   * Optional, which it was not when the only mega menu was Solutions. The
   * Platform menu groups the nine modules by the stage they belong to —
   * create, hand over, manage — and a stage is not a destination: there is
   * no page for "everything in Create" and inventing three that all point at
   * /platform would be three identical links. That menu puts its one
   * overview link in `strip` instead.
   */
  more?: NavLink;
};

/**
 * The rail down the start edge of a mega menu.
 *
 * A menu that is only a list of destinations is a sitemap, and a sitemap
 * makes the visitor do the sorting. The rail says what the whole menu is for
 * before they read a single link, and gives them the one way in that does not
 * require choosing a column.
 *
 * `title` is deliberately typed as "one of the approved key lines" rather than
 * free copy: MARKYOS-DESIGN-SYSTEM.md §11 lists five lines to be used
 * verbatim, and the two menus each have one that is already a description of
 * exactly what is underneath it. Nothing here is written for the menu, which
 * is the same rule the Resources list follows — see the note on it below.
 *
 * `more` is the section's own overview page, under a label that already
 * exists elsewhere in the site rather than a new one invented for the rail.
 */
export type NavIntro = {
  /** An approved key line (MARKYOS-DESIGN-SYSTEM.md §11), used verbatim. */
  title: string;
  /** The way into the section without choosing a column. */
  more: NavLink;
};

export type NavItemCopy = {
  label: string;
  href: string;
  /** A simple dropdown — a list of links and nothing else. */
  links?: NavLink[];
  /** A mega menu. Mutually exclusive with `links`. */
  groups?: NavGroup[];
  /**
   * What this menu's groups are, which decides whether the desktop panel
   * labels its columns.
   *
   * `audience` (the default) — the visitor picks the column that is about
   * them, and the label is the point. Two of the Solutions menu's pages are
   * listed twice under different names, once per audience it serves, and the
   * heading above them is the only thing that explains why the same
   * destination appears in two columns.
   *
   * `stage` — the groups are the order the work happens in, not places to
   * go. «اصنع / سلّم / أدِر» name no page and ask the visitor to choose
   * nothing, so the desktop panel drops them and lists the nine modules
   * plainly. Cut by review on 5 Nov 2026.
   *
   * The phone menu reads `heading` either way: its accordions need something
   * to tap, and a stage is a reasonable thing to fold nine modules behind on
   * a screen that cannot show them at once.
   */
  grouping?: "audience" | "stage";
  /** The rail at the start edge of a mega menu. Mega menus only. */
  intro?: NavIntro;
  /**
   * The strip of links along the bottom of a menu.
   *
   * Phone menu only since 5 Nov 2026 — the desktop mega panel's floor strip
   * was cut by review. The links are still reachable there, and still from
   * the footer, so nothing was orphaned by the cut.
   */
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
  /**
   * The headline's second clause, set in the blue gradient.
   *
   * Split in the copy rather than in the component because where the sentence
   * turns is a writing decision — "Your whole brand in one place." is the
   * claim and "From the first question to the last post." is the span — and
   * because Arabic and English turn in different places.
   */
  headlineAccent?: string;
  subheadline: string;
  studioCta: Cta;
  companyCta: Cta;
  microcopy: string;
  /**
   * The "replaces" strip under the microcopy.
   *
   * Real copy, not decoration: it answers "so what does it replace?" before
   * the visitor asks it, and §0.2 of the copy deck requires these be named as
   * text rather than shown as third-party logos.
   */
  replacesLabel?: string;
  replaces?: { name: string; latin?: boolean }[];
  /**
   * The hero's scroll story (rev. 6 Nov 2026).
   *
   * Three acts, and the copy only has to carry the first and the last of
   * them: the brand's elements arrive as names, they gather into the hub,
   * the hub becomes the guidelines builder, and the builder deals out the
   * templates the guideline site can be built from.
   *
   * What is *not* here is the builder's own chrome and the covers' own type.
   * Those belong to `components/mock/GuidelinesBuilder.tsx` for the reason
   * written at the top of `BrandHub.tsx`: a picture of a product with a
   * fictional client's brand inside it is not site copy to be transcreated.
   *
   * This replaced two floating cards — a file the studio uploaded and a
   * scored post the company wrote — which said the same thing as the
   * headline rather than showing anything the product does.
   */
  scene?: {
    /**
     * The brand's elements, as names only.
     *
     * The same vocabulary the hub's own sidebar uses, deliberately: the thing
     * the visitor watches fly into the window is labelled with the words they
     * will find inside it.
     */
    elements: string[];
    /** What the covers are, said once, under them. */
    templatesLabel: string;
  };
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
  /** The line facing the headline, over the table. */
  lead?: string;
  body: string[];
  cards: [PainCard, PainCard, PainCard];
  transition: string;
  /** Column heads for the station table. */
  stationColumns?: { station: string; tool: string; what: string };
  /**
   * The journey, one row per stop.
   *
   * The argument of the section is that every project takes the same route
   * through seven different tools, so the route has to be legible as a list
   * — a reader recognises their last project row by row.
   */
  stations?: { station: string; tool: string; what: string; icon: IconName }[];
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
  /**
   * The third door.
   *
   * The landing design's audiences section is three cards — studios,
   * freelancers, companies — where the two-door fork in the hero is still a
   * fork. A freelancer reading a page that offers only "studio" or "company"
   * has to decide which lie to pick.
   */
  freelancer?: PathCardCopy;
  /** The line under the three cards: the studio builds it, the company runs it. */
  closing?: string;
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
   * "Arriving soon"), while `coming` is an addition to a step that
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
  /** The five guarantees, each a bold term and the rest of the sentence. */
  features?: { term: string; line: string; icon: IconName }[];
  link?: Cta;
};

// ── §4.13 AI that drafts ────────────────────────────────────────────────────

export type AiRulesCopy = {
  headline: string;
  body: string;
  promises: { term: string; line: string }[];
};

// ── v2 §03 AI alongside ─────────────────────────────────────────────────────

/*
 * `AiArticleCopy` stood here until copy v2.1: the three things the AI does,
 * each shown before it was explained. The rewrite of §1.7 below replaced the
 * demonstration with the two columns of its effect, and the three articles
 * became the feature pages the module cards link to, so nothing reads it any
 * more.
 */

/*
 * The brand brain — §1.7, as rewritten at copy v2.1.
 *
 * ── What changed, and why the shape changed with it ──────────────────────
 *
 * v2.0's section was a claim ("ChatGPT knows the world, the brand brain
 * knows your brand"), a list of the sources it reads, and three articles
 * about what the reading turns into. The copy deck's note on the rewrite is
 * that buyers "ask whether the AI makes the brand better, not just what it
 * generates" — so the capabilities, the costs and the full explanation moved
 * to `/platform/brand-brain`, and what is left on the homepage answers the
 * question twice over: once for somebody starting a brand and once for
 * somebody who already has one.
 *
 * Hence `effect`, which is a two-column table and not a list: the two
 * starting points are the two audiences, and the only honest way to say
 * "this helps either way" is to say what it does in each case, side by side.
 * And hence `seams` — six places two parts of a brand drift apart — which is
 * what turns "consistency" from an adjective into something a reader can
 * picture.
 *
 * `reads`, `readsGrowth` and `articles` are gone with v2.0. The sources are
 * now implied by the seams (each one names the two things it sits between),
 * and the three articles are the feature pages the modules link to.
 */
export type AiAlongsideCopy = {
  /** "The brand brain" — the overline, since the headline no longer names it. */
  eyebrow?: string;
  headline: string;
  /** The headline's second clause, set in the blue gradient. */
  headlineAccent?: string;
  /** Three paragraphs: the parts a brand is made of, what this is, the ChatGPT line. */
  body: string[];
  /** Its effect on the result, for a new brand and for an existing one. */
  effect?: {
    headline: string;
    newBrand: string;
    existingBrand: string;
    rows: { label: string; newBrand: string; existingBrand: string }[];
  };
  /** The seams — the places brands come apart, and what watches each one. */
  seamsHeadline?: string;
  seams?: { title: string; line: string; chip?: FeatureId }[];
  /** "Clear limits": it suggests, it does not decide, and it never draws a logo. */
  limitsHeadline?: string;
  limits?: string[];
  /** The AI connector, which is a different thing and has to stay one. */
  connector?: { line: string; chip: FeatureId };
  cta: Cta;
};

// ── The ecosystem: one place, every part feeding the next ──────────────────

/*
 * The section that reverses the problem's picture.
 *
 * The problem section fans one brand out across seven tools; this one runs
 * the same seven back down into a single mark and fans three stages out
 * below it. `tools` is therefore the same list as the problem's stations,
 * said in two words each, and the order matters — it is read as a funnel.
 */
export type EcosystemCopy = {
  headline: string;
  /** The second clause, set in the blue gradient. */
  headlineAccent: string;
  body: string;
  /** The tiles across the top of the funnel. */
  tools: { label: string; tool: string; icon: IconName }[];
  /** What sits at the waist of the funnel. */
  brainLabel: string;
  /** The three stages below the mark. */
  stages: { name: string; what: string; who: string; icon: IconName }[];
  /** The closing line: the two things in the middle that do not change. */
  closing: string;
  /** v3 §2.4: "All features →". Optional — the section stood without it. */
  link?: Cta;
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
  subheadline?: string;
  /** The stage headings in the module list — "Stage one · Create". */
  stageLabels?: { create: string; handOver: string; manage: string };
  /** The label on the "replaces" chip inside a module panel. */
  replacesLabel?: string;
  /** The word before a module's number — "Module 4". */
  moduleLabel?: string;
  /** The nine modules, in reading order. */
  modules?: ModuleCopy[];
};

/*
 * One module of the platform.
 *
 * `promise` is the module's whole pitch in one sentence and is the only line
 * set in blue — it is what the reader takes away if they read nothing else in
 * the panel. `feats` are the contents, and a feature that has not shipped
 * carries the chip itself rather than the module carrying it, so a module
 * that is 80% live does not read as unavailable.
 */
export type ModuleCopy = {
  n: number;
  stage: "create" | "handOver" | "manage";
  name: string;
  replaces: string;
  promise: string;
  icon: IconName;
  feats: { name: string; line: string; chip?: FeatureId }[];
  /**
   * The module's feature page, under /platform/.
   *
   * v2.2 of the copy deck: these pointed at solution pages and at anchors on
   * /platform, and now there is one page per feature. Module 8 is the one
   * that has two of them — brand voice and the tone checker are a module
   * here and two pages there — which is what `link2` is for, and the only
   * reason it exists.
   */
  link?: Cta;
  link2?: Cta;
};

// ── §4.14 Replace the stack ─────────────────────────────────────────────────

export type ReplaceStackCopy = {
  headline: string;
  subheadline?: string;
  columns: { job: string; usually: string; markyos: string; change?: string };
  rows: {
    job: string;
    usually: string;
    markyos: string;
    /**
     * The fourth column: not what you stop paying for, but what changes.
     *
     * The copy deck is explicit that this is the column that sells — "the
     * real benefit: not fewer logins, but one brand that flows". Without it
     * the table is a feature comparison, which the visitor can already do.
     */
    change?: string;
    /** A status chip on the Markyos cell, for a row that is not shipped yet. */
    chip?: FeatureId;
    /** A status chip on the "what changes" cell instead. */
    changeChip?: FeatureId;
  }[];
  line: string;
  /** The trademark footnote under the table (§0.2). */
  trademarkNote?: string;
  /** v3 §2.6: "The full comparison →", beside the footnote. */
  link?: Cta;
  /**
   * What Markyos does not replace.
   *
   * This block is what makes the table above it credible: a comparison that
   * claims everything is read as a sales sheet. It is not an aside.
   */
  notReplacedHeadline?: string;
  notReplaced?: { title: string; line: string; icon: IconName }[];
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
  /** v3 §2.9: what is free, in one line, above the toggle and the cards. */
  body?: string;
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
  /*
   * v3 §2.9 keeps three questions on the homepage and sends the rest to the
   * pricing page's FAQ. Optional, because a list that is already complete
   * has nowhere to send anyone.
   */
  link?: Cta;
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
    /* The landing design's funnel section, between problem and compare. */
    ecosystem: EcosystemCopy;
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
