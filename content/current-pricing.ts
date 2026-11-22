import type { Cell, PageBlock, PageDoc, PlanCard } from "./pages/types";
import type { OfferBarCopy, PlanCopy, PricingTeaserCopy } from "./types";

type Locale = "en" | "ar";

/*
 * ── The pricing catalogue · copy deck v4.3, 22 Nov 2026 ─────────────────────
 *
 * v4.3 replaces v4.2 four weeks after it shipped, and the thing it changes is
 * not the prices. It changes who the page is talking to.
 *
 *   1. **Three audiences, not two.** Freelancers and studios used to share a
 *      panel, which meant a person working alone read a column of seats and
 *      team prices to find out that neither applied to them. They are now
 *      their own tab, with their own plans: Free, Solo at $12, Pro at $24.
 *   2. **Eleven plans.** Studios gain Agency at $119 and companies gain
 *      Business at $119 -- capacity plans only: more projects, seats, brands,
 *      editors and AI. No white-label portal and no sub-brands; those stayed
 *      off the roadmap, and nothing here implies them.
 *   3. **Pro is five projects, not three**, so it is a real step up from Solo
 *      rather than one project of difference for twice the money.
 *   4. **Every limit on every card**, in the same rows in the same order, plus
 *      the two sentences that actually decide a plan: pick it if, and move up
 *      when.
 *   5. **One question per tab.** The chooser asks the single fact that decides
 *      the plan -- clients at once, people on the team, brands and editors --
 *      and lights the card. Nobody has to read eleven cards to find theirs.
 *
 * Carried over from v4.2, unchanged: a monthly limit per AI tool instead of a
 * pool of credits ("billing credit" survives, for the partner reward only),
 * PayPal rather than Stripe, and therefore a launch offer that is half off
 * three monthly cycles rather than half off a year.
 *
 * ── What this repository cannot guarantee ───────────────────────────────────
 *
 * That any of it exists in billing. This is a marketing site; the charge is
 * made by the platform, and the platform sells what `CURRENT_PRICES` below
 * describes: one one-time pass and one monthly subscription per account type.
 * None of the eleven plans on this page is in that catalogue, and PayPal is
 * not connected.
 *
 * So **no CTA on this page goes to a paid checkout.** Every button creates a
 * free account or opens a conversation, which is the one shape that lets the
 * page state the new prices without the checkout contradicting them at the
 * moment of payment. `check:pricing` asserts exactly that, and it is the
 * assertion to delete the day billing catches up -- not before.
 *
 * The deck's own Open item 7 says it plainly: prices and limits are hypotheses
 * until the cost test closes on 1 February 2027.
 */

/*
 * What the checkout charges today, per account type, in USD.
 *
 * These no longer appear anywhere on the site. They stay because they are the
 * contract `check:pricing` holds against the backend's `billing.py` and the
 * platform's `accountTypes.ts`: the moment either of those moves to the v4.3
 * catalogue, this constant is what fails and tells us. Deleting it would not
 * simplify anything -- it would remove the only tie between this repository
 * and what a card is actually charged.
 */
export const CURRENT_PRICES = {
  freelancer: { pass: 15, subscription: 19 },
  studio: { pass: 19, subscription: 29 },
  company: { pass: 49, subscription: 99 },
} as const;

/*
 * The eight paid plans, monthly and yearly-per-month, from v4.3's cards.
 *
 * `yearly` is a second list price, not a derived one: "save about 20%" is the
 * deck's rounding of four different real discounts (20.8%, 16.9%, 16.8%,
 * 16.7%), so computing it would produce $19.20 where the deck says $19.
 * `check:pricing` holds every one of them to a band instead -- between 15% and
 * 25% off -- which is what keeps the toggle's promise true without inventing a
 * figure.
 *
 * Solo and Starter are the same $12, and Brand is the same $24 as Pro, because
 * a company's small plan and a freelancer's are the same amount of product
 * sold to different people. They are separate entries rather than aliases:
 * they diverge the moment either audience's cost test closes differently.
 */
const PLAN_PRICES = {
  solo: { monthly: 12, yearly: 10 },
  pro: { monthly: 24, yearly: 19 },
  studio: { monthly: 59, yearly: 49 },
  agency: { monthly: 119, yearly: 99 },
  starter: { monthly: 12, yearly: 10 },
  brand: { monthly: 24, yearly: 19 },
  team: { monthly: 59, yearly: 49 },
  business: { monthly: 119, yearly: 99 },
} as const;

type PaidPlan = keyof typeof PLAN_PRICES;

/** The floor the homepage quotes. Derived, so the sentence moves with the plans. */
export const LOWEST_PAID_MONTHLY = Math.min(
  ...Object.values(PLAN_PRICES).map((plan) => plan.monthly),
);

/** The one-time and per-seat figures from v4.3's "when you need more". */
export const EXTRAS = {
  projectPass: 19,
  brainPack: 12,
  mockupPack: 12,
  seat: 8,
  enterpriseFrom: 299,
} as const;

/**
 * The studio's share of a handed-off client's first year, as billing credit.
 *
 * v4.3 raises it on one plan only: an agency that hands off a dozen brands a
 * year is the reason the reward exists, so the reward is better there.
 */
export const PARTNER_SHARE = 20;
export const AGENCY_PARTNER_SHARE = 25;

/*
 * The launch offer.
 *
 * Half off the first three monthly cycles of the six plans that can carry it.
 * Solo and Starter are out: at $6 the payment fee and the AI behind the plan
 * take the whole price, which is why v4.3 states their price as fixed on the
 * cards themselves rather than leaving a reader to notice the omission. The
 * pass, the packs and extra seats are out because they are not subscriptions.
 *
 * ── The window ──────────────────────────────────────────────────────────────
 *
 * v4.3 leaves the end date as [PLACEHOLDER], as v4.2 did. It keeps the instant
 * the site has carried since 21 Nov: the end of 15 Feb 2027, which is
 * PUBLIC_LAUNCH_DATE in src/lib/launch.ts. Both instants are written in UTC
 * rather than as dates, because a countdown that resolves "15 Feb 2027" in the
 * reader's own zone ends at a different moment in Riyadh than in London, and
 * this is one offer.
 *
 * `opens` is in the past, so every clock on the site runs to the close. The
 * `before` phase is kept rather than deleted because the next offer may well
 * be scheduled rather than live.
 */
export const LAUNCH_OFFER = {
  /** Per cent off, for `months` monthly cycles. Yearly billing is not discounted. */
  percent: 50,
  months: 3,
  /** The plans it applies to. Solo and Starter are deliberately absent. */
  plans: ["pro", "studio", "agency", "brand", "team", "business"] as readonly PaidPlan[],
  opens: "2026-11-21T00:00:00Z",
  closes: "2027-02-15T23:59:59Z",
} as const;

