import type { Cell, PageBlock, PageDoc, PlanCard } from "./pages/types";
import type { OfferBarCopy, PlanCopy, PricingTeaserCopy } from "./types";

type Locale = "en" | "ar";

/*
 * The catalogue, and the one place every price on the site comes from.
 *
 * ── Which deck governs ──────────────────────────────────────────────────────
 *
 * Two documents dated 26 Nov 2026 describe this page, and they do not agree:
 *
 *   docs/copy/markyos_site_copy_v5_ar.md   Part D, page 1 — the whole site
 *   docs/copy/markyos_pricing_page_copy_v5_2.md — this page only
 *
 * The site file states its numbers come from "pricing v5.1 in Notion". v5.2 is
 * later and is the pricing source, so **v5.2 wins on every figure it states**,
 * and the site file supplies what v5.2 is silent about: the comparison tables,
 * the AI-limits explanation, the free badge, how handoff pays, and billing.
 * Where that rule changed a promise rather than a number it was put to the
 * owner and answered: the Company plan caps editors at five per brand and
 * sells a sixth for $8, so "pay for the brand, not the people" is now written
 * as the viewers it is actually true of.
 *
 * ── What v5.2 changed from v4.3, which this file used to hold ───────────────
 *
 * Eleven plans became four. Free · Freelancer $12 · Studio $29 · Company $19
 * per brand, on three tabs of three cards. A 14 day trial with no card
 * replaces the old entry path; the launch offer drops from 50% to 30%; the
 * shared credit pool becomes one monthly limit per AI tool; the Project Pass
 * and the prepaid client year are gone; the partner reward is 20% everywhere,
 * because the Agency plan that carried the 25% rate no longer exists.
 */

/*
 * What the platform actually charges today, which is none of the above.
 *
 * `CURRENT_PRICES` is on no page. It is the contract `check:pricing` holds
 * against the backend's `billing.py` and the platform's `accountTypes.ts`, and
 * it is the only record here of the gap between what the site sells and what a
 * card is charged. The day the two meet, this constant is what will say so.
 */
export const CURRENT_PRICES = {
  freelancer: { pass: 15, subscription: 19 },
  studio: { pass: 19, subscription: 29 },
  company: { pass: 49, subscription: 99 },
} as const;

/*
 * The three paid plans.
 *
 * Monthly only. The yearly figure is derived rather than listed, because v5.2
 * states the rule and the amounts agree with it exactly: two months free, so a
 * year costs ten months. $12 → $120, $29 → $290, $19 → $190. v4.3 needed a
 * second list of yearly prices and a tolerance band in the gate to cover four
 * different real discounts; one rule needs neither, and `check:pricing`
 * asserts the rule instead of a range.
 */
const PLAN_PRICES = {
  freelancer: 12,
  studio: 29,
  company: 19,
} as const;

type PaidPlan = keyof typeof PLAN_PRICES;

/** Two months free: a year costs ten months. v5.2 §2, and every card's yearly line. */
export const YEARLY_MONTHS = 10;

/** The floor the homepage and the meta description quote. Derived, so the sentence moves with the plans. */
export const LOWEST_PAID_MONTHLY = Math.min(...Object.values(PLAN_PRICES));

/*
 * The add-ons, from v5.2 §5.
 *
 * `companyEditor` is new in v5.2 and is the reason the Company plan's promise
 * had to be rewritten: editors are five per brand, and the sixth is $8.
 * `projectPass` and `enterpriseFrom` are gone — the pass has no job left with
 * Freelancer at $12 for three brands, and Enterprise carries no price at all.
 */
export const EXTRAS = {
  /** Studios and freelancers: a sixth member, a seventh. */
  seat: 8,
  /** Studios and freelancers: five more active brands and 50 GB. */
  brands5: 10,
  /** Companies: every other brand the company runs. */
  companyBrand: 19,
  /** Companies: a sixth editor on a brand. */
  companyEditor: 8,
  /** One-off packs, used after the monthly limit. Paid plans only. */
  brainPack: 12,
  mockupPack: 9,
} as const;

/** How long a pack lasts, in months. v5.2 §5. */
export const PACK_MONTHS = 12;

/** The studio's share of a handed-off client's first year, as billing credit. One rate now. */
export const PARTNER_SHARE = 20;

/*
 * The trial, which is v5.2's entry path and did not exist in v4.3.
 *
 * Fourteen days on any paid plan with no card. The reminders and the move to
 * the free plan are the product's job, not this site's — they are recorded
 * here because the page states them, and `docs/V5-MIGRATION.md` carries them
 * as an open item until they are built.
 */
export const TRIAL = {
  days: 14,
  reminderDays: [10, 13],
  /** The day the workspace moves to the free plan if nobody subscribes. */
  freeFromDay: 15,
} as const;

/*
 * The launch offer.
 *
 * 30% off the first three monthly cycles, on every paid plan — v5.2 drops
 * v4.3's carve-out, because there is no $6 plan left to protect. Yearly
 * billing is out: it already gives two months free. The window is the instant
 * the site has carried since 21 Nov, in UTC rather than as a date, because a
 * countdown that resolves "15 Feb 2027" in the reader's own zone ends at a
 * different moment in Riyadh than in London, and this is one offer.
 */
export const LAUNCH_OFFER = {
  percent: 30,
  months: 3,
  plans: ["freelancer", "studio", "company"] as readonly PaidPlan[],
  opens: "2026-11-21T00:00:00Z",
  closes: "2027-02-15T23:59:59Z",
} as const;

