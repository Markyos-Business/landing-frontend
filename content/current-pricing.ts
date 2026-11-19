import type { PageBlock, PageDoc, PlanCard } from "./pages/types";
import type { PricingTeaserCopy } from "./types";

type AccountType = "freelancer" | "studio" | "company";
type Locale = "en" | "ar";

/**
 * Monthly USD price per brand, by the brand owner's account type.
 * Guarded against Django's billing.PRICES and the app by check:pricing.
 */
export const CURRENT_PRICES = {
  freelancer: { subscription: 19 },
  studio: { subscription: 29 },
  company: { subscription: 99 },
} as const;

/**
 * What each account type may have (null = no limit). Guarded against the
 * app's ACCOUNT_TYPES limits by check:pricing. Plans don't change these.
 */
export const CURRENT_LIMITS = {
  freelancer: { brands: 3, editors: 0 },
  studio: { brands: null, editors: null },
  company: { brands: 1, editors: null },
} as const;

const TYPES = ["freelancer", "studio", "company"] as const;

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
  },
} as const;

const limit = (value: number | null, locale: Locale) => (value === null ? copy[locale].unlimited : String(value));

/** The brand owner's account type selects the price; a paid plan covers one brand. */
function accountPlan(type: AccountType, locale: Locale): PlanCard & { cta: { label: string; href: string } } {
  const c = copy[locale];
  const limits = CURRENT_LIMITS[type];
  return {
    name: c.names[type],
    price: `$${CURRENT_PRICES[type].subscription}`,
    period: c.period,
    who: c.who[type],
    rows: [
      { label: c.brands, value: limit(limits.brands, locale) },
      { label: c.editors, value: limits.editors === 0 ? c.alone : limit(limits.editors, locale) },
    ],
    features: [...c.features],
    recommended: type === "studio",
    cta: { label: c.cta, href: `/start?type=${type}` },
  };
}

export function currentPricingPage(locale: Locale): PageDoc {
  const ar = locale === "ar";
  const yes = ar ? "نعم" : "Yes";
  const firstFree = ar ? "التحليل الأول مجاني" : "First run free";
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
      {
        kind: "plans",
        id: "plans",
        title: ar ? "اختر نوع حسابك." : "Choose your account type.",
        lead: ar
          ? "السعر حسب نوع حساب مالك العلامة، وكل اشتراك يخص علامة واحدة."
          : "The price follows the brand owner's account type. Each plan covers one brand.",
        recommendedLabel: copy[locale].popular,
        plans: TYPES.map((type) => accountPlan(type, locale)),
        note: copy[locale].payNote,
      },
      {
        kind: "table",
        id: "compare",
        title: ar ? "علامة مجانية أم مدفوعة." : "Free brand vs paid brand.",
        head: ["", ar ? "علامة مجانية" : "Free brand", { text: ar ? "علامة مدفوعة" : "Paid brand", strong: true }],
        rows: [
          [ar ? "بناء الاستراتيجية والهوية والدليل" : "Build strategy, identity and guideline", yes, { text: yes, strong: true }],
          [ar ? "روابط المشاركة" : "Share links", yes, { text: yes, strong: true }],
          [ar ? "نشر موقع الدليل" : "Publish the guideline site", ar ? "مسودة فقط" : "Draft only", { text: yes, strong: true }],
          [ar ? "شارة «صُنع بماركيوس»" : "“Made with Markyos” badge", ar ? "تظهر" : "Shown", { text: ar ? "تُزال" : "Removed", strong: true }],
          [ar ? "تحليل الموجز بالذكاء الاصطناعي" : "AI brief analysis", firstFree, { text: firstFree, strong: true }],
        ],
      },
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

/** An audience page's price table: a free brand next to that account type's paid brand. */
export function audiencePlanTable(type: AccountType, locale: Locale, title: string): PageBlock {
  const ar = locale === "ar";
  const c = copy[locale];
  const limits = CURRENT_LIMITS[type];
  const brands = limits.brands === null ? (ar ? "عدد غير محدود من العلامات" : "any number of brands") : ar ? `${limits.brands === 1 ? "علامة واحدة" : `حتى ${limits.brands} علامات`}` : `${limits.brands === 1 ? "one brand" : `up to ${limits.brands} brands`}`;
  const team = limits.editors === 0 ? (ar ? "ويعمل وحده" : "and works alone") : ar ? "مع فريق من المحرّرين" : "with a team of editors";
  return {
    kind: "table",
    title,
    numeric: true,
    head: ["", ar ? "علامة مجانية" : "Free brand", { text: ar ? `خطة ${c.names[type]}` : `${c.names[type]} plan`, strong: true }],
    rows: [
      [ar ? "السعر" : "Price", "$0", { text: `$${CURRENT_PRICES[type].subscription} ${c.period}`, strong: true }],
      [ar ? "موقع الدليل" : "Guideline site", ar ? "مسودة فقط" : "Draft only", { text: ar ? "منشور لعميلك" : "Live for your client", strong: true }],
      [ar ? "شارة «صُنع بماركيوس»" : "“Made with Markyos” badge", ar ? "تظهر" : "Shown", { text: ar ? "تُزال" : "Removed", strong: true }],
    ],
    note: ar
      ? `حساب ${c.names[type]} يملك ${brands} ${team}. كل اشتراك يخص علامة واحدة.`
      : `A ${c.names[type]} account owns ${brands} ${team}. Each plan covers one brand.`,
  };
}

export function currentPricingTeaser(locale: Locale): PricingTeaserCopy {
  const ar = locale === "ar";
  const teaser = (type: AccountType) => {
    const plan = accountPlan(type, locale);
    return {
      name: plan.name,
      price: `${plan.price} ${plan.period}`,
      rows: plan.rows,
      line: plan.who ?? "",
      recommended: plan.recommended,
      cta: plan.cta,
    };
  };
  return {
    headline: ar ? "ابنِ علامتك مجاناً. وادفع لكل علامة حين تشاركها." : "Build your brand free. Pay per brand when you share it.",
    body: ar
      ? "أعدّ دليلك مجاناً، ثم اشترك شهرياً لتشاركه مع عميلك. كل اشتراك يخص علامة واحدة، بالدولار الأمريكي."
      : "Prepare your guideline free, then subscribe monthly to share it with your client. Each plan covers one brand, in US dollars.",
    studioToggle: ar ? "للاستوديوهات والمستقلين" : "For studios and freelancers",
    companyToggle: ar ? "للشركات" : "For companies",
    studioPlans: [teaser("freelancer"), teaser("studio")],
    companyPlans: [teaser("company")],
    recommendedLabel: copy[locale].popular,
    studioNote: ar ? "اختر نوع حسابك عند التسجيل، واشترك من إعدادات كل علامة." : "Choose your account type at signup, and subscribe in each brand's settings.",
    companyNote: ar ? "الاشتراك الشهري يخص علامة شركتك وحدها." : "The monthly plan covers your company's brand only.",
    underBoth: ar ? "فوترة شهرية عبر PayPal، وإلغاء متى شئت." : "Monthly billing through PayPal. Cancel any time.",
    link: { label: ar ? "اطّلع على الأسعار" : "See full pricing", href: "/pricing" },
  };
}