/** `$1,188` and `$29.50`: a four-figure price keeps its separator, a cent figure both digits. */
function money(value: number): string {
  const digits = Number.isInteger(value) ? 0 : 2;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

/** A plan's launch price: always derived, never typed. */
function launchPrice(plan: PaidPlan): string {
  return money((PLAN_PRICES[plan].monthly * (100 - LAUNCH_OFFER.percent)) / 100);
}

/** The studio's monthly billing credit from `clients` clients on a given plan. */
export function partnerCredit(clients: number, plan: PaidPlan = "brand"): string {
  return money((clients * PLAN_PRICES[plan].monthly * PARTNER_SHARE) / 100);
}

/*
 * The monthly limits, one table per audience.
 *
 * Every number v4.3 gives for an AI tool lives here once, and the plan cards,
 * the comparison tables and the three feature pages that quote an allowance
 * all read it. They disagreed in the deck's own draft history more than once
 * -- the Team quick-check figure moved from 3,000 to 2,500 between v4.1 and
 * v4.2 and was still 3,000 on /solutions/companies a deck later -- and a card
 * that says 2,500 above a table that says 3,000 is the kind of error a reader
 * finds before we do.
 *
 * `null` is "not included", which the page prints as «لا · No» rather than as
 * a zero: zero quick checks and no quick-check tool are different facts.
 */
const FREELANCER_LIMITS = {
  reruns: { free: null, solo: 5, pro: 15 },
  quickChecks: { free: 10, solo: 50, pro: 100 },
  writingTasks: { free: 5, solo: 20, pro: 50 },
  assistant: { free: null, solo: 15, pro: 40 },
  mockups: { free: 3, solo: 10, pro: 25 },
} as const;

const STUDIO_LIMITS = {
  reruns: { free: null, studio: 30, agency: 60 },
  quickChecks: { free: 10, studio: 300, agency: 800 },
  writingTasks: { free: 5, studio: 150, agency: 300 },
  assistant: { free: null, studio: 100, agency: 200 },
  mockups: { free: 3, studio: 60, agency: 120 },
} as const;

const COMPANY_LIMITS = {
  reports: { free: null, starter: 2, brand: 3, team: 10, business: 20 },
  quickChecks: { free: 25, starter: 300, brand: 1000, team: 2500, business: 5000 },
  askTheBrand: { free: 20, starter: 150, brand: 500, team: 1500, business: 3000 },
  writingTasks: { free: 5, starter: 25, brand: 60, team: 150, business: 300 },
  assistant: { free: null, starter: 10, brand: 30, team: 80, business: 150 },
  mockups: { free: 3, starter: 10, brand: 20, team: 45, business: 90 },
} as const;

/*
 * The limits, for the feature pages that quote them.
 *
 * /platform/tone-checker, the mockup page and the three audience pages each
 * state a monthly allowance, and until v4.2 each stated it in its own numbers.
 * They read this now, so there is one place to change.
 */
export const AI_LIMITS = {
  freelancers: FREELANCER_LIMITS,
  studios: STUDIO_LIMITS,
  companies: COMPANY_LIMITS,
} as const;

/*
 * `✓` and `∞`, and why they are not icons.
 *
 * §6 of the design system allows one icon system and this is not it -- these
 * are typographic marks inside a table cell, set in the page's own face, the
 * way `→` is allowed inside copy. Neither is emoji by default and neither
 * carries a variation selector, so `check:design`'s §11 rule reads them as the
 * punctuation they are. A tick in a comparison table is the one place a mark
 * beats a word: forty rows of «نعم» is forty rows a reader has to read.
 *
 * "Not included" is the word and not a dash, because v4.3 says so and because
 * an empty cell in a five-column table is ambiguous: the reader cannot tell
 * "no" from "we forgot".
 */
const YES = "✓";
const ANY = "∞";

const PLAN_NAMES = {
  en: {
    free: "Free",
    solo: "Solo",
    pro: "Pro",
    studio: "Studio",
    agency: "Agency",
    starter: "Starter",
    brand: "Brand",
    team: "Team",
    business: "Business",
    enterprise: "Enterprise",
  },
  ar: {
    free: "المجانية",
    solo: "الفردية",
    pro: "الاحترافية",
    studio: "الاستوديو",
    agency: "الوكالة",
    starter: "البداية",
    brand: "العلامة",
    team: "الفريق",
    business: "الأعمال",
    enterprise: "المؤسسات",
  },
} as const;

/** A bilingual pair, resolved once per page build. Arabic leads, as it does everywhere. */
function translator(locale: Locale) {
  return (arabic: string, english: string): string => (locale === "ar" ? arabic : english);
}

/*
 * The three audiences, and the one place their ids are written.
 *
 * Each is an option on the switch, a deep link (`/pricing#studios`), and the
 * prefix of every plan-card id inside its panel. The free plan appears in all
 * three panels and all three panels are in the HTML, so a card id has to carry
 * its audience or the document ships three elements called `plan-free` and the
 * chooser lights whichever one the browser found first.
 */
const AUDIENCES = ["freelancers", "studios", "companies"] as const;
type Audience = (typeof AUDIENCES)[number];

const planId = (audience: Audience, plan: string) => `plan-${audience}-${plan}`;

/** The switch's three labels, and the homepage teaser's. One place. */
function audienceLabel(locale: Locale, audience: Audience): string {
  const t = translator(locale);
  return {
    freelancers: t("المستقلون", "Freelancers"),
    studios: t("الاستوديوهات والوكالات", "Studios and agencies"),
    companies: t("الشركات", "Companies"),
  }[audience];
}

/*
 * A plan card.
 *
 * Every figure comes from PLAN_PRICES or the limit tables above. `pick` and
 * `moveUp` are v4.3's two deciding sentences; the labels over them belong to
 * the block, not to each of the eleven cards.
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
    href: string;
    cta: string;
  },
): PlanCard {
  const t = translator(locale);
  const price = PLAN_PRICES[plan];
  return {
    id: planId(options.audience, plan),
    name: PLAN_NAMES[locale][plan],
    price: money(price.monthly),
    period: t("شهرياً", "a month"),
    annual: {
      price: money(price.yearly),
      note: t("شهرياً، تُدفع سنوياً", "a month, paid yearly"),
    },
    who: options.who,
    pick: options.pick,
    moveUp: options.moveUp,
    rows: options.rows,
    recommended: options.recommended,
    cta: { label: options.cta, href: options.href },
  };
}

/* ── The free plan, which is the same plan on three tabs ───────────────────── */

/*
 * One plan, three cards.
 *
 * The deck notes it for the studios tab -- "the same Free plan as the
 * Freelancers tab, only the line changes" -- and it is true of the companies
 * tab too, up to the limits a company's free workspace gets. What differs is
 * who is reading: the line, the two deciding sentences, and which rows are
 * worth a column. So the shape is shared and the words are not.
 */
function freeCard(
  locale: Locale,
  options: {
    audience: Audience;
    who: string;
    pick: string;
    moveUp: string;
    rows: PlanCard["rows"];
    type: string;
  },
): PlanCard {
  const t = translator(locale);
  return {
    id: planId(options.audience, "free"),
    name: PLAN_NAMES[locale].free,
    price: t("مجاناً", "$0"),
    who: options.who,
    pick: options.pick,
    moveUp: options.moveUp,
    rows: options.rows,
    cta: { label: t("ابدأ مجاناً", "Start free"), href: `/start?type=${options.type}` },
  };
}

/* ── Tab 1 · Freelancers ───────────────────────────────────────────────────── */

function freelancerCards(locale: Locale): PlanCard[] {
  const t = translator(locale);
  const L = FREELANCER_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? no : value.toLocaleString("en-US"));
  const row = (label: string, value: string) => ({ label, value });

  /*
   * The same rows, in the same order, on all three cards -- which is the whole
   * point of v4.3's card: a reader runs one row across the tab and compares
   * three figures, without opening anything. The rows a card cannot hold in
   * one short value (partner links, who counts as a collaborator) are in the
   * comparison table below, which has a column for prose.
   */
  const rows = (plan: "free" | "solo" | "pro"): PlanCard["rows"] => {
    const projects = { free: "1", solo: "2", pro: "5" }[plan];
    const fresh = plan === "free" ? "3" : ANY;
    const storage = { free: "2 GB", solo: "20 GB", pro: "50 GB" }[plan];
    const looks = plan === "free" ? "2" : "8";
    const history = {
      free: t("7 أيام", "7 days"),
      solo: t("30 يوماً", "30 days"),
      pro: t("90 يوماً", "90 days"),
    }[plan];
    const support = {
      free: t("مركز المساعدة", "Help centre"),
      solo: t("البريد", "Email"),
      pro: t("البريد", "Email"),
    }[plan];

    return [
      row(t("المشاريع النشطة", "Active projects"), projects),
      row(t("مشاريع جديدة كل 30 يوماً", "New projects per 30 days"), fresh),
      row(t("التخزين", "Storage"), storage),
      row(t("تصاميم الدليل", "Guideline looks"), looks),
      row(t("شارة «صُنع باستخدام ماركيوس»", "“Made with Markyos” badge"), plan === "free" ? t("تظهر", "Shown") : no),
      row(t("كلمة مرور للمركز", "Hub password"), plan === "free" ? no : YES),
      row(t("إعادة التحليل شهرياً", "Analysis re-runs a month"), num(L.reruns[plan])),
      row(t("مراجعات نبرة سريعة شهرياً", "Quick tone checks a month"), num(L.quickChecks[plan])),
      row(t("مهام الكتابة شهرياً", "Writing tasks a month"), num(L.writingTasks[plan])),
      row(t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"), num(L.assistant[plan])),
      row(t("موك اب بالذكاء الاصطناعي شهرياً", "AI mockups a month"), num(L.mockups[plan])),
      row(t("موصّل الذكاء الاصطناعي", "AI Connector"), plan === "free" ? no : YES),
      row(t("سجل النسخ", "Version history"), history),
      row(t("الدعم", "Support"), support),
    ];
  };

  return [
    freeCard(locale, {
      audience: "freelancers",
      type: "freelancer",
      who: t("مشروعك الأول، كاملاً.", "Your first project, in full."),
      pick: t(
        "لديك عميل واحد الآن، أو تريد تجربة مشروع كامل.",
        "You have one client now, or want to try a full project.",
      ),
      moveUp: t(
        "يأتيك عميل ثانٍ في الوقت نفسه، أو تريد إخفاء الشارة.",
        "A second client comes in at the same time, or you want the badge gone.",
      ),
      rows: rows("free"),
    }),
    paidCard("solo", locale, {
      audience: "freelancers",
      who: t("عميلان في الوقت نفسه، دون شارة.", "Two clients at a time, no badge."),
      pick: t(
        "تعمل وحدك مع عميل أو عميلين في الوقت نفسه.",
        "You work alone, with one or two clients at a time.",
      ),
      moveUp: t(
        "يأتيك عميل ثالث في الوقت نفسه، أو تحتاج ذكاءً أكثر.",
        "A third client comes in at the same time, or you need more AI.",
      ),
      rows: rows("solo"),
      cta: t("اختر الفردية", "Choose Solo"),
      href: "/start?type=freelancer",
    }),
    paidCard("pro", locale, {
      audience: "freelancers",
      who: t("مستقل بعملاء كُثر.", "A freelancer with a full client list."),
      recommended: true,
      pick: t(
        "تعمل وحدك مع 3 إلى 5 عملاء في الوقت نفسه.",
        "You work alone, with three to five clients at a time.",
      ),
      moveUp: t(
        "ينضم إليك شخص آخر. انتقل إلى «الاستوديو».",
        "Someone joins you. Move to Studio.",
      ),
      rows: rows("pro"),
      cta: t("اختر الاحترافية", "Choose Pro"),
      href: "/start?type=freelancer",
    }),
  ];
}

function freelancerTable(locale: Locale): Cell[][] {
  const t = translator(locale);
  const L = FREELANCER_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? no : value.toLocaleString("en-US"));
  const all = (value: string): Cell[] => [value, value, value];

  return [
    group(t("العمل", "Work"), 3),
    [t("المشاريع النشطة", "Active projects"), "1", "2", "5"],
    [t("مشاريع جديدة كل 30 يوماً", "New projects per 30 days"), "3", ANY, ANY],
    [t("المقاعد", "Seats"), ...all("1")],
    [t("التخزين", "Storage"), "2 GB", "20 GB", "50 GB"],
    [t("استبيانات الاكتشاف والإجابات", "Discovery forms and answers"), ...all(ANY)],
    [t("ضيوف من العملاء", "Client guests"), ...all(ANY)],
    [t("التحليل الذكي الأول لكل مشروع", "First AI brief analysis per project"), ...all(YES)],

    group(t("النشر", "Publishing"), 3),
    [t("تصاميم الدليل", "Guideline looks"), "2", "8", "8"],
    [t("دليل واحد باللغتين", "One guide in both languages"), ...all(YES)],
    [t("شارة «صُنع باستخدام ماركيوس»", "“Made with Markyos” badge"), t("تظهر", "Shown"), no, no],
    [t("كلمة مرور للمركز", "Hub password"), no, YES, YES],

    group(t("عقل العلامة، شهرياً", "Brand Brain, a month"), 3),
    [t("إعادة التحليل", "Analysis re-runs"), num(L.reruns.free), num(L.reruns.solo), num(L.reruns.pro)],
    [
      t("مراجعات نبرة سريعة", "Quick tone checks"),
      num(L.quickChecks.free),
      num(L.quickChecks.solo),
      num(L.quickChecks.pro),
    ],
    [
      t("مهام الكتابة", "Writing tasks"),
      num(L.writingTasks.free),
      num(L.writingTasks.solo),
      num(L.writingTasks.pro),
    ],
    [
      t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"),
      num(L.assistant.free),
      num(L.assistant.solo),
      num(L.assistant.pro),
    ],
    [
      t("موك اب بالذكاء الاصطناعي", "AI mockups"),
      num(L.mockups.free),
      num(L.mockups.solo),
      num(L.mockups.pro),
    ],
    [t("موصّل الذكاء الاصطناعي", "AI Connector"), no, YES, YES],

    group(t("الحساب", "Account"), 3),
    [t("مكافأة الشريك", "Partner reward"), ...all(`${PARTNER_SHARE}%`)],
    [t("التسليم ونقل الملكية", "Handoff and ownership transfer"), ...all(YES)],
    [
      t("سجل النسخ", "Version history"),
      t("7 أيام", "7 days"),
      t("30 يوماً", "30 days"),
      t("90 يوماً", "90 days"),
    ],
    [t("الصلاحيات على الخادم", "Server-side permissions"), ...all(YES)],
    [
      t("الدعم", "Support"),
      t("مركز المساعدة", "Help centre"),
      t("البريد", "Email"),
      t("البريد", "Email"),
    ],
  ];
}