/** `$1,188` and `$8.40`: a four-figure price keeps its separator, a cent figure both digits. */
function money(value: number): string {
  const digits = Number.isInteger(value) ? 0 : 2;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

/** The same figure in Arabic prose: «12 دولاراً». */
function dollars(value: number): string {
  return `${value.toLocaleString("en-US")} ${value === 1 ? "دولار" : "دولاراً"}`;
}

/** A plan's yearly price. Always derived from the two-months-free rule. */
export function yearlyPrice(plan: PaidPlan): number {
  return PLAN_PRICES[plan] * YEARLY_MONTHS;
}

/** A plan's launch price: always derived, never typed. $12 → $8.40. */
function launchPrice(plan: PaidPlan): string {
  return money((PLAN_PRICES[plan] * (100 - LAUNCH_OFFER.percent)) / 100);
}

/** The studio's monthly billing credit from `clients` clients on the Company plan. */
export function partnerCredit(clients: number): string {
  return money((clients * PLAN_PRICES.company * PARTNER_SHARE) / 100);
}

/*
 * The monthly limits, one table per side of the catalogue.
 *
 * Every number v5.2 prints on a card lives here once, and the cards, the
 * comparison tables and the feature pages that quote an allowance all read it.
 * They drifted apart in v4's draft history more than once — a card that says
 * 2,500 above a table that says 3,000 is the kind of error a reader finds
 * before we do.
 *
 * `null` is "not included", which the page prints as «لا · No» rather than as
 * a zero: zero quick checks and no quick-check tool are different facts.
 *
 * Rows marked (v5.0) are limits v5.2 does not state. They come from the site
 * copy file's comparison tables, under the precedence rule at the top.
 */
const BUILDER_LIMITS = {
  /** v5.2 cards. Handed-off brands stop counting. */
  activeBrands: { free: 1, freelancer: 3, studio: 10 },
  /** v5.2 sets Free to one; the paid figures are the site file's. */
  newProjects: { free: 1, freelancer: 3, studio: 10 },
  seats: { free: 1, freelancer: 1, studio: 5 },
  /** (v5.0) */
  storage: { free: "2 GB", freelancer: "20 GB", studio: "100 GB" },
  /** (v5.0) */
  looks: { free: 2, freelancer: 8, studio: 8 },
  /** (v5.0) */
  reruns: { free: null, freelancer: 5, studio: 15 },
  /** v5.2 cards. */
  sectionDrafts: { free: 5, freelancer: 30, studio: 100 },
  /** v5.2 cards. */
  assistant: { free: null, freelancer: 40, studio: 150 },
  /** v5.2 cards. */
  mockups: { free: 3, freelancer: 15, studio: 40 },
} as const;

const COMPANY_LIMITS = {
  brands: { free: 1, company: 1 },
  /** v5.2: five per brand, and a sixth is an add-on. This replaced "unlimited". */
  editors: { free: 1, company: 5 },
  /** Unlimited on the paid plan, which is the half of the old promise that survived. */
  viewers: { free: 25, company: null },
  studioCollaborators: { free: 1, company: 1 },
  /** (v5.0) */
  storage: { free: "2 GB", company: "25 GB" },
  /** (v5.0) */
  looks: { free: 2, company: 8 },
  /** (v5.0) */
  alignmentReruns: { free: null, company: 3 },
  /** v5.2 cards. */
  quickChecks: { free: 25, company: 1000 },
  /** v5.2 cards. */
  askTheBrand: { free: 20, company: 500 },
  /** v5.2 cards: deep checks, rewrites or translations. */
  deepChecks: { free: 5, company: 80 },
  /** (v5.0) */
  assistant: { free: null, company: 50 },
  /** (v5.0) */
  mockups: { free: 3, company: 30 },
} as const;

/*
 * The limits, for the feature pages that quote them.
 *
 * /platform/tone-checker, the mockup page and the audience pages each state a
 * monthly allowance, and until v4.2 each stated it in its own numbers. They
 * read this now, so there is one place to change.
 */
export const AI_LIMITS = {
  builders: BUILDER_LIMITS,
  companies: COMPANY_LIMITS,
} as const;

/*
 * `✓` and `∞`, and why they are not icons.
 *
 * §6 of the design system allows one icon system and this is not it — these
 * are typographic marks inside a table cell, set in the page's own face, the
 * way `→` is allowed inside copy. Neither is emoji by default and neither
 * carries a variation selector, so `check:design`'s §11 rule reads them as the
 * punctuation they are. A tick in a comparison table is the one place a mark
 * beats a word: forty rows of «نعم» is forty rows a reader has to read.
 */
const YES = "✓";
const ANY = "∞";

const PLAN_NAMES = {
  en: {
    free: "Free",
    freelancer: "Freelancer",
    studio: "Studio",
    biggerTeam: "Bigger team",
    company: "Company",
    enterprise: "Enterprise",
  },
  ar: {
    free: "المجانية",
    freelancer: "مستقل",
    studio: "استوديو",
    biggerTeam: "فريق أكبر",
    company: "شركة",
    enterprise: "المؤسسات",
  },
} as const;

/** A bilingual pair, resolved once per page build. Arabic leads, as it does everywhere. */
function translator(locale: Locale) {
  return (arabic: string, english: string): string => (locale === "ar" ? arabic : english);
}

/*
 * The three tabs, and the one place their ids are written.
 *
 * Each is an option on the switch, a deep link (`/pricing#studios`), and the
 * prefix of every plan-card id inside its panel. v5.2 puts the same Free card
 * on two tabs and the same Studio card on two tabs, and every panel is in the
 * HTML — so a card id has to carry its tab, or the document ships two elements
 * called `plan-studio` and the chooser lights whichever one the browser found
 * first.
 */
const AUDIENCES = ["freelancers", "studios", "companies"] as const;
type Audience = (typeof AUDIENCES)[number];

const planId = (audience: Audience, plan: string) => `plan-${audience}-${plan}`;

/** The switch's three labels, and the homepage teaser's. One place. */
function audienceLabel(locale: Locale, audience: Audience): string {
  const t = translator(locale);
  return {
    freelancers: t("المستقلون", "Freelancers"),
    studios: t("الاستوديوهات", "Studios"),
    companies: t("الشركات", "Companies"),
  }[audience];
}

/*
 * Which account type a tab signs up as.
 *
 * Both builder tabs create a studio workspace — the platform has no separate
 * freelancer type, and v5.2's own buttons send a freelancer to the same place
 * a studio goes.
 */
const SIGNUP_TYPE: Record<Audience, string> = {
  freelancers: "studio",
  studios: "studio",
  companies: "company",
};

/*
 * A paid card.
 *
 * Every figure comes from PLAN_PRICES or the limit tables above. `pick` is
 * v5.2's "pick it if"; `moveUp` is the site file's "move up when", which v5.2
 * does not carry and which answers the only question a price cannot.
 */
function paidCard(
  plan: PaidPlan,
  locale: Locale,
  options: {
    audience: Audience;
    who: string;
    pick: string;
    moveUp: string;
    rows: PlanCard["rows"];
    recommended?: boolean;
    cta: string;
    perBrand?: boolean;
  },
): PlanCard {
  const t = translator(locale);
  const monthly = PLAN_PRICES[plan];
  const perBrand = options.perBrand ? t(" لكل علامة", " per brand") : "";
  return {
    id: planId(options.audience, plan),
    name: PLAN_NAMES[locale][plan],
    price: money(monthly),
    period: t(`شهرياً${perBrand}`, `a month${perBrand}`),
    annual: {
      price: money(yearlyPrice(plan)),
      note: t(`سنوياً${perBrand}، شهران مجاناً`, `a year${perBrand}, two months free`),
    },
    who: options.who,
    pick: options.pick,
    moveUp: options.moveUp,
    rows: options.rows,
    recommended: options.recommended,
    cta: {
      label: options.cta,
      href: `/start?type=${SIGNUP_TYPE[options.audience]}`,
    },
  };
}

/*
 * The free card, which is one plan on two tabs and a different one on the third.
 *
 * v5.2 is explicit that the builders' Free card is the same on the Freelancers
 * and Studios tabs; the Companies tab has its own, with a company's limits and
 * a company's reason to be there. What differs between the two builder copies
 * is nothing at all, so they share everything but their id.
 */
function freeCard(
  locale: Locale,
  options: {
    audience: Audience;
    who: string;
    pick: string;
    moveUp: string;
    rows: PlanCard["rows"];
  },
): PlanCard {
  const t = translator(locale);
  return {
    id: planId(options.audience, "free"),
    name: PLAN_NAMES[locale].free,
    price: t("مجاناً", "Free"),
    who: options.who,
    pick: options.pick,
    moveUp: options.moveUp,
    rows: options.rows,
    cta: {
      label: t("ابدأ مجاناً", "Start free"),
      href: `/start?type=${SIGNUP_TYPE[options.audience]}`,
    },
  };
}

/* ── The rows, which are the same rows on every card of a side ─────────────── */

/*
 * One row set per side of the catalogue.
 *
 * This is the whole point of a card in v5.2: a reader runs one row across the
 * tab and compares three figures without opening anything. The rows a card
 * cannot hold in one short value — partner links, who counts as a
 * collaborator — are in the comparison table below, which has a column for
 * prose.
 */
type BuilderPlan = "free" | "freelancer" | "studio";

function builderRows(locale: Locale, plan: BuilderPlan): PlanCard["rows"] {
  const t = translator(locale);
  const L = BUILDER_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? no : value.toLocaleString("en-US"));
  const row = (label: string, value: string, strong?: boolean) => ({ label, value, strong });

  return [
    row(t("العلامات النشطة", "Active brands"), num(L.activeBrands[plan]), true),
    row(t("مشاريع جديدة كل 30 يوماً", "New projects every 30 days"), num(L.newProjects[plan])),
    row(t("الأعضاء", "Members"), num(L.seats[plan])),
    row(t("التخزين", "Storage"), L.storage[plan]),
    row(t("نماذج الاستكشاف", "Discovery forms"), ANY),
    row(t("تصاميم الدليل", "Guideline looks"), num(L.looks[plan])),
    row(t("التحليل الأول لكل مشروع", "First analysis on every project"), YES),
    row(t("إعادة التحليل شهرياً", "Analysis re-runs a month"), num(L.reruns[plan])),
    row(t("نصوص أقسام الدليل شهرياً", "Guideline section drafts a month"), num(L.sectionDrafts[plan])),
    row(t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"), num(L.assistant[plan])),
    row(t("موك اب بالذكاء الاصطناعي شهرياً", "AI mockups a month"), num(L.mockups[plan])),
    row(
      t("شارة «صُنع بماركيوس»", "“Made with Markyos” badge"),
      plan === "free" ? t("تظهر", "Shown") : no,
    ),
    row(t("كلمة مرور للمركز", "Hub password"), plan === "free" ? no : YES),
    row(
      t("نطاق خاص قبل التسليم", "Custom domain before handoff"),
      plan === "studio" ? YES : no,
    ),
    row(t("التسليم ونقل الملكية", "Handoff and ownership transfer"), YES),
    row(t("مكافأة الشريك", "Partner reward"), `${PARTNER_SHARE}%`),
    row(t("موصّل الذكاء الاصطناعي", "AI Connector"), plan === "free" ? no : YES),
  ];
}

type CompanyPlan = "free" | "company";

function companyRows(locale: Locale, plan: CompanyPlan): PlanCard["rows"] {
  const t = translator(locale);
  const L = COMPANY_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? ANY : value.toLocaleString("en-US"));
  const row = (label: string, value: string, strong?: boolean) => ({ label, value, strong });

  return [
    row(t("العلامات", "Brands"), num(L.brands[plan]), true),
    row(t("المحرّرون لكل علامة", "Editors per brand"), num(L.editors[plan]), true),
    row(t("المشاهدون", "Viewers"), num(L.viewers[plan]), true),
    row(t("استوديو متعاون", "Studio collaborator"), num(L.studioCollaborators[plan])),
    row(t("التخزين لكل علامة", "Storage per brand"), L.storage[plan]),
    row(t("تصاميم الدليل", "Guideline looks"), num(L.looks[plan])),
    row(t("تقرير التوافق الأول", "First alignment report"), YES),
    row(t("إعادة تقرير التوافق شهرياً", "Alignment report re-runs a month"), plan === "free" ? no : String(L.alignmentReruns.company)),
    row(t("مراجعات نبرة سريعة شهرياً", "Quick tone checks a month"), L.quickChecks[plan].toLocaleString("en-US")),
    row(t("أسئلة «اسأل علامتك» شهرياً", "Ask the Brand questions a month"), L.askTheBrand[plan].toLocaleString("en-US")),
    row(
      t("مراجعة معمّقة أو صياغة أو ترجمة", "Deep checks, rewrites or translations"),
      L.deepChecks[plan].toLocaleString("en-US"),
    ),
    row(t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"), plan === "free" ? no : String(L.assistant.company)),
    row(t("موك اب بالذكاء الاصطناعي شهرياً", "AI mockups a month"), String(L.mockups[plan])),
    row(
      t("شارة «صُنع بماركيوس»", "“Made with Markyos” badge"),
      plan === "free" ? t("تظهر", "Shown") : no,
    ),
    row(t("نطاق خاص", "Custom domain"), plan === "free" ? no : YES),
    row(
      t("روابط الشركاء", "Partner links"),
      plan === "free" ? t("للعرض فقط", "View only") : t("بموعد وكلمة مرور", "Expiry and password"),
    ),
    row(t("دعوة استوديوك مجاناً", "Invite your studio, free"), YES),
    row(t("المشاهدون يراجعون كتاباتهم", "Viewers check their own writing"), plan === "free" ? no : YES),
    row(t("موصّل الذكاء الاصطناعي", "AI Connector"), plan === "free" ? no : YES),
  ];
}

/* ── Tab 1 · Freelancers ───────────────────────────────────────────────────── */

function freelancerCards(locale: Locale): PlanCard[] {
  const t = translator(locale);

  return [
    freeCard(locale, {
      audience: "freelancers",
      who: t("ابدأ مشروعك الأول مجاناً.", "Start your first project free."),
      pick: t("تريد أن تجرّب ماركيوس على مشروع واحد.", "You want to try Markyos on one project."),
      moveUp: t(
        "يأتيك عميل ثانٍ في الوقت نفسه، أو تريد إخفاء الشارة.",
        "A second client comes in at the same time, or you want the badge gone.",
      ),
      rows: builderRows(locale, "free"),
    }),
    paidCard("freelancer", locale, {
      audience: "freelancers",
      recommended: true,
      who: t("تعمل وحدك، وعملاؤك كُثر.", "You work alone. Your clients don't."),
      pick: t(
        "تعمل وحدك مع عميل إلى ثلاثة في الوقت نفسه.",
        "You work alone, with one to three clients at a time.",
      ),
      moveUp: t(
        "ينضم إليك أحد، أو يصير عملاؤك أكثر من ثلاثة في الوقت نفسه.",
        "Someone joins you, or more than three clients run at the same time.",
      ),
      rows: builderRows(locale, "freelancer"),
      cta: t(`جرّب ${TRIAL.days} يوماً مجاناً`, `Try ${TRIAL.days} days free`),
    }),
    paidCard("studio", locale, {
      audience: "freelancers",
      who: t("فريقك يبني، وعملاؤك يستلمون.", "Your team builds. Your clients take over."),
      pick: t(
        "معك فريق حتى خمسة، ومشاريعك حتى عشرة.",
        "You have a team of up to five, and up to ten live brands.",
      ),
      moveUp: t(
        "يتجاوز فريقك خمسة، أو علاماتك عشراً. أضف إضافاتك.",
        "Your team passes five, or your brands pass ten. Add the add-ons.",
      ),
      rows: builderRows(locale, "studio"),
      cta: t(`جرّب ${TRIAL.days} يوماً مجاناً`, `Try ${TRIAL.days} days free`),
    }),
  ];
}

/* ── Tab 2 · Studios ───────────────────────────────────────────────────────── */

/*
 * The third card is not a fourth plan.
 *
 * v5.2 calls it "Bigger team" and prices it "$29 a month + add-ons": it is the
 * Studio plan with the two add-ons that lift its ceilings. So it carries no
 * plan id of its own in the catalogue, its rows are the add-ons rather than
 * limits, and its button says what it actually starts — a Studio trial. A card
 * that looked like a plan and checked out as another one is the kind of thing
 * a reader finds at the payment screen.
 */
function biggerTeamCard(locale: Locale): PlanCard {
  const t = translator(locale);
  const row = (label: string, value: string) => ({ label, value });

  return {
    id: planId("studios", "bigger-team"),
    name: PLAN_NAMES[locale].biggerTeam,
    price: money(PLAN_PRICES.studio),
    period: t("شهرياً + إضافات", "a month + add-ons"),
    who: t("فريقك يكبر؟ الاستوديو يكبر معه.", "Team growing? Studio grows with it."),
    pick: t(
      "معك أكثر من خمسة أعضاء أو أكثر من عشر علامات نشطة.",
      "You have more than five members or more than ten live brands.",
    ),
    rows: [
      row(
        t("5 علامات و50 جيجابايت", "+5 brands, 50 GB"),
        t(`${dollars(EXTRAS.brands5)} شهرياً`, `${money(EXTRAS.brands5)} a month`),
      ),
      row(
        t("عضو إضافي", "Extra member"),
        t(`${dollars(EXTRAS.seat)} شهرياً`, `${money(EXTRAS.seat)} a month`),
      ),
      row(
        t("حزمة عقل العلامة", "Brand Brain pack"),
        t(`${dollars(EXTRAS.brainPack)} مرة واحدة`, `${money(EXTRAS.brainPack)} once`),
      ),
      row(
        t("حزمة الموك اب", "Mockup pack"),
        t(`${dollars(EXTRAS.mockupPack)} مرة واحدة`, `${money(EXTRAS.mockupPack)} once`),
      ),
    ],
    cta: {
      label: t(`جرّب الاستوديو ${TRIAL.days} يوماً`, `Try Studio for ${TRIAL.days} days`),
      href: `/start?type=${SIGNUP_TYPE.studios}`,
    },
  };
}

function studioCards(locale: Locale): PlanCard[] {
  const t = translator(locale);

  return [
    freeCard(locale, {
      audience: "studios",
      who: t("ابدأ مشروعك الأول مجاناً.", "Start your first project free."),
      pick: t("تريد أن تجرّب ماركيوس على مشروع واحد.", "You want to try Markyos on one project."),
      moveUp: t(
        "يعمل معك أحد، أو يأتيك عميل ثانٍ في الوقت نفسه.",
        "Someone works with you, or a second client comes in at the same time.",
      ),
      rows: builderRows(locale, "free"),
    }),
    paidCard("studio", locale, {
      audience: "studios",
      recommended: true,
      who: t("فريقك يبني، وعملاؤك يستلمون.", "Your team builds. Your clients take over."),
      pick: t(
        "معك فريق حتى خمسة، ومشاريعك حتى عشرة.",
        "You have a team of up to five, and up to ten live brands.",
      ),
      moveUp: t(
        "يتجاوز فريقك خمسة، أو علاماتك عشراً.",
        "Your team passes five, or your brands pass ten.",
      ),
      rows: builderRows(locale, "studio"),
      cta: t(`جرّب ${TRIAL.days} يوماً مجاناً`, `Try ${TRIAL.days} days free`),
    }),
    biggerTeamCard(locale),
  ];
}

/* ── Tab 3 · Companies ─────────────────────────────────────────────────────── */

/*
 * Enterprise, which has no price and does not sign anybody up.
 *
 * v5.2 gives it a card with "Join the waitlist". There is no waitlist page —
 * `/api/waitlist` answers 501 on purpose, which `docs/TESTING.md` explains —
 * so the button goes to the contact form's sales topic, which is where the
 * site file sends "register your interest" and the one route that reaches a
 * person. It carries the coming-soon chip because none of it is built.
 */
function enterpriseCard(locale: Locale): PlanCard {
  const t = translator(locale);
  const row = (label: string, value: string) => ({ label, value });

  return {
    id: planId("companies", "enterprise"),
    name: PLAN_NAMES[locale].enterprise,
    price: t("قريباً", "Coming soon"),
    who: t("لعدة علامات وفرق كبيرة.", "For many brands and large teams."),
    pick: t(
      "تدير عدة علامات، أو فرقاً في أكثر من دولة.",
      "You run several brands, or teams in more than one country.",
    ),
    rows: [
      row(t("تسجيل دخول موحّد", "Single sign-on"), t("قريباً", "Coming soon")),
      row(t("لوحة صحة العلامة", "Brand health dashboard"), t("قريباً", "Coming soon")),
      row(t("دعم مخصّص", "Dedicated support"), t("قريباً", "Coming soon")),
    ],
    cta: {
      label: t("انضم لقائمة الانتظار", "Join the waitlist"),
      href: "/contact?topic=sales",
    },
  };
}

function companyCards(locale: Locale): PlanCard[] {
  const t = translator(locale);

  return [
    freeCard(locale, {
      audience: "companies",
      who: t("علامتك في مكان واحد، مجاناً.", "Your brand in one place, free."),
      pick: t(
        "استلمت علامتك من استوديو، أو تريد أن تجرّب.",
        "Your studio handed you the brand, or you want to try it.",
      ),
      moveUp: t(
        "يحتاج أكثر من شخص أن يعدّل، أو تنفد مراجعات النبرة.",
        "More than one person needs to edit, or the tone checks run out.",
      ),
      rows: companyRows(locale, "free"),
    }),
    paidCard("company", locale, {
      audience: "companies",
      recommended: true,
      perBrand: true,
      who: t("شركتك كلها، بصوت واحد.", "Your whole company, one voice."),
      pick: t(
        "تدير علامة شركتك، وتريد أن يستعملها الجميع.",
        "You run your company's brand and want everyone to use it.",
      ),
      moveUp: t(
        "تدير عدة علامات، أو تحتاج تسجيل دخول موحّداً.",
        "You run several brands, or you need single sign-on.",
      ),
      rows: companyRows(locale, "company"),
      cta: t(`جرّب ${TRIAL.days} يوماً مجاناً`, `Try ${TRIAL.days} days free`),
    }),
    enterpriseCard(locale),
  ];
}

/* ── The comparison tables ─────────────────────────────────────────────────── */

function group(label: string, columns: number): Cell[] {
  return [{ text: label, strong: true }, ...Array.from({ length: columns }, () => "")];
}

/*
 * The builder table, on both builder tabs.
 *
 * Freelancers and Studios are two doors onto the same three plans, so they
 * compare the same three columns. The third card on the Studios tab is Studio
 * with add-ons, not a fourth plan, so it is not a column here — the add-ons
 * have their own block below, which is where v5.2 puts them.
 */
function builderTable(locale: Locale): Cell[][] {
  const t = translator(locale);
  const L = BUILDER_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? no : value.toLocaleString("en-US"));
  const plans: BuilderPlan[] = ["free", "freelancer", "studio"];
  const across = (pick: (plan: BuilderPlan) => Cell): Cell[] => plans.map(pick);
  const line = (label: string, pick: (plan: BuilderPlan) => Cell): Cell[] => [label, ...across(pick)];

  return [
    group(t("العمل", "Work"), plans.length),
    line(t("العلامات النشطة", "Active brands"), (p) => ({ text: num(L.activeBrands[p]), strong: true })),
    line(t("مشاريع جديدة كل 30 يوماً", "New projects every 30 days"), (p) => num(L.newProjects[p])),
    line(t("الأعضاء", "Members"), (p) => num(L.seats[p])),
    line(t("التخزين", "Storage"), (p) => L.storage[p]),
    line(t("ضيوف من العملاء", "Client guests"), () => ANY),

    group(t("اكتشف وابنِ", "Discover and build"), plans.length),
    line(t("استبيانات الاكتشاف والإجابات", "Discovery forms and answers"), () => ANY),
    line(t("مركز الاستراتيجية باللغتين", "Bilingual strategy hub"), () => YES),
    line(t("مركز الأصول واستلام الملفات", "Asset library and file intake"), () => YES),
    line(t("تصاميم موقع الدليل", "Guideline site looks"), (p) => num(L.looks[p])),
    line(t("لوحة الاستوديو ومسار المشروع", "Studio board and project path"), () => YES),
    [t("لوحات الإلهام", "Moodboards"), { feature: "moodboard" }, { feature: "moodboard" }, { feature: "moodboard" }],

    group(t("النشر والتسليم", "Publish and hand off"), plans.length),
    line(t("شارة «صُنع بماركيوس»", "“Made with Markyos” badge"), (p) =>
      p === "free" ? t("تظهر", "Shown") : no,
    ),
    line(t("كلمة مرور للمركز", "Hub password"), (p) => (p === "free" ? no : YES)),
    line(t("نطاق خاص قبل التسليم", "Custom domain before handoff"), (p) => (p === "studio" ? YES : no)),
    line(t("التسليم ونقل الملكية", "Handoff and ownership transfer"), () => YES),
    line(t("مكافأة الشريك", "Partner reward"), () => `${PARTNER_SHARE}%`),

    group(t("عقل العلامة، شهرياً", "Brand Brain, each month"), plans.length),
    line(t("التحليل الأول لكل مشروع جديد", "First analysis on every new project"), () => YES),
    line(t("إعادة التحليل", "Analysis re-runs"), (p) => num(L.reruns[p])),
    line(t("نص أقسام الدليل", "Guideline section copy"), (p) => num(L.sectionDrafts[p])),
    line(t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"), (p) => num(L.assistant[p])),
    line(t("موك اب", "Mockups"), (p) => num(L.mockups[p])),
    line(t("موصّل الذكاء الاصطناعي", "AI Connector"), (p) => (p === "free" ? no : YES)),
  ];
}

function companyTable(locale: Locale): Cell[][] {
  const t = translator(locale);
  const L = COMPANY_LIMITS;
  const no = t("لا", "No");
  const plans: CompanyPlan[] = ["free", "company"];
  const line = (label: string, pick: (plan: CompanyPlan) => Cell): Cell[] => [
    label,
    ...plans.map(pick),
  ];

  return [
    group(t("العمل", "Work"), plans.length),
    line(t("العلامات", "Brands"), (p) =>
      p === "free"
        ? "1"
        : {
            text: t(
              `1، وكل إضافية ${dollars(EXTRAS.companyBrand)}`,
              `1, each extra ${money(EXTRAS.companyBrand)}`,
            ),
            strong: true,
          },
    ),
    line(t("المحرّرون لكل علامة", "Editors per brand"), (p) => ({
      text: String(L.editors[p]),
      strong: p === "company",
    })),
    line(t("المشاهدون", "Viewers"), (p) => ({
      text: p === "free" ? String(L.viewers.free) : ANY,
      strong: p === "company",
    })),
    line(t("استوديو متعاون", "Studio collaborator"), (p) => String(L.studioCollaborators[p])),
    line(t("التخزين لكل علامة", "Storage per brand"), (p) => L.storage[p]),

    group(t("ابنِ", "Build"), plans.length),
    line(t("مركز الأصول واستلام الملفات", "Asset library and file intake"), () => YES),
    line(t("مركز الاستراتيجية باللغتين", "Bilingual strategy hub"), () => YES),
    line(t("صوت العلامة وقاموس المصطلحات", "Brand voice and term base"), () => YES),
    line(t("استبيان القيادة", "Leadership questionnaire"), () => YES),
    line(t("تصاميم موقع الدليل", "Guideline site looks"), (p) => String(L.looks[p])),
    [
      t("أدلّة الأقسام", "Department playbooks"),
      { feature: "department-playbooks" },
      { feature: "department-playbooks" },
    ],

    group(t("النشر والمشاركة", "Publish and share"), plans.length),
    line(t("شارة «صُنع بماركيوس»", "“Made with Markyos” badge"), (p) =>
      p === "free" ? t("تظهر", "Shown") : no,
    ),
    line(t("كلمة مرور ونطاق خاص", "Password and custom domain"), (p) => (p === "free" ? no : YES)),
    line(t("روابط الشركاء", "Partner links"), (p) =>
      p === "free" ? t("للعرض فقط", "View only") : t("بموعد وكلمة مرور", "Expiry and password"),
    ),
    line(t("دعوة استوديو دون احتسابه محرّراً", "Invite a studio, not counted as an editor"), () => YES),

    group(t("عقل العلامة، شهرياً لكل علامة", "Brand Brain, each month, per brand"), plans.length),
    line(t("تقرير التوافق الأول", "First alignment report"), () => YES),
    line(t("إعادة تقرير التوافق", "Alignment report re-runs"), (p) =>
      p === "free" ? no : String(L.alignmentReruns.company),
    ),
    line(t("مراجعات نبرة سريعة", "Quick tone checks"), (p) =>
      L.quickChecks[p].toLocaleString("en-US"),
    ),
    line(t("«اسأل علامتك»", "Ask the Brand"), (p) => L.askTheBrand[p].toLocaleString("en-US")),
    line(
      t("مراجعة معمّقة، وإعادة صياغة، وترجمة", "Deep check, rewrite, translate"),
      (p) => L.deepChecks[p].toLocaleString("en-US"),
    ),
    line(t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"), (p) =>
      p === "free" ? no : String(L.assistant.company),
    ),
    line(t("موك اب", "Mockups"), (p) => String(L.mockups[p])),
    line(t("المشاهدون يراجعون كتاباتهم", "Viewers check their own writing"), (p) =>
      p === "free" ? no : YES,
    ),
    line(t("موصّل الذكاء الاصطناعي", "AI Connector"), (p) => (p === "free" ? no : YES)),
  ];
}

/* ── The three panels ──────────────────────────────────────────────────────── */

/*
 * What every plan includes, above the cards.
 *
 * Six sentences that are true of the free plan and of every plan above it,
 * said once per tab instead of once per card.
 */
function includesEveryPlan(locale: Locale, audience: Audience): PageBlock {
  const t = translator(locale);
  const items =
    audience === "companies"
      ? [
          t(
            "استبيان القيادة، وتقرير التوافق الأول لكل علامة مجاناً",
            "The leadership questionnaire, and the first alignment report per brand free",
          ),
          t("مركز الاستراتيجية ومركز الأصول", "Strategy hub and asset library"),
          t("دليل واحد باللغتين", "One guide in both languages"),
          t("صوت العلامة وقاموس المصطلحات", "Brand voice and term base"),
          t(
            "دعوة الاستوديو، دون أن يُحتسب من محرّريك",
            "Invite your studio, without it counting as an editor",
          ),
          t("الصلاحيات على الخادم", "Permissions on the server"),
        ]
      : [
          t(
            "استبيانات اكتشاف وإجابات بلا حدود، باللغتين",
            "Unlimited discovery forms and answers, in both languages",
          ),
          t("التحليل الذكي الأول لكل مشروع، مجاناً", "The first AI brief analysis per project, free"),
          t(
            "مركز الاستراتيجية، ومركز الأصول، ودليل واحد باللغتين",
            "Strategy hub, asset library, and one guide in both languages",
          ),
          t("صوت العلامة وقاموس المصطلحات لعميلك", "Brand voice and term base for your client"),
          t("التسليم ونقل الملكية، ومكافأة الشريك", "Handoff, ownership transfer, and the partner reward"),
          t(
            "ضيوف من العملاء بلا حدود، والصلاحيات على الخادم",
            "Unlimited client guests, and permissions on the server",
          ),
        ];

  return {
    kind: "terms",
    title: t("في كل خطة، حتى المجانية.", "In every plan, free included."),
    cols: 3,
    items: items.map((term) => ({ term })),
  };
}

/*
 * The add-ons, on the tab they belong to.
 *
 * v5.2 §5 says to show the rows that match the active tab, and the reason is
 * that an extra editor at $8 is a company's answer and an extra member at $8
 * is a studio's — the same price for two different things, and a reader who
 * sees both at once has to work out which is theirs.
 */
function addOnsBlock(locale: Locale, audience: Audience): PageBlock {
  const t = translator(locale);
  const once = (value: number) =>
    t(`${dollars(value)} مرة واحدة`, `${money(value)} once`);
  const monthly = (value: number) =>
    t(`${dollars(value)} شهرياً`, `${money(value)} a month`);

  const rows: Cell[][] =
    audience === "companies"
      ? [
          [t("علامة إضافية", "Extra brand"), monthly(EXTRAS.companyBrand), t("لكل علامة أخرى تديرها الشركة.", "For every other brand the company runs.")],
          [t("محرّر إضافي", "Extra editor"), monthly(EXTRAS.companyEditor), t("محرّر سادس على علامة، وسابع.", "A sixth editor on a brand, and a seventh.")],
          [t("حزمة عقل العلامة", "Brand Brain pack"), once(EXTRAS.brainPack), t("100 مهمة كتابة، و60 رسالة للمساعد.", "100 writing tasks and 60 assistant messages.")],
          [t("حزمة الموك اب", "Mockup pack"), once(EXTRAS.mockupPack), t("60 موك اب.", "60 AI mockups.")],
        ]
      : [
          [t("عضو إضافي", "Extra member"), monthly(EXTRAS.seat), t("عضو سادس، وسابع، وما تحتاج.", "A sixth member, a seventh, as many as you need.")],
          [t("5 علامات نشطة و50 جيجابايت", "5 more active brands and 50 GB"), monthly(EXTRAS.brands5), t("حين يكبر عدد عملائك في الوقت نفسه.", "For when more clients run at the same time.")],
          [t("حزمة عقل العلامة", "Brand Brain pack"), once(EXTRAS.brainPack), t("100 مهمة كتابة، و60 رسالة للمساعد.", "100 writing tasks and 60 assistant messages.")],
          [t("حزمة الموك اب", "Mockup pack"), once(EXTRAS.mockupPack), t("60 موك اب.", "60 AI mockups.")],
        ];

  return {
    kind: "table",
    title: t("حين تحتاج أكثر.", "When you need more."),
    head: [t("الإضافة", "Add-on"), t("السعر", "Price"), t("لماذا", "What for")],
    rows,
    note: t(
      `الحزم صالحة ${PACK_MONTHS} شهراً، وتُستخدم بعد انتهاء حدّك الشهري، وهي للخطط المدفوعة وحدها.`,
      `Packs last ${PACK_MONTHS} months and are used after your monthly limit runs out. Paid plans only.`,
    ),
  };
}

/*
 * The handoff section, on the two builder tabs.
 *
 * A company reading "the studio builds, the client owns" is being told about
 * somebody else's business model, so the companies tab does not get it. One
 * rate now: v4.3's 25% belonged to the Agency plan, and that plan is gone.
 */
function handoffBlock(locale: Locale): PageBlock {
  const t = translator(locale);

  return {
    kind: "terms",
    title: t("الاستوديو يبني، والعميل يملك، والعائد مستمر.", "The studio builds. The client owns. The return keeps coming."),
    lead: t(
      `التسليم مجاني دائماً، والمركز يبقى حيّاً على الخطة المجانية لعميلك. وحين يشترك في خطة «${PLAN_NAMES[locale].company}»، تحصل على ${PARTNER_SHARE}% مما يدفعه في سنته الأولى، رصيداً على فاتورتك ما دمت على خطة مدفوعة.`,
      `Handoff is always free, and the hub stays live on your client's free plan. When they subscribe to ${PLAN_NAMES[locale].company}, you get ${PARTNER_SHARE}% of what they pay in their first year, as credit on your bill while you are on a paid plan.`,
    ),
    cols: 3,
    items: [
      {
        term: t("عميل واحد", "One client"),
        body: t(`${partnerCredit(1)} شهرياً`, `${partnerCredit(1)} a month`),
      },
      {
        term: t("أربعة عملاء", "Four clients"),
        body: t(
          `${partnerCredit(4)} شهرياً، أي خطة «${PLAN_NAMES[locale].freelancer}» كاملة`,
          `${partnerCredit(4)} a month, your whole ${PLAN_NAMES[locale].freelancer} plan`,
        ),
      },
      {
        term: t("ثمانية عملاء", "Eight clients"),
        body: t(
          `${partnerCredit(8)} شهرياً، أي خطة «${PLAN_NAMES[locale].studio}» كاملة`,
          `${partnerCredit(8)} a month, your whole ${PLAN_NAMES[locale].studio} plan`,
        ),
      },
    ],
  };
}

/*
 * A panel: one tab's chooser, strip, cards, table and add-ons.
 *
 * Nothing inside a panel carries an `id`. Every panel is in the HTML so all
 * nine cards are crawled and findable in a browser's own search, and an id in
 * one panel is either a duplicate of its opposite number — Free is on two tabs
 * and Studio is on two tabs — or an anchor that scrolls into something hidden.
 * `check:pricing` walks the whole block tree and fails on a repeat.
 */
function audiencePanel(locale: Locale, audience: Audience): PageBlock[] {
  const t = translator(locale);
  const names = PLAN_NAMES[locale];

  const common = {
    recommendedLabel: t("موصى بها", "Recommended"),
    labels: { pick: t("اخترها إن", "Pick it if"), moveUp: t("انتقل للتالية حين", "Move up when") },
    billing: {
      label: t("الفوترة", "Billing"),
      monthly: t("شهرياً", "Monthly"),
      annual: t("سنوياً (شهران مجاناً)", "Yearly (two months free)"),
    },
  };

  const trialNote = t(
    `بدون بطاقة. بعد ${TRIAL.days} يوماً تنتقل إلى المجانية إن لم تشترك، ولا يُحذف شيء.`,
    `No card needed. After ${TRIAL.days} days you move to Free unless you subscribe. Nothing is deleted.`,
  );

  if (audience === "freelancers") {
    return [
      {
        kind: "chooser",
        title: t(
          "كم عميلاً تعمل معه في الوقت نفسه؟",
          "How many clients do you work with at the same time?",
        ),
        label: t("عدد عملائك", "How many clients"),
        options: [
          { label: t("واحد", "One"), target: planId("freelancers", "free") },
          { label: t("من واحد إلى ثلاثة", "One to three"), target: planId("freelancers", "freelancer") },
          { label: t("أكثر من ثلاثة", "More than three"), target: planId("freelancers", "studio") },
          {
            label: t("يعمل معي فريق", "I have a team"),
            target: "tab:studios",
            note: t("خطط الفرق في تبويب «الاستوديوهات».", "Team plans are on the Studios tab."),
          },
        ],
      },
      includesEveryPlan(locale, audience),
      { kind: "plans", ...common, plans: freelancerCards(locale), note: trialNote },
      {
        kind: "table",
        title: t("كل حدّ، خطةً بخطة.", "Every limit, plan by plan."),
        numeric: true,
        head: [t("الحد", "Limit"), names.free, names.freelancer, names.studio],
        rows: builderTable(locale),
      },
      addOnsBlock(locale, audience),
      handoffBlock(locale),
    ];
  }

  if (audience === "studios") {
    return [
      {
        kind: "chooser",
        title: t("كم شخصاً في فريقك؟", "How many people are on your team?"),
        label: t("حجم فريقك", "How big your team is"),
        options: [
          { label: t("أنا وحدي", "Just me"), target: planId("studios", "free") },
          { label: t("حتى خمسة", "Up to five"), target: planId("studios", "studio") },
          { label: t("أكثر من خمسة", "More than five"), target: planId("studios", "bigger-team") },
        ],
      },
      includesEveryPlan(locale, audience),
      { kind: "plans", ...common, plans: studioCards(locale), note: trialNote },
      {
        kind: "table",
        title: t("كل حدّ، خطةً بخطة.", "Every limit, plan by plan."),
        numeric: true,
        head: [t("الحد", "Limit"), names.free, names.freelancer, names.studio],
        rows: builderTable(locale),
      },
      addOnsBlock(locale, audience),
      handoffBlock(locale),
    ];
  }

  return [
    {
      kind: "chooser",
      title: t("كم شخصاً يعدّل علامتك؟", "How many people edit your brand?"),
      label: t("عدد المحرّرين", "How many editors"),
      options: [
        { label: t("واحد", "One"), target: planId("companies", "free") },
        { label: t("حتى خمسة", "Up to five"), target: planId("companies", "company") },
        {
          label: t("أكثر من ذلك", "More than that"),
          target: planId("companies", "company"),
          note: t(
            `كل محرّر بعد الخامس ${dollars(EXTRAS.companyEditor)} شهرياً، والمشاهدون بلا حدود.`,
            `Every editor past the fifth is ${money(EXTRAS.companyEditor)} a month, and viewers are unlimited.`,
          ),
        },
        {
          label: t("عدة علامات وفرق كبيرة", "Several brands, large teams"),
          target: planId("companies", "enterprise"),
        },
      ],
    },
    includesEveryPlan(locale, audience),
    { kind: "plans", ...common, plans: companyCards(locale), note: trialNote },
    {
      kind: "table",
      title: t("كل حدّ، خطةً بخطة.", "Every limit, plan by plan."),
      numeric: true,
      head: [t("الحد", "Limit"), names.free, `${names.company} · ${money(PLAN_PRICES.company)}`],
      rows: companyTable(locale),
    },
    addOnsBlock(locale, audience),
  ];
}

/* ── The page ──────────────────────────────────────────────────────────────── */

export function currentPricingPage(locale: Locale): PageDoc {
  const t = translator(locale);
  const names = PLAN_NAMES[locale];

  return {
    path: "/pricing",
    shortTitle: t("الأسعار", "Pricing"),
    title: t("الأسعار والخطط · ماركيوس", "Pricing and Plans · Markyos"),
    description: t(
      `جرّب أي خطة ${TRIAL.days} يوماً دون بطاقة دفع. «${names.freelancer}» بـ${dollars(PLAN_PRICES.freelancer)}، و«${names.studio}» بـ${dollars(PLAN_PRICES.studio)}، و«${names.company}» بـ${dollars(PLAN_PRICES.company)} لكل علامة، وخطة مجانية دائماً.`,
      `Try any plan free for ${TRIAL.days} days, no card needed. ${names.freelancer} ${money(PLAN_PRICES.freelancer)}, ${names.studio} ${money(PLAN_PRICES.studio)}, ${names.company} ${money(PLAN_PRICES.company)} per brand, and a free plan, always.`,
    ),
    breadcrumbs: [{ label: t("الرئيسية", "Home"), href: "/" }],
    priority: 0.9,
    blocks: [
      {
        kind: "hero",
        title: t("ابدأ مجاناً. ادفع حين يبدأ العمل.", "Start free. Pay when it's working."),
        lead: t(
          "باقة واحدة لكل طريقة عمل، وكل حدودها أمامك.",
          "One plan for each way of working, every limit in plain sight.",
        ),
      },

      /*
       * The offer, above the prices it changes.
       *
       * A visitor who reads a column of cards and then finds out the figures
       * on them were not the figures they would pay has been made to do the
       * arithmetic twice. The cards carry the list price, which is the price
       * from the fourth month on; the discount lives in one block that knows
       * its own end date and takes itself down.
       */
      {
        kind: "offer",
        id: "launch-offer",
        eyebrow: t("عرض الإطلاق", "Launch offer"),
        title: t(
          `خصم ${LAUNCH_OFFER.percent}% على أول ${LAUNCH_OFFER.months} أشهر.`,
          `${LAUNCH_OFFER.percent}% off your first ${LAUNCH_OFFER.months} months.`,
        ),
        lead: t(
          `يُطبَّق تلقائياً عند الاشتراك الشهري قبل انتهاء العرض، على أي خطة مدفوعة. بعد ثلاثة أشهر تعود الخطة إلى سعرها المعتاد، ويمكنك الإلغاء قبل ذلك.`,
          `It applies automatically when you subscribe monthly before the offer ends, on any paid plan. After three months the plan returns to its usual price, and you can cancel before then.`,
        ),
        opens: LAUNCH_OFFER.opens,
        closes: LAUNCH_OFFER.closes,
        window: t(
          "العرض مفتوح الآن، وينتهي في 15 فبراير 2027.",
          "The offer is open now and ends on 15 Feb 2027.",
        ),
        countdown: {
          before: t("يبدأ العرض بعد", "The offer opens in"),
          during: t("ينتهي العرض بعد", "The offer ends in"),
          after: t("انتهى عرض الإطلاق.", "The launch offer has ended."),
          units:
            locale === "ar"
              ? { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
              : { days: "days", hours: "hours", minutes: "mins", seconds: "secs" },
        },
        rowHead: [
          t("الخطة", "Plan"),
          t("السعر الشهري", "A month"),
          t("أول ثلاثة أشهر", "First three months"),
        ],
        rows: LAUNCH_OFFER.plans.map((plan) => ({
          label: PLAN_NAMES[locale][plan],
          was: money(PLAN_PRICES[plan]),
          now: launchPrice(plan),
        })),
        terms: [
          t(
            "العرض للاشتراك الشهري وحده، ولا يجتمع مع الاشتراك السنوي، فالسنوي فيه شهران مجاناً أصلاً.",
            "The offer is for monthly billing only. It does not combine with yearly billing, which already gives two months free.",
          ),
          t(
            "لا يشمل العرض الحزم ولا الإضافات، ويُستخدم مرة واحدة لكل مساحة عمل.",
            "It does not cover the packs or the add-ons, and it is one use per workspace.",
          ),
          t(
            `يجتمع العرض مع التجربة: جرّب ${TRIAL.days} يوماً، ثم اشترك شهرياً قبل نهاية العرض.`,
            `It combines with the trial: try it for ${TRIAL.days} days, then subscribe monthly before the offer ends.`,
          ),
        ],
      },

      {
        kind: "terms",
        id: "trial",
        title: t(
          `جرّب أي خطة مدفوعة ${TRIAL.days} يوماً، دون بطاقة دفع.`,
          `Try any paid plan for ${TRIAL.days} days. No card needed.`,
        ),
        cols: 2,
        items: [
          {
            term: t("تبدأ على خطتك", "You start on your plan"),
            body: t(
              `تبدأ مساحتك الجديدة على الخطة المناسبة لك: «${names.freelancer}»، أو «${names.studio}»، أو «${names.company}».`,
              `Your new workspace starts on the plan that fits you: ${names.freelancer}, ${names.studio} or ${names.company}.`,
            ),
          },
          {
            term: t("نذكّرك مرتين", "We remind you twice"),
            body: t(
              `في اليوم ${TRIAL.reminderDays[0]} واليوم ${TRIAL.reminderDays[1]}.`,
              `On day ${TRIAL.reminderDays[0]} and day ${TRIAL.reminderDays[1]}.`,
            ),
          },
          {
            term: t("ولا يُحذف شيء", "And nothing is deleted"),
            body: t(
              `إن لم تشترك، تنتقل إلى المجانية في اليوم ${TRIAL.freeFromDay}، ويبقى كل ما بنيته، وما يزيد عن حدود المجانية يصبح للقراءة فقط.`,
              `If you don't subscribe, you move to Free on day ${TRIAL.freeFromDay}. Everything you built stays, and anything over the Free limits becomes read only.`,
            ),
          },
          {
            term: t("ولا شارة أثناء التجربة", "No badge during the trial"),
            body: t(
              "شارة «صُنع بماركيوس» لا تظهر على ما تنشره في أيام التجربة.",
              "The “Made with Markyos” badge does not show on what you publish during the trial.",
            ),
          },
        ],
      },

      /*
       * The switch, and nine cards on three tabs.
       *
       * `/pricing#studios` opens a tab and scrolls to the switch;
       * `/pricing?for=studios` opens it without scrolling, which is what a
       * link in a message should do. Both are the contract the three audience
       * pages point at.
       */
      {
        kind: "audience",
        id: "choose",
        label: t("من أنت", "Who you are"),
        param: "for",
        lead: t(
          "تعمل وحدك؟ اختر «المستقلون». معك فريق؟ «الاستوديوهات». العلامة لشركتك؟ «الشركات».",
          "Work alone? Pick Freelancers. Have a team? Studios. Is it your own company's brand? Companies.",
        ),
        options: AUDIENCES.map((audience) => ({
          id: audience,
          label: audienceLabel(locale, audience),
          blocks: audiencePanel(locale, audience),
        })),
      },

      {
        kind: "terms",
        id: "limits",
        title: t("لكل أداة حدّها. ولا فاتورة مفاجئة.", "Every tool has its own limit. No surprise bills."),
        cols: 2,
        items: [
          {
            term: t("حدّ لكل أداة", "One limit per tool"),
            body: t(
              "لكل أداة ذكاء حدّ شهري خاص بها. وإن انتهى حدّ أداة، تتوقف وحدها وتبقى البقية تعمل.",
              "Every AI tool has its own monthly limit. If one runs out, only that tool stops; the rest keep working.",
            ),
          },
          {
            term: t("والأساسيات مجانية", "The basics are free"),
            body: t(
              "التحليل الأول لكل مشروع جديد، وتقرير التوافق الأول لكل علامة: في كل خطة.",
              "The first analysis on every new project, and the first alignment report for every brand, on every plan.",
            ),
          },
          {
            term: t("تتجدد كل شهر", "They renew monthly"),
            body: t(
              "ولا يُرحَّل ما لم تستخدمه.",
              "What you don't use doesn't roll over.",
            ),
          },
          {
            term: t("وفي خطة الشركة للعلامة كلها", "On Company they belong to the brand"),
            body: t(
              "الحدود للعلامة لا للشخص، ولكل مشاهد حدّ يومي صغير حتى لا يستهلكها شخص واحد.",
              "Limits belong to the whole brand, and each viewer has a small daily limit so no one person uses them up.",
            ),
          },
          {
            term: t("وقراءة أدواتك لا تُحسب", "Your own tools don't count"),
            body: t(
              "قراءة علامتك من ChatGPT أو Claude عبر موصّل الذكاء الاصطناعي لا تُحسب من أي حدّ.",
              "Reading your brand from ChatGPT or Claude through the AI Connector doesn't count against any limit.",
            ),
          },
          {
            term: t("وإن احتجت أكثر", "If you need more"),
            body: t(
              "أضف حزمة. ولا شيء يُخصم دون أن تطلبه.",
              "Add a pack. Nothing is charged unless you ask for it.",
            ),
          },
        ],
      },

      {
        kind: "terms",
        id: "badge",
        title: t("مجانية، وبتوقيعنا الصغير.", "Free, with our small signature."),
        lead: t(
          "كل ما تنشره من الخطة المجانية، من الاستبيان إلى الدليل والمركز، يحمل شارة صغيرة «صُنع بماركيوس». وتختفي الشارة في كل الخطط المدفوعة، وأثناء التجربة.",
          "Everything you publish on the free plan, from the form to the guide and the hub, carries a small “Made with Markyos” badge. The badge disappears on every paid plan, and during the trial.",
        ),
        cols: 1,
        items: [],
      },

      {
        kind: "terms",
        id: "billing",
        title: t("دفعٌ واضح، وإلغاءٌ أوضح.", "Clear billing. Clearer cancelling."),
        cols: 2,
        items: [
          {
            term: t("العملة", "Currency"),
            body: t(
              "الدولار الأمريكي، والأسعار قبل ضريبة القيمة المضافة.",
              "US dollars, before VAT.",
            ),
          },
          {
            term: t("الدفع", "Payment"),
            body: t("عبر PayPal، بحسابك أو ببطاقتك.", "Through PayPal, with your PayPal account or your card."),
          },
          {
            term: t("طرق دفع أخرى", "More ways to pay"),
            body: t(
              "تصل قريباً، ومنها بطاقات مدى. وحين تصل نخبرك قبلها، وتبقى خطتك وسعرك كما هما.",
              "Coming soon, including Mada cards. When they arrive, we'll tell you first, and your plan and price stay the same.",
            ),
          },
          {
            term: t("السنوي", "Yearly"),
            body: t(
              "تدفع السنة مقدّماً، وتحصل على شهرين مجاناً.",
              "Pay for the year upfront and get two months free.",
            ),
          },
          {
            term: t("الترقية", "Upgrades"),
            body: t(
              "تفتح حدود خطتك الجديدة فوراً، ويبدأ سعرها من تاريخ فوترتك التالي.",
              "Your new limits open right away; the new price starts on your next billing date.",
            ),
          },
          {
            term: t("التخفيض والإلغاء", "Downgrades and cancelling"),
            body: t(
              "متى شئت، ويسري في نهاية الفترة. لا يُحذف شيء، ويصبح ما يزيد على الحد للقراءة فقط.",
              "Any time, from the end of the period. Nothing is deleted; anything over the limit becomes read-only.",
            ),
          },
        ],
      },

      {
        kind: "faq",
        id: "faq",
        title: t("أسئلة، وأجوبة قصيرة.", "Questions. Short answers."),
        items: [
          {
            q: t("ماذا يحدث بعد التجربة؟", "What happens after the trial?"),
            a: t(
              "تنتقل إلى المجانية إن لم تشترك. يبقى كل ما بنيته، وما يزيد عن حدود المجانية يصبح للقراءة فقط.",
              "You move to Free unless you subscribe. Everything you built stays; anything over the Free limits becomes read only.",
            ),
          },
          {
            q: t("هل أحتاج بطاقة؟", "Do I need a card?"),
            a: t("لا. تحتاجها فقط حين تشترك.", "No. Only when you subscribe."),
          },
          {
            q: t("ما العلامة النشطة؟", "What is an active brand?"),
            a: t(
              "علامة ما زلت تعمل عليها. حين تسلّمها لعميلك، لا تُحتسب عليك.",
              "A brand you're still working on. Once you hand it to your client, it stops counting.",
            ),
          },
          {
            q: t("من يُحتسب محرّراً؟", "Who counts as an editor?"),
            a: t(
              `من يعدّل محتوى العلامة. المشاهدون من فريقك بلا حدود ولا يُحتسبون، وخطة «${names.company}» فيها خمسة محرّرين لكل علامة، والسادس ${dollars(EXTRAS.companyEditor)} شهرياً.`,
              `Anyone who changes the brand's content. Viewers on your team are unlimited and don't count. ${names.company} includes five editors per brand, and a sixth is ${money(EXTRAS.companyEditor)} a month.`,
            ),
          },
          {
            q: t("ماذا يكسب الاستوديو؟", "What does my studio earn?"),
            a: t(
              `${PARTNER_SHARE}% مما يدفعه عميلك في سنته الأولى، رصيداً على فاتورتك حين تكون على باقة مدفوعة.`,
              `${PARTNER_SHARE}% of what your client pays in their first year, as credit on your bill while you're on a paid plan.`,
            ),
          },
          {
            q: t("هل الأسعار قبل الضريبة؟", "Are prices before VAT?"),
            a: t(
              "نعم، الأسعار بالدولار وقبل ضريبة القيمة المضافة.",
              "Yes. Prices are in US dollars, before VAT.",
            ),
          },
        ],
      },

      {
        kind: "faq",
        id: "faq-more",
        title: t("وأسئلة أخرى.", "And a few more."),
        items: [
          {
            q: t(
              `لماذا لا يوجد مدقّق النبرة في «${names.freelancer}» و«${names.studio}»؟`,
              `Why isn't the tone checker on ${names.freelancer} or ${names.studio}?`,
            ),
            a: t(
              "لأنه أداة لمن يكتب باسم العلامة كل يوم، أي فريق الشركة. وحين تسلّم عميلك مركزه، يجده في خطته.",
              "Because it's for the people who write as the brand every day: the company's team. When you hand off the hub, your client finds it on their plan.",
            ),
          },
          {
            q: t("مساحة استوديو ومساحة شركة معاً؟", "A studio and a company workspace together?"),
            a: t("نعم، بحساب واحد.", "Yes, on one account."),
          },
          {
            q: t("هل أحتاج إلى استوديو؟", "Do I need a studio?"),
            a: t("لا. الشركة تبدأ وحدها.", "No. A company can start on its own."),
          },
          {
            q: t("ماذا يحدث إن انتهى حدّ أداة؟", "What if a tool's limit runs out?"),
            a: t(
              "تتوقف تلك الأداة وحدها حتى الشهر التالي، أو حتى تضيف حزمة. وتبقى البقية تعمل.",
              "That tool stops until next month, or until you add a pack. The rest keep working.",
            ),
          },
          {
            q: t("هل أربط ChatGPT أو Claude بعلامتي؟", "Can I connect ChatGPT or Claude?"),
            a: t(
              "نعم، في كل الخطط المدفوعة. يقرأ فقط، ولا يُحسب من حدودك.",
              "Yes, on every paid plan. It only reads, and doesn't count against your limits.",
            ),
          },
          {
            q: t("هل يصمّم الذكاء الاصطناعي الشعارات؟", "Does the AI design logos?"),
            a: t(
              "أبداً. يقرأ ويكتب مسودات، وفي صانع الموك اب يضع هويتك أنت على القوالب.",
              "Never. It reads and drafts words, and in the mockup builder it puts your own identity on the templates.",
            ),
          },
        ],
      },

      {
        kind: "cta",
        title: t("ابدأ مجاناً اليوم.", "Start free today."),
        lead: t(
          `جرّب ${TRIAL.days} يوماً مجاناً، دون بطاقة دفع.`,
          `Try it free for ${TRIAL.days} days. No card needed.`,
        ),
        buttons: [
          { label: t("أصمّم هويات لعملائي", "I design brands for clients"), href: "/start?type=studio" },
          { label: t("أدير علامة شركتي", "I run my company's brand"), href: "/start?type=company" },
        ],
      },
    ],
  };
}

/* ── The announcement bar and the homepage teaser ──────────────────────────── */

export function currentLaunchOffer(locale: Locale): OfferBarCopy | null {
  const t = translator(locale);
  return {
    label: t(
      `عرض الإطلاق: خصم ${LAUNCH_OFFER.percent}% على أول ${LAUNCH_OFFER.months} أشهر`,
      `Launch offer: ${LAUNCH_OFFER.percent}% off your first ${LAUNCH_OFFER.months} months`,
    ),
    short: t(
      `خصم ${LAUNCH_OFFER.percent}% لثلاثة أشهر`,
      `${LAUNCH_OFFER.percent}% off for three months`,
    ),
    opens: LAUNCH_OFFER.opens,
    closes: LAUNCH_OFFER.closes,
    window: t("ينتهي العرض في 15 فبراير 2027.", "The offer ends on 15 Feb 2027."),
    countdown: {
      before: t("يبدأ بعد", "Opens in"),
      during: t("ينتهي بعد", "Ends in"),
      after: t("انتهى عرض الإطلاق.", "The launch offer has ended."),
      units:
        locale === "ar"
          ? { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
          : { days: "days", hours: "hours", minutes: "mins", seconds: "secs" },
    },
    link: { label: t("اطّلع على العرض", "See the offer"), href: "/pricing#launch-offer" },
    close: t("إغلاق", "Close"),
  };
}

/*
 * The homepage teaser.
 *
 * Three tabs, the same three /pricing has, read from the same cards. The grid
 * is `auto-fit, minmax(280px, 1fr)` inside a 1040px container, so three cards
 * is exactly what fits — and with v5.2 three is also all there is on every
 * tab, which the five-card company tab of v4.3 never managed.
 */
export function currentPricingTeaser(locale: Locale): PricingTeaserCopy {
  const t = translator(locale);
  const names = PLAN_NAMES[locale];

  const teaser = (card: PlanCard): PlanCopy => ({
    name: card.name,
    price: card.period ? `${card.price} ${card.period}` : card.price,
    /* Four rows on the homepage, every row on /pricing: the teaser is an
       invitation to compare, not the comparison. */
    rows: card.rows.slice(0, 4),
    line: card.who ?? "",
    recommended: card.recommended,
    cta: card.cta ?? { label: t("ابدأ مجاناً", "Start free"), href: "/start" },
  });

  return {
    headline: t("ابدأ مجاناً. ادفع حين يبدأ العمل.", "Start free. Pay when it's working."),
    body: t(
      `جرّب أي خطة مدفوعة ${TRIAL.days} يوماً دون بطاقة دفع، والخطط من ${dollars(LOWEST_PAID_MONTHLY)} شهرياً.`,
      `Try any paid plan for ${TRIAL.days} days with no card, with plans from ${money(LOWEST_PAID_MONTHLY)} a month.`,
    ),
    audiences: [
      {
        id: "freelancers",
        label: audienceLabel(locale, "freelancers"),
        plans: freelancerCards(locale).map(teaser),
        note: t(
          `علامة واحدة مجاناً، وثلاث في «${names.freelancer}»، وعشر في «${names.studio}». والمسلّمة لا تُحتسب.`,
          `One brand free, three on ${names.freelancer}, ten on ${names.studio}. Handed-off brands don't count.`,
        ),
      },
      {
        id: "studios",
        label: audienceLabel(locale, "studios"),
        plans: studioCards(locale).map(teaser),
        note: t(
          `عشر علامات لفريق من خمسة، وما بعدها بالإضافات: خمس علامات بـ${dollars(EXTRAS.brands5)}، وعضو بـ${dollars(EXTRAS.seat)}.`,
          `Ten brands for a team of five, and past that with add-ons: five brands for ${money(EXTRAS.brands5)}, a member for ${money(EXTRAS.seat)}.`,
        ),
      },
      {
        id: "companies",
        label: audienceLabel(locale, "companies"),
        plans: companyCards(locale).map(teaser),
        note: t(
          `تدفع لكل علامة، والمشاهدون بلا حدود، والمحرّرون خمسة لكل علامة.`,
          `You pay per brand, viewers are unlimited, and editors are five per brand.`,
        ),
      },
    ],
    recommendedLabel: t("موصى بها", "Recommended"),
    underBoth: t(
      "لكل أداة ذكية حدّ شهري واضح. وإن نفد، تتوقف تلك الأداة وحدها.",
      "Every AI tool has a clear monthly limit. If one runs out, only that tool pauses.",
    ),
    link: { label: t("اطّلع على الأسعار", "See full pricing"), href: "/pricing" },
  };
}
