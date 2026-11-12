import type { PageDoc, PlanCard } from "./pages/types";
import type { PricingTeaserCopy } from "./types";

type AccountType = "freelancer" | "studio" | "company";
type Locale = "en" | "ar";

/** Current USD checkout prices, per brand. Guarded against Django and the app by check:pricing. */
export const CURRENT_PRICES = {
  freelancer: { pass: 15, subscription: 19 },
  studio: { pass: 19, subscription: 29 },
  company: { pass: 49, subscription: 99 },
} as const;

const names = {
  en: { freelancer: "Freelancer", studio: "Studio", company: "Company" },
  ar: { freelancer: "مستقل", studio: "استوديو", company: "شركة" },
};

/** Account type selects the price; paid plans always cover one brand. */
function accountPlan(type: AccountType, locale: Locale): PlanCard & { cta: { label: string; href: string } } {
  const ar = locale === "ar";
  const prices = CURRENT_PRICES[type];
  return {
    name: names[locale][type],
    price: `$${prices.pass}`,
    period: ar ? "لمرة واحدة، لكل علامة" : "once, per brand",
    who: ar ? "تصريح المشروع يفتح رابط العميل لدليل علامة واحدة." : "A Project Pass opens the client link for one brand's guideline.",
    rows: [
      { label: ar ? "الاشتراك الشهري" : "Monthly brand plan", value: ar ? `$${prices.subscription} / شهر` : `$${prices.subscription} / month` },
      { label: ar ? "نطاق الخطة المدفوعة" : "Each paid plan covers", value: ar ? "علامة واحدة" : "One brand" },
    ],
    cta: { label: ar ? "أنشئ حسابك" : "Create your account", href: `/start?type=${type}` },
  };
}

export function currentPricingPage(locale: Locale): PageDoc {
  const ar = locale === "ar";
  return {
    path: "/pricing",
    shortTitle: ar ? "الأسعار" : "Pricing",
    title: ar ? "الأسعار · ماركيوس" : "Pricing · Markyos",
    description: ar ? "ابدأ بإنشاء علامتك مجاناً. تصريح لمرة واحدة أو اشتراك شهري لكل علامة، بالدولار الأمريكي." : "Create your brand free. Choose a one-time Project Pass or a monthly plan for each brand, in US dollars.",
    breadcrumbs: [{ label: ar ? "الرئيسية" : "Home", href: "/" }],
    priority: 0.9,
    blocks: [
      {
        kind: "hero",
        title: ar ? "ابدأ مجاناً. وادفع لكل علامة." : "Start free. Pay per brand.",
        lead: ar ? "أنشئ علامتك وأعدّ دليلها قبل الدفع. لمشاركة الدليل، اختر تصريح المشروع لمرة واحدة أو اشتراكاً شهرياً لتلك العلامة." : "Create your brand and prepare its guideline before paying. To share the guideline, choose a one-time Project Pass or a monthly plan for that brand.",
      },
      {
        kind: "plans",
        id: "plans",
        title: ar ? "اختر نوع حسابك." : "Choose your account type.",
        lead: ar ? "السعر حسب نوع حساب مالك العلامة. كل تصريح أو اشتراك مدفوع يخص علامة واحدة، وليس جميع علامات الحساب." : "The price follows the brand owner's account type. Each paid pass or subscription covers one brand, not every brand in the account.",
        recommendedLabel: ar ? "موصى بها" : "Recommended",
        plans: (["freelancer", "studio", "company"] as const).map((type) => accountPlan(type, locale)),
        note: ar ? "كل الأسعار بالدولار الأمريكي. الاشتراك شهري؛ لا توجد فوترة سنوية أو رسوم مقاعد إضافية ضمن هذه الخطط." : "All prices are in US dollars. Subscriptions are billed monthly; these plans have no annual billing or extra-seat charges.",
      },
      {
        kind: "prose",
        title: ar ? "أنشئ حسابك أولاً، ثم اختر خطة لعلامتك." : "Create your account, then choose a plan for your brand.",
        body: [
          ar ? "إنشاء الحساب لا يشتري خطة. بعد إعداد علامتك، افتح إعداداتها لاختيار تصريح المشروع أو الاشتراك الشهري. تتحقق المنصة من الدفع قبل تفعيل الخطة." : "Signing up does not purchase a plan. After setting up your brand, open its settings to choose a Project Pass or monthly plan. The platform verifies payment before activating access.",
          ar ? "لا تشمل الخطط الحالية أرصدة شهرية أو حزم أرصدة مدفوعة." : "The current plans do not include monthly credit allowances or paid credit packs.",
        ],
      },
      {
        kind: "faq",
        id: "faq",
        title: ar ? "أسئلة عن الدفع." : "Payment questions.",
        items: [
          { q: ar ? "ما الفرق بين التصريح والاشتراك؟" : "How do the pass and subscription differ?", a: ar ? "تصريح المشروع دفعة واحدة لفتح رابط العميل لدليل علامة واحدة. الاشتراك خطة شهرية لدليل تلك العلامة، ويمكن إدارته من إعداداتها." : "A Project Pass is a one-time payment to open the client link for one guideline. A subscription is a monthly plan for that brand's guideline, managed from its settings." },
          { q: ar ? "هل يغطي الاشتراك كل علاماتي؟" : "Does a subscription cover all my brands?", a: ar ? "لا. كل عملية شراء تخص علامة واحدة. يحدد نوع الحساب عدد العلامات والمحررين المسموح بهم، وليس مستوى الاشتراك." : "No. Each purchase covers one brand. Account type determines the brand and editor limits; it is separate from the paid plan." },
          { q: ar ? "هل نشر الدليل متاح مجاناً؟" : "Can I publish a guideline for free?", a: ar ? "يمكنك إعداد الدليل قبل الدفع. عرض الدليل المنشور يتطلب تصريحاً مدفوعاً تم التحقق منه أو اشتراكاً نشطاً لتلك العلامة." : "You can prepare the guideline before paying. Serving the published guideline requires a verified paid pass or active subscription for that brand." },
          { q: ar ? "كيف أدفع؟" : "How do I pay?", a: ar ? "من إعدادات العلامة عبر Stripe، بالدولار الأمريكي. تعرض صفحة الدفع الخطة والسعر قبل تأكيد الشراء." : "From the brand's settings through Stripe, in US dollars. Checkout shows the plan and price before you confirm the purchase." },
        ],
      },
    ],
  };
}