/* ── Tab 2 · Studios and agencies ──────────────────────────────────────────── */

function studioCards(locale: Locale): PlanCard[] {
  const t = translator(locale);
  const L = STUDIO_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? no : value.toLocaleString("en-US"));
  const row = (label: string, value: string) => ({ label, value });
  const perMonth = t(`${EXTRAS.seat} دولارات`, `${money(EXTRAS.seat)} a month`);

  const rows = (plan: "free" | "studio" | "agency"): PlanCard["rows"] => {
    const projects = { free: "1", studio: "10", agency: "25" }[plan];
    const seats = { free: "1", studio: "5", agency: "12" }[plan];
    const storage = { free: "2 GB", studio: "250 GB", agency: "500 GB" }[plan];
    const share = plan === "agency" ? AGENCY_PARTNER_SHARE : PARTNER_SHARE;
    const support = {
      free: t("مركز المساعدة", "Help centre"),
      studio: t("بأولوية", "Priority"),
      agency: t("بأولوية ومكالمة", "Priority, a call"),
    }[plan];

    return [
      row(t("المشاريع النشطة", "Active projects"), projects),
      row(t("مشاريع جديدة كل 30 يوماً", "New projects per 30 days"), plan === "free" ? "3" : ANY),
      row(t("المقاعد", "Seats"), seats),
      row(t("مقعد إضافي", "Extra seat"), plan === "free" ? no : perMonth),
      row(t("التخزين", "Storage"), storage),
      row(t("تصاميم الدليل", "Guideline looks"), plan === "free" ? "2" : "8"),
      row(t("شارة «صُنع باستخدام ماركيوس»", "“Made with Markyos” badge"), plan === "free" ? t("تظهر", "Shown") : no),
      row(t("نطاق خاص قبل التسليم", "Custom domain at handoff"), plan === "free" ? no : YES),
      row(t("إعادة التحليل شهرياً", "Analysis re-runs a month"), num(L.reruns[plan])),
      row(t("مراجعات نبرة سريعة شهرياً", "Quick tone checks a month"), num(L.quickChecks[plan])),
      row(t("مهام الكتابة شهرياً", "Writing tasks a month"), num(L.writingTasks[plan])),
      row(t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"), num(L.assistant[plan])),
      row(t("موك اب بالذكاء الاصطناعي شهرياً", "AI mockups a month"), num(L.mockups[plan])),
      row(t("موصّل الذكاء الاصطناعي", "AI Connector"), plan === "free" ? no : YES),
      row(t("مكافأة الشريك", "Partner reward"), `${share}%`),
      row(
        t("سجل النسخ", "Version history"),
        plan === "free" ? t("7 أيام", "7 days") : t("سنة", "1 year"),
      ),
      row(t("الدعم", "Support"), support),
    ];
  };

  return [
    freeCard(locale, {
      audience: "studios",
      type: "studio",
      who: t(
        "جرّب مشروعاً كاملاً قبل أن يدخل فريقك.",
        "Try a full project before your team joins.",
      ),
      pick: t(
        "تريد تجربة ماركيوس على مشروع حقيقي، وحدك أولاً.",
        "You want to try Markyos on a real project, on your own first.",
      ),
      moveUp: t("ينضم شخص ثانٍ من فريقك.", "A second person from your team joins."),
      rows: rows("free"),
    }),
    paidCard("studio", locale, {
      audience: "studios",
      who: t("استوديو بفريق صغير.", "A studio with a small team."),
      recommended: true,
      pick: t(
        "فريقك حتى 5 أشخاص، ومشاريعك النشطة حتى 10.",
        "Your team is up to five people, with up to ten live projects.",
      ),
      moveUp: t("يزيد فريقك على 5، أو مشاريعك على 10.", "Your team passes five, or your projects pass ten."),
      rows: rows("studio"),
      cta: t("اختر الاستوديو", "Choose Studio"),
      href: "/start?type=studio",
    }),
    paidCard("agency", locale, {
      audience: "studios",
      who: t("وكالة بمشاريع كثيرة، وفريق أكبر.", "An agency with many projects and a bigger team."),
      pick: t(
        "فريقك من 6 إلى 12 شخصاً، ومشاريعك النشطة حتى 25.",
        "Your team is six to twelve people, with up to 25 live projects.",
      ),
      moveUp: t(
        "تحتاج أكثر من 25 مشروعاً نشطاً. تواصل معنا.",
        "You need more than 25 live projects. Talk to us.",
      ),
      rows: rows("agency"),
      cta: t("اختر الوكالة", "Choose Agency"),
      href: "/start?type=studio",
    }),
  ];
}

