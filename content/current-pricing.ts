import type { PageBlock, PageDoc, PlanCard } from "./pages/types";
import type { OfferBarCopy, PlanCopy, PricingTeaserCopy, PricingTeaserPlans } from "./types";

/*
 * Pricing copy, and the one place it meets the backend's figures.
 *
 * The app sells a monthly PayPal plan per brand, priced by the brand owner's
 * account type. What it charges and what each type may have are the
 * backend's (`GET /billing/plans/`, read by src/lib/billing/plans.ts); this
 * file keeps only the words, in both languages, and the functions that set
 * the figures into them at render time. There is no second copy of a price
 * here to drift: check:pricing fails if one comes back.
 *
 * Every builder takes `plans: BillingPlans | null`. `null` is a build that
 * could not reach the backend; it renders the same sections without figures
 * and with the sign-up links, never a guessed number.
 */

export type AccountType = "freelancer" | "studio" | "company";
type Locale = "en" | "ar";

/** What a brand may have. `null` is no limit. */
export type PlanLimits = { brands: number | null; editors: number | null };

/** `GET /billing/plans/`, as the backend sends it. Amounts are cents. */
export type BillingPlans = {
  currency: string;
  interval: "month";
  perBrand: boolean;
  /** A brand without a plan: the account may own this many, with these editors. */
  free: PlanLimits;
  types: Record<AccountType, { monthly: number; limits: PlanLimits }>;
};

/** Card order on the page and in the comparison: the recommended one in the middle. */
export const ACCOUNT_TYPES = ["freelancer", "studio", "company"] as const satisfies readonly AccountType[];

const copy = {
  en: {
    names: { freelancer: "Freelancer", studio: "Studio", company: "Company" },
    who: {
      freelancer: "For one person running a few client brands.",
      studio: "For studios running client brands with a team.",
      company: "For a company running its own brand.",
    },
    period: "/ month, per brand",
    brands: "Brands",
    editors: "Editors",
    unlimited: "Unlimited",
    alone: "Works alone",
    features: ["Share the guideline with your client", "No “Made with Markyos” badge"],
    cta: "Get started free",
    popular: "Most popular",
    payNote:
      "Pay with PayPal or a card through PayPal. Cancel any time and keep access to the end of the month you paid for.",
    noFigures: "Sign up free to see the current monthly price for your account type before you subscribe.",
    plansTitle: "Choose your account type.",
    plansLead: "The price follows the brand owner's account type. Each plan covers one brand.",
    compareTitle: "A free brand next to each paid plan.",
    freeBrand: "Free brand",
    plan: (name: string) => `${name} plan`,
    priceRow: "Monthly price per brand",
    priceShort: "Price",
    freePrice: "Free",
    yes: "Yes",
    firstFree: "First run free",
    build: "Build strategy, identity and guideline",
    share: "Share links",
    publish: "Publish the guideline site",
    draftOnly: "Draft only",
    site: "Guideline site",
    live: "Live for your client",
    badge: "“Made with Markyos” badge",
    shown: "Shown",
    removed: "Removed",
    ai: "AI brief analysis",
    compareNote: "Your account owns one free brand. Each plan covers one brand, and your other brands stay free until you share them.",
    audienceNote: "Each plan covers one brand.",
  },
  ar: {
    names: { freelancer: "مستقل", studio: "استوديو", company: "شركة" },
    who: {
      freelancer: "لمن يعمل وحده على علامات عدد من العملاء.",
      studio: "للاستوديوهات التي تدير علامات عملائها مع فريق.",
      company: "للشركات التي تدير علامتها الخاصة.",
    },
    period: "شهرياً، لكل علامة",
    brands: "العلامات",
    editors: "المحرّرون",
    unlimited: "بلا حدود",
    alone: "تعمل وحدك",
    features: ["مشاركة الدليل مع عميلك", "دون شارة «صُنع بماركيوس»"],
    cta: "ابدأ مجاناً",
    popular: "الأكثر اختياراً",
    payNote:
      "ادفع عبر PayPal، أو ببطاقتك من خلال PayPal. ألغِ متى شئت، ويبقى وصولك حتى نهاية الشهر الذي دفعت عنه.",
    noFigures: "سجّل مجاناً لترى السعر الشهري الحالي لنوع حسابك قبل أن تشترك.",
    plansTitle: "اختر نوع حسابك.",
    plansLead: "السعر حسب نوع حساب مالك العلامة، وكل اشتراك يخص علامة واحدة.",
    compareTitle: "علامة مجانية بجانب كل خطة مدفوعة.",
    freeBrand: "علامة مجانية",
    plan: (name: string) => `خطة ${name}`,
    priceRow: "السعر الشهري لكل علامة",
    priceShort: "السعر",
    freePrice: "مجاناً",
    yes: "نعم",
    firstFree: "التحليل الأول مجاني",
    build: "بناء الاستراتيجية والهوية والدليل",
    share: "روابط المشاركة",
    publish: "نشر موقع الدليل",
    draftOnly: "مسودة فقط",
    site: "موقع الدليل",
    live: "منشور لعميلك",
    badge: "شارة «صُنع بماركيوس»",
    shown: "تظهر",
    removed: "تُزال",
    ai: "تحليل الموجز بالذكاء الاصطناعي",
    compareNote: "يملك حسابك علامة مجانية واحدة. كل اشتراك يخص علامة واحدة، وتبقى علاماتك الأخرى مجانية حتى تشاركها.",
    audienceNote: "كل اشتراك يخص علامة واحدة.",
  },
};