export function currentPricingTeaser(locale: Locale): PricingTeaserCopy {
  const ar = locale === "ar";
  const teaser = (type: AccountType) => {
    const plan = accountPlan(type, locale);
    return { name: plan.name, price: `${plan.price} ${ar ? "لمرة واحدة" : "once"}`, rows: plan.rows, line: ar ? "تصريح المشروع لكل علامة" : "Project Pass per brand", cta: plan.cta };
  };
  return {
    headline: ar ? "ابدأ مجاناً. وادفع لكل علامة." : "Start free. Pay per brand.",
    body: ar ? "أعدّ دليلك مجاناً، ثم اختر تصريحاً لمرة واحدة أو اشتراكاً شهرياً لمشاركته. كل خطة مدفوعة تخص علامة واحدة، بالدولار الأمريكي." : "Prepare your guideline free, then choose a one-time pass or monthly plan to share it. Each paid plan covers one brand, in US dollars.",
    studioToggle: ar ? "للاستوديوهات والمستقلين" : "For studios and freelancers",
    companyToggle: ar ? "للشركات" : "For companies",
    studioPlans: [teaser("freelancer"), teaser("studio")],
    companyPlans: [teaser("company")],
    recommendedLabel: ar ? "موصى بها" : "Recommended",
    studioNote: ar ? "اختر نوع حسابك عند التسجيل، والخطة من إعدادات كل علامة." : "Choose your account type at signup and a plan in each brand's settings.",
    companyNote: ar ? "الاشتراك الشهري يخص علامة شركتك وحدها." : "The monthly plan covers your company's brand only.",
    underBoth: ar ? "فوترة شهرية فقط؛ لا توجد حزم أرصدة مدفوعة ضمن هذه الخطط." : "Monthly billing only; these plans do not include paid credit packs.",
    link: { label: ar ? "اطّلع على الأسعار" : "See full pricing", href: "/pricing" },
  };
}