function studioTable(locale: Locale): Cell[][] {
  const t = translator(locale);
  const L = STUDIO_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? no : value.toLocaleString("en-US"));
  const all = (value: string): Cell[] => [value, value, value];
  const perMonth = t(`${EXTRAS.seat} دولارات شهرياً`, `${money(EXTRAS.seat)} a month`);

  return [
    group(t("العمل", "Work"), 3),
    [t("المشاريع النشطة", "Active projects"), "1", "10", "25"],
    [t("مشاريع جديدة كل 30 يوماً", "New projects per 30 days"), "3", ANY, ANY],
    [t("المقاعد", "Seats"), "1", "5", "12"],
    [t("مقعد إضافي", "Extra seat"), no, perMonth, perMonth],
    [t("التخزين", "Storage"), "2 GB", "250 GB", "500 GB"],
    [t("استبيانات الاكتشاف والإجابات", "Discovery forms and answers"), ...all(ANY)],
    [t("ضيوف من العملاء", "Client guests"), ...all(ANY)],
    [t("أدوار الفريق وأختام الموافقة", "Team roles and client sign-off"), ...all(YES)],
    [t("لوحة الاستوديو ومسار المشروع", "Studio board and project path"), ...all(YES)],

    group(t("النشر", "Publishing"), 3),
    [t("تصاميم الدليل", "Guideline looks"), "2", "8", "8"],
    [t("دليل واحد باللغتين", "One guide in both languages"), ...all(YES)],
    [t("شارة «صُنع باستخدام ماركيوس»", "“Made with Markyos” badge"), t("تظهر", "Shown"), no, no],
    [t("كلمة مرور للمركز", "Hub password"), no, YES, YES],
    [t("نطاق خاص قبل التسليم", "Custom domain before handoff"), no, YES, YES],

    group(t("عقل العلامة، شهرياً", "Brand Brain, a month"), 3),
    [t("إعادة التحليل", "Analysis re-runs"), num(L.reruns.free), num(L.reruns.studio), num(L.reruns.agency)],
    [
      t("مراجعات نبرة سريعة", "Quick tone checks"),
      num(L.quickChecks.free),
      num(L.quickChecks.studio),
      num(L.quickChecks.agency),
    ],
    [
      t("مهام الكتابة", "Writing tasks"),
      num(L.writingTasks.free),
      num(L.writingTasks.studio),
      num(L.writingTasks.agency),
    ],
    [
      t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"),
      num(L.assistant.free),
      num(L.assistant.studio),
      num(L.assistant.agency),
    ],
    [
      t("موك اب بالذكاء الاصطناعي", "AI mockups"),
      num(L.mockups.free),
      num(L.mockups.studio),
      num(L.mockups.agency),
    ],
    [t("موصّل الذكاء الاصطناعي", "AI Connector"), no, YES, YES],

    group(t("الحساب", "Account"), 3),
    [
      t("مكافأة الشريك", "Partner reward"),
      `${PARTNER_SHARE}%`,
      `${PARTNER_SHARE}%`,
      { text: `${AGENCY_PARTNER_SHARE}%`, strong: true },
    ],
    [t("التسليم ونقل الملكية", "Handoff and ownership transfer"), ...all(YES)],
    [
      t("سجل النسخ", "Version history"),
      t("7 أيام", "7 days"),
      t("سنة", "1 year"),
      t("سنة", "1 year"),
    ],
    [t("الصلاحيات على الخادم", "Server-side permissions"), ...all(YES)],
    [
      t("الدعم", "Support"),
      t("مركز المساعدة", "Help centre"),
      t("بأولوية", "Priority"),
      t("بأولوية ومكالمة إعداد", "Priority and a setup call"),
    ],
  ];
}

/* ── Tab 3 · Companies ─────────────────────────────────────────────────────── */

type CompanyPlan = "free" | "starter" | "brand" | "team" | "business";

function companyCards(locale: Locale): PlanCard[] {
  const t = translator(locale);
  const L = COMPANY_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? no : value.toLocaleString("en-US"));
  const row = (label: string, value: string) => ({ label, value });

  /*
   * Five cards in an 1100px container leave about 145px of content each, so a
   * company card's values are figures and marks only -- `shrink-0` on the
   * value means a long one leaves the card rather than wrapping. The rows that
   * need a phrase (support, partner links, who counts as a collaborator) are
   * in the comparison table directly below, which has the width for them.
   * `check:pricing` holds the cap at the measured width.
   */
  const rows = (plan: CompanyPlan): PlanCard["rows"] => {
    const brands = { free: "1", starter: "1", brand: "1", team: "3", business: "5" }[plan];
    const editors = { free: "2", starter: "3", brand: "5", team: "15", business: "30" }[plan];
    const extra = plan === "team" || plan === "business" ? money(EXTRAS.seat) : no;
    const viewers = { free: "25", starter: "100", brand: ANY, team: ANY, business: ANY }[plan];
    const storage = {
      free: "2 GB",
      starter: "10 GB",
      brand: "25 GB",
      team: "100 GB",
      business: "250 GB",
    }[plan];
    const domains = { free: no, starter: no, brand: "1", team: "3", business: "5" }[plan];
    const history = {
      free: t("7 أيام", "7 days"),
      starter: t("30 يوماً", "30 days"),
      brand: t("90 يوماً", "90 days"),
      team: t("سنة", "1 year"),
      business: t("سنة", "1 year"),
    }[plan];

    return [
      row(t("العلامات", "Brands"), brands),
      row(t("المحرّرون", "Editors"), editors),
      row(t("محرّر إضافي", "Extra editor"), extra),
      row(t("المشاهدون", "Viewers"), viewers),
      row(t("التخزين", "Storage"), storage),
      row(t("تصاميم الدليل", "Guideline looks"), plan === "free" ? "2" : "8"),
      row(t("النطاقات الخاصة", "Custom domains"), domains),
      row(t("إعادة تقرير التوافق", "Alignment re-runs"), num(L.reports[plan])),
      row(t("مراجعات نبرة سريعة", "Quick tone checks"), num(L.quickChecks[plan])),
      row(t("«اسأل علامتك»", "Ask the Brand"), num(L.askTheBrand[plan])),
      row(t("مهام الكتابة", "Writing tasks"), num(L.writingTasks[plan])),
      row(t("رسائل المساعد", "Assistant messages"), num(L.assistant[plan])),
      row(t("موك اب بالذكاء الاصطناعي", "AI mockups"), num(L.mockups[plan])),
      row(t("صوت لكل قناة", "Voice per channel"), plan === "team" || plan === "business" ? YES : no),
      row(t("موصّل الذكاء الاصطناعي", "AI Connector"), plan === "free" ? no : YES),
      row(t("سجل النسخ", "Version history"), history),
    ];
  };

  return [
    freeCard(locale, {
      audience: "companies",
      type: "company",
      who: t("ابنِ مركزك وجرّب.", "Build your hub and try it."),
      pick: t(
        "تجرّب ماركيوس بشخصين، قبل أن تُدخل أحداً.",
        "You're trying Markyos with two people, before bringing anyone in.",
      ),
      moveUp: t(
        "تحتاج محرّراً ثالثاً، أو يزيد المستخدمون على 25.",
        "You need a third editor, or more than 25 people use it.",
      ),
      rows: rows("free"),
    }),
    paidCard("starter", locale, {
      audience: "companies",
      who: t("علامة مرتّبة، لفريق صغير.", "A tidy brand for a small team."),
      pick: t(
        "علامة واحدة، وحتى 3 يعدّلونها، وحتى 100 يستخدمونها.",
        "One brand, up to three people who edit it, up to 100 who use it.",
      ),
      moveUp: t(
        "تريد نطاقك الخاص، أو تُدخل الشركة كلها.",
        "You want your own domain, or want the whole company in.",
      ),
      rows: rows("starter"),
      cta: t("اختر البداية", "Choose Starter"),
      href: "/start?type=company",
    }),
    paidCard("brand", locale, {
      audience: "companies",
      who: t("شركتك كلها على هوية واحدة.", "Your whole company on brand."),
      recommended: true,
      pick: t(
        "علامة واحدة، وحتى 5 يعدّلونها، والشركة كلها تستخدمها.",
        "One brand, up to five people who edit it, and the whole company uses it.",
      ),
      moveUp: t(
        "تأتي علامة ثانية، أو تحتاج أكثر من 5 محرّرين.",
        "A second brand arrives, or you need more than five editors.",
      ),
      rows: rows("brand"),
      cta: t("اختر العلامة", "Choose Brand"),
      href: "/start?type=company",
    }),
    paidCard("team", locale, {
      audience: "companies",
      who: t("عدة علامات، وفرق أكبر.", "Several brands, bigger teams."),
      pick: t(
        "حتى 3 علامات، وحتى 15 محرّراً، وأصوات مختلفة لكل قناة.",
        "Up to three brands, up to fifteen editors, and a different voice for each channel.",
      ),
      moveUp: t("تزيد علاماتك على 3، أو محرّروك على 15.", "You pass three brands, or fifteen editors."),
      rows: rows("team"),
      cta: t("اختر الفريق", "Choose Team"),
      href: "/start?type=company",
    }),
    paidCard("business", locale, {
      audience: "companies",
      who: t("مجموعة علامات، وقسم تسويق كامل.", "A group of brands, and a full marketing team."),
      pick: t("حتى 5 علامات، وحتى 30 محرّراً.", "Up to five brands, and up to thirty editors."),
      moveUp: t(
        "تزيد علاماتك على 5. سجّل اهتمامك بخطة المؤسسات.",
        "You pass five brands. Register your interest in Enterprise.",
      ),
      rows: rows("business"),
      cta: t("اختر الأعمال", "Choose Business"),
      href: "/start?type=company",
    }),
  ];
}