/** "$29" in both languages, as the app and PayPal show it. */
function amount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

const limitText = (value: number | null, locale: Locale) => (value === null ? copy[locale].unlimited : String(value));
const editorsText = (value: number | null, locale: Locale) => (value === 0 ? copy[locale].alone : limitText(value, locale));

const signup = (type: AccountType) => `/start?type=${type}`;

/** One account type's card. Without plans it keeps its name, who-line, features and sign-up link. */
function accountPlan(type: AccountType, locale: Locale, plans: BillingPlans | null): PlanCard & { cta: { label: string; href: string } } {
  const c = copy[locale];
  const figures = plans?.types[type];
  return {
    name: c.names[type],
    price: figures && plans ? amount(figures.monthly, plans.currency) : undefined,
    period: figures ? c.period : undefined,
    who: c.who[type],
    rows: figures
      ? [
          { label: c.brands, value: limitText(figures.limits.brands, locale) },
          { label: c.editors, value: editorsText(figures.limits.editors, locale) },
        ]
      : [],
    features: [...c.features],
    recommended: type === "studio",
    cta: { label: c.cta, href: signup(type) },
  };
}

/** The account-type cards. */
function plansBlock(id: string | undefined, locale: Locale, plans: BillingPlans | null): PageBlock {
  const c = copy[locale];
  return {
    kind: "plans",
    id,
    title: c.plansTitle,
    lead: c.plansLead,
    recommendedLabel: c.popular,
    plans: ACCOUNT_TYPES.map((type) => accountPlan(type, locale, plans)),
    note: plans ? c.payNote : `${c.payNote} ${c.noFigures}`,
  };
}

/** Free vs each paid account type: price, brands, editors, then what a plan unlocks. */
function compareBlock(id: string | undefined, title: string | undefined, locale: Locale, plans: BillingPlans | null): PageBlock {
  const c = copy[locale];
  const paid = (value: string) => ACCOUNT_TYPES.map(() => value);
  const figureRows = plans
    ? [
        [c.priceRow, c.freePrice, ...ACCOUNT_TYPES.map((t) => amount(plans.types[t].monthly, plans.currency))],
        [c.brands, limitText(plans.free.brands, locale), ...ACCOUNT_TYPES.map((t) => limitText(plans.types[t].limits.brands, locale))],
        [c.editors, editorsText(plans.free.editors, locale), ...ACCOUNT_TYPES.map((t) => editorsText(plans.types[t].limits.editors, locale))],
      ]
    : [];
  return {
    kind: "table",
    id,
    title: title ?? c.compareTitle,
    numeric: true,
    head: ["", c.freeBrand, ...ACCOUNT_TYPES.map((t) => ({ text: c.plan(c.names[t]), strong: true }))],
    rows: [
      ...figureRows,
      [c.build, c.yes, ...paid(c.yes)],
      [c.share, c.yes, ...paid(c.yes)],
      [c.publish, c.draftOnly, ...paid(c.yes)],
      [c.badge, c.shown, ...paid(c.removed)],
      [c.ai, c.firstFree, ...paid(c.firstFree)],
    ],
    note: plans ? c.compareNote : `${c.compareNote} ${c.noFigures}`,
  };
}