function companyTable(locale: Locale): Cell[][] {
  const t = translator(locale);
  const L = COMPANY_LIMITS;
  const no = t("لا", "No");
  const num = (value: number | null) => (value === null ? no : value.toLocaleString("en-US"));
  const all = (value: string): Cell[] => [value, value, value, value, value];
  const extra = money(EXTRAS.seat);
  const gated = t("بموعد وكلمة مرور", "Expiry and password");

  return [
    group(t("العمل", "Work"), 5),
    [t("العلامات", "Brands"), "1", "1", "1", "3", "5"],
    [t("المحرّرون", "Editors"), "2", "3", "5", "15", "30"],
    [t("محرّر إضافي", "Extra editor"), no, no, no, extra, extra],
    [t("المشاهدون", "Viewers"), "25", "100", ANY, ANY, ANY],
    [t("استوديوهات متعاونة لكل علامة", "Studio collaborators per brand"), "1", "1", "1", "3", "5"],
    [t("التخزين", "Storage"), "2 GB", "10 GB", "25 GB", "100 GB", "250 GB"],
    [t("استبيان القيادة", "Leadership questionnaire"), ...all(YES)],
    [t("تقرير التوافق الأول لكل علامة", "First alignment report per brand"), ...all(YES)],
    [
      t("صفحات الأقسام واستيراد Word وPDF", "Department pages, Word and PDF import"),
      ...all(YES),
    ],
    [
      t("دعوة الاستوديو دون احتسابه محرّراً", "Invite a studio, not counted as an editor"),
      ...all(YES),
    ],

    group(t("النشر", "Publishing"), 5),
    [t("تصاميم الدليل", "Guideline looks"), "2", "8", "8", "8", "8"],
    [t("دليل واحد باللغتين", "One guide in both languages"), ...all(YES)],
    [
      t("شارة «صُنع باستخدام ماركيوس»", "“Made with Markyos” badge"),
      t("تظهر", "Shown"),
      no,
      no,
      no,
      no,
    ],
    [t("كلمة مرور للمركز", "Hub password"), no, YES, YES, YES, YES],
    [t("النطاقات الخاصة", "Custom domains"), no, no, "1", "3", "5"],
    [t("روابط الشركاء", "Partner links"), t("للعرض", "View only"), gated, gated, gated, gated],

    group(t("عقل العلامة، شهرياً", "Brand Brain, a month"), 5),
    [
      t("إعادة تقرير التوافق", "Alignment report re-runs"),
      num(L.reports.free),
      num(L.reports.starter),
      num(L.reports.brand),
      num(L.reports.team),
      num(L.reports.business),
    ],
    [
      t("مراجعات نبرة سريعة", "Quick tone checks"),
      num(L.quickChecks.free),
      num(L.quickChecks.starter),
      num(L.quickChecks.brand),
      num(L.quickChecks.team),
      num(L.quickChecks.business),
    ],
    [
      t("«اسأل علامتك»", "Ask the Brand"),
      num(L.askTheBrand.free),
      num(L.askTheBrand.starter),
      num(L.askTheBrand.brand),
      num(L.askTheBrand.team),
      num(L.askTheBrand.business),
    ],
    [
      t("مهام الكتابة", "Writing tasks"),
      num(L.writingTasks.free),
      num(L.writingTasks.starter),
      num(L.writingTasks.brand),
      num(L.writingTasks.team),
      num(L.writingTasks.business),
    ],
    [
      t("رسائل المساعد الاستراتيجي", "Strategy assistant messages"),
      num(L.assistant.free),
      num(L.assistant.starter),
      num(L.assistant.brand),
      num(L.assistant.team),
      num(L.assistant.business),
    ],
    [
      t("موك اب بالذكاء الاصطناعي", "AI mockups"),
      num(L.mockups.free),
      num(L.mockups.starter),
      num(L.mockups.brand),
      num(L.mockups.team),
      num(L.mockups.business),
    ],
    [
      t("المشاهدون يراجعون كتاباتهم", "Viewers check their own writing"),
      no,
      YES,
      YES,
      YES,
      YES,
    ],
    [t("صوت لكل قناة", "Voice per channel"), no, no, no, YES, YES],
    [t("موصّل الذكاء الاصطناعي", "AI Connector"), no, YES, YES, YES, YES],

    group(t("الحساب", "Account"), 5),
    [t("صوت العلامة وقاموس المصطلحات", "Brand voice and term base"), ...all(YES)],
    [t("الصلاحيات على الخادم", "Server-side permissions"), ...all(YES)],
    [
      t("سجل النسخ", "Version history"),
      t("7 أيام", "7 days"),
      t("30 يوماً", "30 days"),
      t("90 يوماً", "90 days"),
      t("سنة", "1 year"),
      t("سنة", "1 year"),
    ],
    [
      t("الدعم", "Support"),
      t("مركز المساعدة", "Help centre"),
      t("البريد", "Email"),
      t("البريد", "Email"),
      t("بأولوية", "Priority"),
      t("بأولوية ومكالمة إعداد", "Priority and a setup call"),
    ],
  ];
}

/** A full-width heading inside the table body, the way the deck groups its rows. */
function group(label: string, columns: number): Cell[] {
  return [{ text: label, strong: true }, ...Array.from({ length: columns }, () => "")];
}

/* ── The three panels ──────────────────────────────────────────────────────── */

/*
 * What every plan includes, above the cards.
 *
 * v4.3 adds this strip so the cards can stop repeating themselves: six
 * sentences that are true of the free plan and of every plan above it, said
 * once per tab instead of eleven times. Terms with no body, which is what this
 * block renders as a plain list.
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
          t(
            "مركز الاستراتيجية، وصفحات الأقسام، واستيراد Word وPDF",
            "Strategy hub, department pages, Word and PDF import",
          ),
          t("مركز الأصول، ودليل واحد باللغتين", "Asset library, and one guide in both languages"),
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
 * The handoff section, on two tabs of three.
 *
 * A company reading "the studio builds, the client owns" is being told about
 * somebody else's business model. v4.3 puts it on the freelancers and the
 * studios tabs only, which is also why the figure differs between them: the
 * agency share is 25%.
 */
function handoffBlock(locale: Locale, audience: Audience): PageBlock {
  const t = translator(locale);
  const names = PLAN_NAMES[locale];
  const agency =
    audience === "studios"
      ? t(
          `، و${AGENCY_PARTNER_SHARE}% في خطة «${names.agency}»`,
          `, or ${AGENCY_PARTNER_SHARE}% on ${names.agency}`,
        )
      : "";

  return {
    kind: "prose",
    title: t(
      "الاستوديو يبني. العميل يملك. والعائد مستمر.",
      "The studio builds. The client owns. The return keeps coming.",
    ),
    body: [
      t(
        `التسليم مجاني، والمركز يبقى حيّاً على الخطة المجانية للعميل. وحين يرقّي خطته، تحصل على ${PARTNER_SHARE}% مما يدفعه في سنته الأولى${agency}، خصماً من فاتورتك: خمسة عملاء على خطة «${names.brand}» يعني ${partnerCredit(5)} شهرياً، واثنا عشر يعني ${partnerCredit(12)}.`,
        `Handoff is free, and the hub stays live on the client's free plan. When the client upgrades, you get ${PARTNER_SHARE}% of their first year${agency} as billing credit: five clients on ${names.brand} is ${partnerCredit(5)} a month, and twelve is ${partnerCredit(12)}.`,
      ),
    ],
    links: [{ label: t("التسليم ومكافأة الشريك", "How handoff works"), href: "/platform/handoff" }],
  };
}

/*
 * One tab.
 *
 * The chooser, the strip, the cards and the comparison, in that order, with no
 * `id` on any of them: every panel is in the HTML and all but one is hidden,
 * so an id inside one would either be a duplicate of its opposite number or an
 * anchor that scrolls to nothing. The audience's own id is the deep link.
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
      annual: t("سنوياً (وفّر نحو 20%)", "Yearly (save about 20%)"),
    },
  };

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
          {
            label: t("واحد", "One"),
            target: planId("freelancers", "free"),
            note: t(
              `والمجانية تكفيه. وحين يأتي الثاني، أضفه بتصريح مشروع بـ ${EXTRAS.projectPass} دولاراً.`,
              `Free covers it. When the second one comes, add it with a ${money(EXTRAS.projectPass)} Project Pass.`,
            ),
          },
          { label: t("اثنان", "Two"), target: planId("freelancers", "solo") },
          { label: t("من 3 إلى 5", "Three to five"), target: planId("freelancers", "pro") },
          {
            label: t("يعمل معي آخرون", "Others work with me"),
            target: "tab:studios",
            note: t(
              "خطط الفريق في تبويب «الاستوديوهات والوكالات».",
              "Team plans are on the studios and agencies tab.",
            ),
          },
        ],
      },
      includesEveryPlan(locale, audience),
      {
        kind: "plans",
        ...common,
        plans: freelancerCards(locale),
        note: t(
          `مشروع إضافي لمرة واحدة؟ تصريح المشروع بـ ${EXTRAS.projectPass} دولاراً، بمزايا الاحترافية حتى تسلّمه.`,
          `One extra project, just this once? A Project Pass is ${money(EXTRAS.projectPass)}, with Pro features until you hand it off.`,
        ),
      },
      {
        kind: "table",
        title: t("قارن كل الخطط، في جدول واحد.", "Every plan, in one table."),
        numeric: true,
        head: [t("الحد", "Limit"), names.free, names.solo, names.pro],
        rows: freelancerTable(locale),
      },
      handoffBlock(locale, audience),
    ];
  }

  if (audience === "studios") {
    return [
      {
        kind: "chooser",
        title: t("كم شخصاً في فريقك؟", "How many people are on your team?"),
        label: t("حجم فريقك", "How big your team is"),
        options: [
          { label: t("نجرّب أولاً", "We want to try first"), target: planId("studios", "free") },
          { label: t("حتى 5", "Up to 5"), target: planId("studios", "studio") },
          { label: t("من 6 إلى 12", "6 to 12"), target: planId("studios", "agency") },
          {
            label: t("أكثر من 12", "More than 12"),
            target: planId("studios", "agency"),
            note: t(
              `أضف مقاعد بـ ${EXTRAS.seat} دولارات للمقعد، أو تواصل معنا.`,
              `Add seats at ${money(EXTRAS.seat)} each, or talk to us.`,
            ),
          },
        ],
      },
      includesEveryPlan(locale, audience),
      {
        kind: "plans",
        ...common,
        plans: studioCards(locale),
        note: t(
          "المشاريع المسلّمة لا تُحتسب. تتحرر حصتها لحظة يتسلّم العميل مركزه، والحدود الشهرية مشتركة بين فريقك كله.",
          "Handed-off projects don't count. The slot frees up the moment your client takes the hub, and the monthly limits are shared by your whole team.",
        ),
      },
      {
        kind: "table",
        title: t("قارن كل الخطط، في جدول واحد.", "Every plan, in one table."),
        numeric: true,
        head: [t("الحد", "Limit"), names.free, names.studio, names.agency],
        rows: studioTable(locale),
      },
      handoffBlock(locale, audience),
    ];
  }

  return [
    {
      kind: "chooser",
      title: t(
        "كم شخصاً يعدّل علامتكم، وكم علامة لديكم؟",
        "How many people edit your brand, and how many brands do you have?",
      ),
      label: t("علاماتكم ومحرّروها", "Your brands and editors"),
      options: [
        { label: t("نجرّب، بشخصين", "Trying it, with two people"), target: planId("companies", "free") },
        {
          label: t("علامة واحدة، وحتى 3 محرّرين", "One brand, up to 3 editors"),
          target: planId("companies", "starter"),
        },
        {
          label: t("علامة واحدة، والشركة كلها تستخدمها", "One brand, the whole company uses it"),
          target: planId("companies", "brand"),
        },
        {
          label: t("حتى 3 علامات، أو 15 محرّراً", "Up to 3 brands, or 15 editors"),
          target: planId("companies", "team"),
        },
        {
          label: t("حتى 5 علامات، أو 30 محرّراً", "Up to 5 brands, or 30 editors"),
          target: planId("companies", "business"),
          note: t(
            "أكثر من ذلك؟ خطة المؤسسات قادمة، أسفل الخطط.",
            "More than that? The Enterprise plan is coming, just below the plans.",
          ),
        },
      ],
    },
    includesEveryPlan(locale, audience),
    {
      kind: "plans",
      ...common,
      plans: companyCards(locale),
      note: t(
        "المشاهدون مجانيون في كل الخطط المدفوعة. تدفع لمن يعدّل العلامة، لا لمن يستخدمها.",
        "Viewers are free on every paid plan. You pay for who edits the brand, not who uses it.",
      ),
    },
    {
      kind: "callout",
      title: t("أكثر من 5 علامات، وفرق في عدة دول؟", "More than five brands, teams in several countries?"),
      body: [
        t(
          `خطة المؤسسات قادمة، من ${EXTRAS.enterpriseFrom} دولاراً شهرياً بعقد سنوي: علامات ومحرّرون بلا حدود، وحدود ذكاء حسب الاتفاق، وتسجيل دخول موحّد، وسجلات تدقيق، واتفاقية خدمة. سجّل اهتمامك، ونتواصل معك أولاً.`,
          `The Enterprise plan is coming, from ${money(EXTRAS.enterpriseFrom)} a month on an annual contract: unlimited brands and editors, AI limits set in your contract, SSO, audit logs and an SLA. Register your interest and we'll reach you first.`,
        ),
      ],
      feature: "sso",
      cta: { label: t("سجّل اهتمامك", "Register your interest"), href: "/contact?topic=sales" },
    },
    {
      kind: "table",
      title: t("قارن كل الخطط، في جدول واحد.", "Every plan, in one table."),
      numeric: true,
      head: [t("الحد", "Limit"), names.free, names.starter, names.brand, names.team, names.business],
      rows: companyTable(locale),
    },
  ];
}

/* ── The page ──────────────────────────────────────────────────────────────── */