/** An audience page's table: a free brand next to that account type's paid brand. */
function audienceBlock(type: AccountType, id: string | undefined, title: string | undefined, locale: Locale, plans: BillingPlans | null): PageBlock {
  const c = copy[locale];
  const figures = plans?.types[type];
  const figureRows = plans && figures
    ? [
        [c.priceShort, c.freePrice, { text: `${amount(figures.monthly, plans.currency)} ${c.period}`, strong: true }],
        [c.brands, limitText(plans.free.brands, locale), { text: limitText(figures.limits.brands, locale), strong: true }],
        [c.editors, editorsText(plans.free.editors, locale), { text: editorsText(figures.limits.editors, locale), strong: true }],
      ]
    : [];
  return {
    kind: "table",
    id,
    title,
    numeric: true,
    head: ["", c.freeBrand, { text: c.plan(c.names[type]), strong: true }],
    rows: [
      ...figureRows,
      [c.site, c.draftOnly, { text: c.live, strong: true }],
      [c.badge, c.shown, { text: c.removed, strong: true }],
    ],
    note: plans ? c.audienceNote : `${c.audienceNote} ${c.noFigures}`,
  };
}

/** A `priced` block, with the backend's figures set into its copy. */
export function resolvePriced(
  block: Extract<PageBlock, { kind: "priced" }>,
  locale: Locale,
  plans: BillingPlans | null,
): Extract<PageBlock, { kind: "plans" | "table" }> {
  switch (block.part) {
    case "plans":
      return plansBlock(block.id, locale, plans) as Extract<PageBlock, { kind: "plans" }>;
    case "compare":
      return compareBlock(block.id, block.title, locale, plans) as Extract<PageBlock, { kind: "table" }>;
    case "audience":
      return audienceBlock(block.type ?? "studio", block.id, block.title, locale, plans) as Extract<PageBlock, { kind: "table" }>;
  }
}

export function currentPricingPage(locale: Locale): PageDoc {
  const ar = locale === "ar";
  return {
    path: "/pricing",
    shortTitle: ar ? "الأسعار" : "Pricing",
    title: ar ? "الأسعار · ماركيوس" : "Pricing · Markyos",
    description: ar
      ? "ابنِ علامتك مجاناً، وادفع شهرياً لكل علامة حين تشارك دليلها مع عميلك. بالدولار الأمريكي، عبر PayPal."
      : "Build your brand free, and pay monthly per brand when you share its guideline with your client. In US dollars, through PayPal.",
    breadcrumbs: [{ label: ar ? "الرئيسية" : "Home", href: "/" }],
    priority: 0.9,
    blocks: [
      {
        kind: "hero",
        title: ar ? "ابنِ علامتك مجاناً. وادفع لكل علامة حين تشاركها." : "Build your brand free. Pay per brand when you share it.",
        lead: ar
          ? "أعدّ الاستراتيجية والهوية والدليل دون أن تدفع. وحين تريد مشاركة الدليل مع عميلك، اشترك شهرياً لتلك العلامة وحدها."
          : "Set up the strategy, identity and guideline without paying. When you share the guideline with your client, subscribe that one brand monthly.",
      },
      { kind: "priced", part: "plans", id: "plans" },
      { kind: "priced", part: "compare", id: "compare" },
      {
        kind: "cards",
        id: "faq",
        title: ar ? "أسئلة عن الدفع." : "Payment questions.",
        cols: 2,
        items: [
          {
            title: ar ? "متى أدفع؟" : "When do I pay?",
            body: ar
              ? "حين تريد مشاركة دليل علامة مع عميلك فقط. البناء مجاني، ودون مهلة."
              : "Only when you want to share a brand's guideline with your client. Building it is free, with no time limit.",
          },
          {
            title: ar ? "هل الاشتراك لكل علامة؟" : "Is it per brand?",
            body: ar
              ? "نعم. كل اشتراك يخص علامة واحدة، بسعر نوع حسابك. وتبقى علاماتك الأخرى مجانية حتى تشاركها."
              : "Yes. Each plan covers one brand, priced by your account type. Your other brands stay free until you share them.",
          },
          {
            title: ar ? "هل يمكنني الإلغاء؟" : "Can I cancel?",
            body: ar
              ? "متى شئت، من إعدادات الفوترة. تبقى الخطة مفعّلة حتى نهاية الشهر الذي دفعت عنه، ثم يتوقف موقع الدليل. ويبقى عملك كما هو."
              : "Any time, from billing settings. The plan stays active to the end of the month you paid for, then the site goes offline. Your work stays.",
          },
          {
            title: ar ? "كيف أدفع؟" : "How do I pay?",
            body: ar
              ? "عبر PayPal، أو ببطاقتك من خلال PayPal، بالدولار الأمريكي. ويرسل لك PayPal إيصالاً عن كل دفعة."
              : "With PayPal, or a card through PayPal, in US dollars. PayPal emails you a receipt for every payment.",
          },
        ],
      },
    ],
  };
}