export function currentPricingPage(locale: Locale): PageDoc {
  const t = translator(locale);
  const names = PLAN_NAMES[locale];
  const offerPlans = LAUNCH_OFFER.plans.map((plan) => PLAN_NAMES[locale][plan]);
  const listed =
    locale === "ar"
      ? offerPlans.map((name) => `«${name}»`).join("، ")
      : `${offerPlans.slice(0, -1).join(", ")} and ${offerPlans.at(-1)}`;

  return {
    path: "/pricing",
    shortTitle: t("الأسعار", "Pricing"),
    title: t("الأسعار والخطط · ماركيوس", "Pricing and Plans · Markyos"),
    description: t(
      `خطط للمستقلين، وللاستوديوهات والوكالات، وللشركات. ابدأ مجاناً، والخطط المدفوعة من ${LOWEST_PAID_MONTHLY} دولاراً، وحدود كل خطة واضحة.`,
      `Plans for freelancers, for studios and agencies, and for companies. Start free, paid plans from ${money(LOWEST_PAID_MONTHLY)}, and every limit in plain sight.`,
    ),
    breadcrumbs: [{ label: t("الرئيسية", "Home"), href: "/" }],
    priority: 0.9,
    blocks: [
      {
        kind: "hero",
        title: t("لكل طريقةِ عمل، خطتُها.", "Every way of working has its plan."),
        lead: t(
          "اختر من أنت، فترى الخطط التي صُمّمت لك، وحدود كل خطة بالأرقام.",
          "Choose who you are, and see the plans made for you, with every limit in numbers.",
        ),
      },

      /*
       * The offer, above the prices it changes.
       *
       * v4.3 keeps it second in the page order, and that is right for a reason
       * the deck does not state: a visitor who reads a column of cards and
       * then finds out the figures on them were not the figures they would pay
       * has been made to do the arithmetic twice. The cards carry the list
       * price, which is the price from the fourth month on; the discount lives
       * in one block that knows its own end date and takes itself down.
       */
      {
        kind: "offer",
        id: "launch-offer",
        eyebrow: t("عرض الإطلاق", "Launch offer"),
        title: t(
          `نصف السعر، لأول ${LAUNCH_OFFER.months} أشهر.`,
          `Half price, for your first ${LAUNCH_OFFER.months} months.`,
        ),
        lead: t(
          `خصم ${LAUNCH_OFFER.percent}% على أول ثلاثة أشهر من خطط ${listed}. يُطبَّق تلقائياً عند الاشتراك الشهري قبل انتهاء العرض، ثم تعود الخطة إلى سعرها العادي، ويمكنك الإلغاء قبل ذلك.`,
          `${LAUNCH_OFFER.percent}% off your first three months on ${listed}. It applies automatically when you subscribe monthly before the offer ends. After three months the plan returns to its usual price, and you can cancel before then.`,
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
          was: money(PLAN_PRICES[plan].monthly),
          now: launchPrice(plan),
        })),
        terms: [
          t(
            "العرض للاشتراك الشهري وحده، ولا يجتمع مع الاشتراك السنوي.",
            "The offer is for monthly billing only, and does not combine with yearly billing.",
          ),
          t(
            `خطتا «${names.solo}» و«${names.starter}» خارج العرض: سعرهما ثابت عند ${LOWEST_PAID_MONTHLY} دولاراً شهرياً.`,
            `${names.solo} and ${names.starter} are not in the offer. Their price stays at ${money(LOWEST_PAID_MONTHLY)} a month.`,
          ),
          t(
            "لا يشمل العرض تصريح المشروع ولا الحزم ولا المقاعد الإضافية، ويُستخدم مرة واحدة لكل مساحة عمل.",
            "It does not cover the Project Pass, the packs or extra seats, and it is one use per workspace.",
          ),
        ],
        cta: { label: t("أنشئ حسابك", "Create your account"), href: "/start" },
      },

      /*
       * Three tabs, and the whole page under them.
       *
       * v4.2 stacked two plan grids and two comparison tables, so a freelancer
       * read a studio's seat prices and a company's editor counts on the way
       * to the FAQ. v4.3 asks for three audiences, which makes stacking worse
       * by half again -- eleven cards and three comparisons in one column.
       *
       * The switch was built for exactly this: every panel is in the HTML, so
       * all eleven plans are indexed and findable, and only one is shown.
       */
      {
        kind: "audience",
        id: "choose",
        label: t("من أنت", "Who you are"),
        /* `/pricing?for=studios`, which is the link the deck hands out and
           the one the three audience pages point at. */
        param: "for",
        lead: t(
          "تعمل وحدك؟ اختر «المستقلون». معك فريق؟ «الاستوديوهات والوكالات». العلامة لشركتك؟ «الشركات».",
          "Work alone? Pick Freelancers. Have a team? Studios and agencies. Is it your own company's brand? Companies.",
        ),
        options: AUDIENCES.map((audience) => ({
          id: audience,
          label: audienceLabel(locale, audience),
          blocks: audiencePanel(locale, audience),
        })),
      },

      {
        kind: "terms",
        title: t("قريباً، على خطط تُعلن لاحقاً.", "Coming soon, on plans to be announced."),
        cols: 2,
        items: [
          { term: t("لوحات الإلهام", "Moodboards"), feature: "moodboard" },
          { term: t("التوجيه الفني من عقل العلامة", "Art direction from Brand Brain"), feature: "art-direction" },
          { term: t("أدلّة الأقسام", "Department playbooks"), feature: "department-playbooks" },
          { term: t("إضافة Chrome", "A Chrome extension"), feature: "chrome-extension" },
          { term: t("تحويل دليل PDF قديم إلى مركز", "Turning an old PDF guide into a hub"), feature: "pdf-import" },
          { term: t("صحة العلامة، والمراجعات والموافقات", "Brand health, reviews and approvals"), feature: "brand-health" },
        ],
      },

      {
        kind: "prose",
        id: "limits",
        title: t("لكل أداةٍ حدّها، ولا مفاجأة في فاتورتها.", "Every tool has its limit. Your bill has no surprises."),
        body: [
          t(
            "كل أداة ذكية لها عدد شهري واضح في خطتك. وإن نفد، تتوقف تلك الأداة وحدها، وتبقى البقية تعمل.",
            "Every AI tool has a clear monthly number on your plan. If one runs out, only that tool pauses. The rest keep working.",
          ),
        ],
      },
      {
        kind: "terms",
        title: t("ما الذي يُحتسب.", "What counts as what."),
        cols: 2,
        items: [
          {
            term: t("مهمة كتابة", "Writing task"),
            body: t(
              "مراجعة معمّقة، أو إعادة صياغة بصوتك، أو ترجمة بصوتك، أو نص قسم في الدليل.",
              "A deep check, a rewrite in your voice, a translation in your voice, or a guideline section's copy.",
            ),
          },
          {
            term: t("مراجعة سريعة", "Quick check"),
            body: t("درجة النص وملاحظاته، خلال ثوانٍ.", "A score and notes on a text, in seconds."),
          },
          {
            term: t("«اسأل علامتك»", "Ask the Brand"),
            body: t("سؤال واحد من موظف، وجوابه من مركزك.", "One question from your team, answered from your hub."),
          },
          {
            term: t("رسالة للمساعد", "Assistant message"),
            body: t("رسالة واحدة في المحادثة.", "One message in the conversation."),
          },
          {
            term: t("موك اب", "AI mockup"),
            body: t(
              "مشهد واحد يصنعه الذكاء الاصطناعي، وعليه هويتك الحقيقية.",
              "One scene made by AI, with your real identity on it.",
            ),
          },
          {
            term: t("إعادة تحليل", "Re-run"),
            body: t(
              "تحليل جديد بعد إجابات أو ملاحظات جديدة.",
              "A fresh analysis after new answers or notes.",
            ),
          },
        ],
      },
      {
        kind: "terms",
        title: t("ولا يُحتسب أبداً.", "Never counted."),
        cols: 3,
        items: [
          {
            term: t("التحليل الأول، وتقرير التوافق الأول", "The first analysis, and the first alignment report"),
            body: t("لكل مشروع، ولكل علامة.", "Per project, and per brand."),
          },
          {
            term: t("الاستبيانات والإجابات", "Forms and answers"),
            body: t("بلا حدود.", "Unlimited."),
          },
          {
            term: t("القراءة من أداة ذكاء متصلة", "Reading from a connected AI tool"),
            body: t("لا تمسّ حدودك.", "Doesn't touch your limits."),
          },
        ],
      },
      {
        kind: "terms",
        title: t("القواعد.", "The rules."),
        cols: 2,
        items: [
          {
            term: t("ما تبقّى", "What's left"),
            body: t("ترى ما تبقّى داخل كل أداة.", "You see what's left inside each tool."),
          },
          {
            term: t("التجديد", "Renewal"),
            body: t(
              "الحدود الشهرية تتجدد مع كل دورة فوترة، ولا تُرحَّل.",
              "Monthly limits renew each billing period and don't roll over.",
            ),
          },
          {
            term: t("المشاركة", "Sharing"),
            body: t(
              "الحدود مشتركة بين كل من في المساحة، ولكل مشاهد حدّ يومي صغير حتى لا يستهلكها شخص واحد.",
              "Limits are shared by everyone in the workspace, with a small daily cap per viewer so no one person uses them all.",
            ),
          },
          {
            term: t("حين ينفد حدّ", "When a limit runs out"),
            body: t(
              "تعرض عليك الأداة حزمة أو ترقية. لا شيء يُخصم دون علمك.",
              "The tool offers a pack or an upgrade. Nothing is charged without you knowing.",
            ),
          },
        ],
        note: t(
          "الحدود مبدئية حتى تنتهي تجربة التكلفة بالعربية والإنجليزية في فبراير 2027.",
          "The limits are provisional until the Arabic and English cost test closes in February 2027.",
        ),
      },

      {
        kind: "table",
        id: "one-time",
        title: t("حين تحتاج أكثر.", "When you need more."),
        head: [t("المنتج", "What you buy"), t("السعر", "Price"), t("ما تحصل عليه", "What you get")],
        rows: [
          [
            t("تصريح مشروع", "Project Pass"),
            { text: money(EXTRAS.projectPass), strong: true },
            t(
              `مشروع نشط إضافي بمزايا «${names.pro}»، ومعه 15 مهمة كتابة، و10 موك اب، و3 إعادات تحليل، حتى تسلّمه أو ستة أشهر. للمستقلين والاستوديوهات، ولا يشمل موصّل الذكاء الاصطناعي.`,
              `One extra active project with ${names.pro} features, plus 15 writing tasks, 10 AI mockups and 3 re-runs, until handoff or six months. For freelancers and studios, and it doesn't include the AI Connector.`,
            ),
          ],
          [
            t("حزمة عقل العلامة", "Brand Brain pack"),
            { text: money(EXTRAS.brainPack), strong: true },
            t(
              "100 مهمة كتابة، و30 رسالة للمساعد، صالحة 12 شهراً. لكل خطة مدفوعة.",
              "100 writing tasks and 30 assistant messages, valid for 12 months. On every paid plan.",
            ),
          ],
          [
            t("حزمة الموك اب", "Mockup pack"),
            { text: money(EXTRAS.mockupPack), strong: true },
            t(
              "50 موك اب بالذكاء الاصطناعي، صالحة 12 شهراً. لكل خطة مدفوعة.",
              "50 AI mockups, valid for 12 months. On every paid plan.",
            ),
          ],
          [
            t("مقعد أو محرّر إضافي", "Extra seat or editor"),
            { text: t(`${money(EXTRAS.seat)} شهرياً`, `${money(EXTRAS.seat)} a month`), strong: true },
            t(
              `مقعد إضافي لفريقك، أو محرّر إضافي لشركتك. في خطط «${names.studio}» و«${names.agency}» و«${names.team}» و«${names.business}».`,
              `One more seat for your team, or one more editor for your company. On ${names.studio}, ${names.agency}, ${names.team} and ${names.business}.`,
            ),
          ],
        ],
        note: t(
          "الحزم للخطط المدفوعة. والخطة المجانية ترقّي بدلاً منها.",
          "Packs are for paid plans. On the free plan you upgrade instead.",
        ),
      },

      {
        kind: "prose",
        id: "badge",
        title: t("مجاني، وبتوقيعنا الصغير.", "Free, with our small signature."),
        body: [
          t(
            "كل ما تنشره من الخطة المجانية، من الاستبيانات والموك اب إلى الدليل والمركز، يحمل شارة صغيرة «صُنع باستخدام ماركيوس». من يضغطها يصل إلى صفحة «ابدأ علامتك». وتختفي الشارة في كل الخطط المدفوعة.",
            "Everything you publish on the free plan, from forms and mockups to the guide and the hub, carries a small “Made with Markyos” badge. Anyone who clicks it lands on “Start your own”. The badge disappears on every paid plan.",
          ),
        ],
      },

      /*
       * Billing, with the lines that are answerable today.
       *
       * v4.3's block has eight. Refunds is a [PLACEHOLDER] in the deck itself,
       * and the tax and VAT clause on the receipts line is a [CONFIRM], so the
       * receipts line ships without it and refunds do not ship at all. A page
       * that answers "what about refunds?" with a blank is worse than a page
       * that has not raised the question.
       */
      {
        kind: "terms",
        id: "billing",
        title: t("دفعٌ واضح، وإلغاءٌ أوضح.", "Clear billing. Clearer cancelling."),
        cols: 2,
        items: [
          { term: t("العملة", "Currency"), body: t("الدولار الأمريكي.", "US dollars.") },
          { term: t("الدفع", "Payment"), body: t("عبر PayPal.", "Through PayPal.") },
          {
            term: t("السنوي", "Yearly"),
            body: t("تدفع السنة مقدّماً، وتوفّر نحو 20%.", "Pay for the year up front and save about 20%."),
          },
          {
            term: t("الإيصالات", "Receipts"),
            body: t("تصلك بالبريد مع كل دفعة.", "By email with every payment."),
          },
          {
            term: t("الترقية", "Upgrades"),
            body: t(
              "تُفتح حدود خطتك الجديدة فوراً، ويبدأ سعرها من تاريخ فوترتك التالي.",
              "Your new plan's limits open right away. Its price starts on your next billing date.",
            ),
          },
          {
            term: t("التخفيض والإلغاء", "Downgrades and cancelling"),
            body: t(
              "متى شئت، ويسري في نهاية الفترة. لا يُحذف شيء، ويصبح الزائد للقراءة فقط.",
              "Any time, from the end of the period. Nothing is deleted; anything over the limit becomes read-only.",
            ),
          },
          {
            term: t("سعر البرنامج التجريبي", "Beta pricing"),
            body: t("ثابت 12 شهراً بعد الإطلاق.", "Locked for 12 months after launch."),
          },
        ],
      },

      {
        kind: "faq",
        id: "faq",
        title: t("أسئلة عن اختيار الخطة.", "Questions about choosing a plan."),
        items: [
          {
            q: t("أنا مستقل أم استوديو؟", "Am I a freelancer or a studio?"),
            a: t(
              "إن كنت تعمل وحدك فأنت مستقل، وإن كان معك فريق فأنت استوديو.",
              "If you work alone, you're a freelancer. If you have a team, you're a studio.",
            ),
          },
          {
            q: t("أنا استوديو أم شركة؟", "A studio or a company?"),
            a: t(
              "إن كانت العلامة لعميلك فأنت استوديو، وإن كانت لشركتك فأنت شركة. والحساب الواحد يجمع الاثنين.",
              "If it's your client's brand, you're a studio. If it's your company's, you're a company. One account holds both.",
            ),
          },
          {
            q: t("ما المشروع النشط؟", "What's an active project?"),
            a: t(
              "المشروع الذي ما زلت تعدّله. سلّمه أو أرشفه، فيتوقف احتسابه.",
              "One you can still edit. Hand it off or archive it, and it stops counting.",
            ),
          },
          {
            q: t("ما الفرق بين المحرّر والمشاهد؟", "Editor or viewer?"),
            a: t(
              "المحرّر يغيّر العلامة. المشاهد يتصفحها، وينزّل، ويراجع كتاباته.",
              "Editors change the brand. Viewers browse, download and check their writing.",
            ),
          },
          {
            q: t("هل أستطيع تغيير خطتي لاحقاً؟", "Can I change plans later?"),
            a: t(
              "نعم، متى شئت، صعوداً أو نزولاً، ومشاريعك معك.",
              "Yes, any time, up or down. Your projects come with you.",
            ),
          },
          {
            q: t("وإن زاد فريقي على حدّ الخطة؟", "What if my team outgrows the plan?"),
            a: t(
              `أضف مقاعد أو محرّرين بـ ${EXTRAS.seat} دولارات شهرياً، في خطط «${names.studio}» و«${names.agency}» و«${names.team}» و«${names.business}».`,
              `Add seats or editors at ${money(EXTRAS.seat)} a month, on ${names.studio}, ${names.agency}, ${names.team} and ${names.business}.`,
            ),
          },
          {
            q: t("هل أحتاج استوديو؟", "Do I need a studio?"),
            a: t("لا. الشركة تبدأ وحدها.", "No. A company can start on its own."),
          },
        ],
      },
      {
        kind: "faq",
        id: "faq-billing",
        title: t("أسئلة عن الدفع.", "Questions about paying."),
        items: [
          {
            q: t("كيف أدفع؟", "How do I pay?"),
            a: t("عبر PayPal، بالدولار الأمريكي.", "Through PayPal, in US dollars."),
          },
          {
            q: t(
              `هل يشمل عرض الإطلاق «${names.solo}» و«${names.starter}»؟`,
              `Are ${names.solo} and ${names.starter} in the launch offer?`,
            ),
            a: t(
              `لا. سعرهما ثابت، ${LOWEST_PAID_MONTHLY} دولاراً شهرياً.`,
              `No. Their price stays at ${money(LOWEST_PAID_MONTHLY)} a month.`,
            ),
          },
          {
            q: t("هل يجتمع عرض الإطلاق مع السنوي؟", "Does the launch offer work with yearly billing?"),
            a: t("لا. العرض للاشتراك الشهري.", "No. It's for monthly plans."),
          },
          {
            q: t("ماذا يحدث لمركز عميلي إن لم يدفع؟", "What if my client never pays?"),
            a: t(
              "يبقى حيّاً وقابلاً للتعديل على الخطة المجانية.",
              "The hub stays live and editable on the free plan.",
            ),
          },
        ],
      },
      {
        kind: "faq",
        id: "faq-limits",
        title: t("أسئلة عن الذكاء والحدود.", "Questions about AI and limits."),
        items: [
          {
            q: t("ماذا يحدث حين ينفد حدّ أداة؟", "What happens when a limit runs out?"),
            a: t(
              "تتوقف تلك الأداة وحدها حتى الشهر التالي، أو تضيف حزمة. وبقية الأدوات تعمل.",
              "Only that tool pauses until next month, or you add a pack. Everything else keeps working.",
            ),
          },
          {
            q: t("هل ينتقل ما لم أستخدمه إلى الشهر التالي؟", "Do unused limits roll over?"),
            a: t(
              "لا. الحدود الشهرية تتجدد ولا تُرحَّل، والحزم صالحة 12 شهراً.",
              "No. Monthly limits renew and don't roll over. Packs last 12 months.",
            ),
          },
          {
            q: t("لماذا للموك اب حدّ؟", "Why do mockups have a limit?"),
            a: t(
              "لأن الذكاء الاصطناعي يصنع كل مشهد من جديد، ولكل مشهد تكلفة حقيقية.",
              "Because AI makes every scene from scratch, and each one has a real cost.",
            ),
          },
          {
            q: t("هل أربط ChatGPT أو Claude بعلامتي؟", "Can I connect ChatGPT or Claude?"),
            a: t(
              "نعم، في الخطط المدفوعة. يقرأ فقط، ولا يمسّ حدودك.",
              "Yes, on paid plans. It only reads, and doesn't touch your limits.",
            ),
          },
        ],
      },
      {
        kind: "faq",
        id: "faq-data",
        title: t("أسئلة عن بياناتك.", "Questions about your data."),
        items: [
          {
            q: t("هل محتواي آمن؟", "Is my content safe?"),
            a: t("لا شيء يصبح عاماً حتى تنشره.", "Nothing goes public until you publish it."),
          },
          {
            q: t("هل لوحة التحكم بالعربية؟", "Is the dashboard in Arabic?"),
            a: t(
              "نعم. لغة الواجهة لك، ولغة العلامة لعلامتك.",
              "Yes. You pick your interface language; the brand has its own.",
            ),
          },
        ],
      },

      {
        kind: "cta",
        title: t("ابدأ مجاناً اليوم.", "Start free today."),
        lead: t(
          "المشاهدون مجانيون في كل الخطط المدفوعة.",
          "Viewers are free on every paid plan.",
        ),
        buttons: [
          { label: t("أصمّم هويات لعملائي", "I make brands for clients"), href: "/start?type=freelancer" },
          { label: t("أدير علامة شركتي", "I run my company's brand"), href: "/start?type=company" },
        ],
        links: [{ label: t("تواصل معنا", "Talk to us"), href: "/contact?topic=sales" }],
      },
    ],
  };
}

/**
 * The launch offer, for the announcement bar on every page.
 *
 * Returns the same two instants as the block on /pricing, from the same
 * constant, so the bar and the page cannot disagree about when the window
 * closes.
 */
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
 * Three audiences now, because /pricing has three: a homepage that offered
 * "studios and freelancers" against "companies" would be the one place left on
 * the site where a freelancer is told to read a studio's prices. The switch is
 * built for any number of options, and the grid is
 * `auto-fit, minmax(280px, 1fr)` inside a 1040px container -- so each audience
 * shows three plans, which is all three for the two studio tabs and the first
 * three of five for companies. The note carries the rest to /pricing, which is
 * the page that can hold it.
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
    headline: t("لكل طريقةِ عمل، خطتُها.", "Every way of working has its plan."),
    body: t(
      `أعدّ علامتك مجاناً، والخطط المدفوعة من ${LOWEST_PAID_MONTHLY} دولاراً شهرياً. المشاهدون مجانيون في كل الخطط المدفوعة.`,
      `Build your brand free, with paid plans from ${money(LOWEST_PAID_MONTHLY)} a month. Viewers are free on every paid plan.`,
    ),
    audiences: [
      {
        id: "freelancers",
        label: audienceLabel(locale, "freelancers"),
        plans: freelancerCards(locale).map(teaser),
        note: t(
          `مشروع واحد مجاناً، واثنان في «${names.solo}»، وخمسة في «${names.pro}». والمشاريع المسلّمة لا تُحتسب.`,
          `One project free, two on ${names.solo}, five on ${names.pro}. Handed-off projects don't count.`,
        ),
      },
      {
        id: "studios",
        label: audienceLabel(locale, "studios"),
        plans: studioCards(locale).map(teaser),
        note: t(
          `عشرة مشاريع لفريق من خمسة في «${names.studio}»، وخمسة وعشرون لفريق من اثني عشر في «${names.agency}».`,
          `Ten projects for a team of five on ${names.studio}, twenty-five for a team of twelve on ${names.agency}.`,
        ),
      },
      {
        id: "companies",
        label: audienceLabel(locale, "companies"),
        plans: companyCards(locale).slice(0, 3).map(teaser),
        note: t(
          `ولعدة علامات خطة «${names.team}»، ولقسم تسويق كامل «${names.business}»، وللمؤسسات خطة خاصة.`,
          `Several brands have ${names.team}, a full marketing team has ${names.business}, and larger organisations have Enterprise.`,
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