/** An audience page's price table, filled in from the backend's plans at render time. */
export function audiencePlanTable(type: AccountType, _locale: Locale, title: string): PageBlock {
  return { kind: "priced", part: "audience", type, title };
}

/** The homepage teaser's words. Its cards are `teaserPlans`. */
export function currentPricingTeaser(locale: Locale): PricingTeaserCopy {
  const ar = locale === "ar";
  return {
    headline: ar ? "ابنِ علامتك مجاناً. وادفع لكل علامة حين تشاركها." : "Build your brand free. Pay per brand when you share it.",
    body: ar
      ? "أعدّ دليلك مجاناً، ثم اشترك شهرياً لتشاركه مع عميلك. كل اشتراك يخص علامة واحدة، بالدولار الأمريكي."
      : "Prepare your guideline free, then subscribe monthly to share it with your client. Each plan covers one brand, in US dollars.",
    studioToggle: ar ? "للاستوديوهات والمستقلين" : "For studios and freelancers",
    companyToggle: ar ? "للشركات" : "For companies",
    recommendedLabel: copy[locale].popular,
    studioNote: ar ? "اختر نوع حسابك عند التسجيل، واشترك من إعدادات كل علامة." : "Choose your account type at signup, and subscribe in each brand's settings.",
    companyNote: ar ? "الاشتراك الشهري يخص علامة شركتك وحدها." : "The monthly plan covers your company's brand only.",
    underBoth: ar ? "فوترة شهرية عبر PayPal، وإلغاء متى شئت." : "Monthly billing through PayPal. Cancel any time.",
    link: { label: ar ? "اطّلع على الأسعار" : "See full pricing", href: "/pricing" },
  };
}

/** The homepage teaser's cards, from the backend's plans (no figures when `null`). */
export function teaserPlans(locale: Locale, plans: BillingPlans | null): PricingTeaserPlans {
  const card = (type: AccountType): PlanCopy => {
    const plan = accountPlan(type, locale, plans);
    return {
      name: plan.name,
      price: plan.price ? `${plan.price} ${plan.period}` : undefined,
      rows: plan.rows,
      line: plan.who ?? "",
      recommended: plan.recommended,
      cta: plan.cta,
    };
  };
  return { studioPlans: [card("freelancer"), card("studio")], companyPlans: [card("company")] };
}

/**
 * The launch offer for the announcement bar above the nav, or null when none
 * is running — and none is. An offer has to be something checkout charges
 * (promo codes, planned in markyos-backend/docs/promo-codes-plan.md), not
 * copy the site promises on its own, so the bar stays hidden until then.
 */
export function currentLaunchOffer(locale: Locale): OfferBarCopy | null {
  void locale;
  return null;
}
