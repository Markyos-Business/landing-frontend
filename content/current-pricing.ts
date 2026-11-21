import type { PageDoc, PlanCard } from "./pages/types";
import type { OfferBarCopy, PricingTeaserCopy } from "./types";

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

/*
 * The launch offer.
 *
 * Half off the first year of a yearly subscription, claimable between the
 * two instants below. It discounts CURRENT_PRICES and never replaces them:
 * the list price is what check:pricing holds against billing.py and
 * accountTypes.ts, and every figure the offer shows is computed from it
 * here, so the two cannot drift apart.
 *
 * ── Yearly, as of 21 Nov 2026 ────────────────────────────────────────────
 *
 * The owner asked for the discount to apply to yearly subscriptions only.
 * There was no yearly subscription: the catalogue is a one-time pass and a
 * monthly plan, and the page said so in both editions. A year here is
 * therefore twelve months of the monthly plan paid up front -- `annual()`
 * below, derived and never typed -- and not a new list price. That is the
 * one shape that adds yearly billing without inventing a figure: the only
 * number on the page is still `subscription`, which the sibling
 * repositories guard.
 *
 * ── What this repository cannot guarantee ────────────────────────────────
 *
 * That any of this exists in Stripe. This is a marketing site; the charge
 * is made by the platform, and billing.py carries exactly two prices per
 * account -- `pass` and `subscription`. There is no annual SKU and no
 * coupon. **Two things have to be built before this page is true:** a
 * yearly price at twelve times the monthly one, and a coupon taking 50% off
 * the first year inside this window. Until both exist the page promises
 * $114 and the checkout takes something else, which is the worst failure
 * available to a pricing page. check:pricing compares prices against the
 * sibling repositories when they are present, neither is checked out here,
 * and it cannot see a coupon at all. It has to be verified by hand before
 * this goes live.
 *
 * ── The window ───────────────────────────────────────────────────────────
 *
 * Open now, closing at the end of 15 Feb 2027, which is PUBLIC_LAUNCH_DATE
 * in src/lib/launch.ts. The close is deliberately the launch day itself and
 * not a date after it: that is what was asked for.
 *
 * `opens` was 1 Dec 2026 until 21 Nov 2026, and the owner asked for a clock
 * that counts to 15 Feb. Before its opening instant the countdown counts to
 * the *opening* and says so -- which is correct behaviour and was the wrong
 * offer: a bar that reads "opens in 10 days" is an announcement, not a
 * promotion. Moving the instant into the past puts the window in its
 * `during` phase from the first render, so every clock on the site now runs
 * to the close. The `before` phase is kept rather than deleted because the
 * next offer may well be scheduled rather than live.
 *
 * Both are written as explicit UTC instants rather than dates. A countdown
 * that resolves "15 Feb 2027" in the reader's own zone ends at a different
 * moment in Riyadh than in London, and the offer is one offer.
 */
export const LAUNCH_OFFER = {
  /** Per cent off the first year of a yearly plan. Monthly and the pass are not discounted. */
  percent: 50,
  /** Months in the billing term the discount applies to: a year, paid up front. */
  months: 12,
  opens: "2026-11-21T00:00:00Z",
  closes: "2027-02-15T23:59:59Z",
} as const;

/**
 * A year, in dollars: twelve months of the monthly plan.
 *
 * check:pricing does not import this. It rebuilds the same figure from
 * CURRENT_PRICES itself and compares, which is the only version of the
 * check worth having: importing the function would prove the page agrees
 * with the function rather than that either agrees with the price.
 */
function annual(type: AccountType): number {
  return CURRENT_PRICES[type].subscription * LAUNCH_OFFER.months;
}

/** `$1,188`, with the separator: a four-figure price without one misreads. */
function money(value: number): string {
  /* A cent figure keeps both its digits -- `$9.50`, never `$9.5`, which
     reads as a typo -- and a whole figure keeps none, because `$114.00` on a
     yearly price is noise. Every current figure is whole; the branch is here
     so an odd future price cannot quietly lose a cent. */
  const digits = Number.isInteger(value) ? 0 : 2;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

/** A discounted first year, as a label. Always derived, never typed. */
function discountedYear(type: AccountType): string {
  return money((annual(type) * (100 - LAUNCH_OFFER.percent)) / 100);
}


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
      /* A year is the monthly price twelve times over, which is why it is
         written as `annual()` and not as a figure: there is one list price
         per account, and this is a term on it rather than a second one. */
      { label: ar ? "أو سنة مقدماً" : "Or a year up front", value: ar ? `${money(annual(type))} / سنة` : `${money(annual(type))} / year` },
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
        /*
         * The deck's headline, and why the lead is not the deck's.
         *
         * docs/copy/pages_ar_2_platform_pricing.md §17 heads this page
         * «ابدأ مجاناً. وادفع حين ترى النتيجة.» and the v4 English file
         * carries "Start free. Pay as you grow." Both are true of the live
         * checkout: the brand is built and its guideline laid out before
         * anything is paid, and the payment is what opens it to the client.
         *
         * The deck's *sub* is not shipped. It reads "studios pay for the
         * projects they are working on now, companies pay for the people
         * who edit the brand" -- two billing models the checkout does not
         * have. What it has is three account types, each with a one-time
         * pass and a monthly subscription, per brand, which is what the
         * lead below says and what CURRENT_PRICES is checked against.
         */
        title: ar ? "ابدأ مجاناً. وادفع حين ترى النتيجة." : "Start free. Pay as you grow.",
        lead: ar ? "أنشئ علامتك وأعدّ دليلها قبل الدفع. لمشاركة الدليل، اختر تصريح المشروع لمرة واحدة أو اشتراكاً شهرياً لتلك العلامة." : "Create your brand and prepare its guideline before paying. To share the guideline, choose a one-time Project Pass or a monthly plan for that brand.",
      },
      /*
       * The offer, above the prices it changes.
       *
       * The deck's page order puts it here, second, and that is the right
       * place for a reason the deck does not state: a visitor who reads
       * three cards and then finds out the figures on them were not the
       * figures they would pay has been made to do the arithmetic twice.
       * The offer is read first and the cards are read knowing it.
       *
       * The cards themselves are untouched. They carry the list price,
       * which is the price after three months and the price check:pricing
       * guards; the discount lives in one block that knows its own end
       * date and takes itself down.
       */
      {
        kind: "offer",
        id: "launch-offer",
        eyebrow: ar ? "عرض الإطلاق" : "Launch offer",
        title: ar
          ? "نصف السعر، لسنتك الأولى كاملة."
          : "Half price, for your whole first year.",
        lead: ar
          ? "ادفع سنة مقدماً قبل يوم الإطلاق، فتحصل على سنتك الأولى بنصف سعرها، أياً كان نوع حسابك. الخصم للاشتراك السنوي وحده."
          : "Pay for a year up front before launch day and your first year is half price, whichever account type you are on. The discount is for yearly billing only.",
        opens: LAUNCH_OFFER.opens,
        closes: LAUNCH_OFFER.closes,
        window: ar
          ? "العرض مفتوح الآن، وينتهي في 15 فبراير 2027."
          : "The offer is open now and ends on 15 Feb 2027.",
        countdown: {
          before: ar ? "يبدأ العرض بعد" : "The offer opens in",
          during: ar ? "ينتهي العرض بعد" : "The offer ends in",
          after: ar ? "انتهى عرض الإطلاق." : "The launch offer has ended.",
          units: ar
            ? { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
            : { days: "days", hours: "hours", minutes: "mins", seconds: "secs" },
        },
        rowHead: ar
          ? ["نوع الحساب", "سنة كاملة", "سنتك الأولى"]
          : ["Account type", "One year", "Your first year"],
        rows: (["freelancer", "studio", "company"] as const).map((type) => ({
          label: names[locale][type],
          was: money(annual(type)),
          now: discountedYear(type),
        })),
        terms: [
          ar
            ? "الخصم للاشتراك السنوي وحده. الاشتراك الشهري يبقى بسعره المعتاد."
            : "The discount is for yearly billing only. Monthly plans stay at their usual price.",
          ar
            ? "السنة هي اثنا عشر شهراً من الخطة الشهرية تُدفع مقدماً، وتتجدّد بعد السنة الأولى بسعرها المعتاد."
            : "A year is twelve months of the monthly plan, paid up front. After the first year it renews at the usual yearly price.",
          ar
            ? "يُطبّق الخصم تلقائياً عند الاشتراك داخل مدة العرض. وتصريح المشروع دفعة واحدة، ولا يشمله الخصم."
            : "The discount is applied automatically when you subscribe inside the window. The Project Pass is a one-time payment and is not discounted.",
        ],
        cta: { label: ar ? "أنشئ حسابك" : "Create your account", href: "/start" },
      },
      {
        kind: "plans",
        id: "plans",
        title: ar ? "اختر نوع حسابك." : "Choose your account type.",
        lead: ar ? "السعر حسب نوع حساب مالك العلامة. كل تصريح أو اشتراك مدفوع يخص علامة واحدة، وليس جميع علامات الحساب." : "The price follows the brand owner's account type. Each paid pass or subscription covers one brand, not every brand in the account.",
        recommendedLabel: ar ? "موصى بها" : "Recommended",
        plans: (["freelancer", "studio", "company"] as const).map((type) => accountPlan(type, locale)),
        note: ar ? "كل الأسعار بالدولار الأمريكي. ادفع شهرياً أو سنة مقدماً؛ ولا توجد رسوم مقاعد إضافية ضمن هذه الخطط." : "All prices are in US dollars. Pay monthly, or pay for a year up front; these plans have no extra-seat charges.",
      },
      /*
       * The three types side by side.
       *
       * Three cards answer "what does this one cost"; they do not answer the
       * question a visitor actually arrives with, which is "why would I pick
       * the $49 one". The table answers it by putting the only two figures
       * that differ on one line each, and by showing that the two rows below
       * them read the same in all three columns — the account type sets the
       * price and nothing else. Every cell is derived from CURRENT_PRICES or
       * is a constant of the per-brand model, so check:pricing keeps it true.
       *
       * The copy deck's full feature comparison is deliberately not this
       * table: see docs/copy/pages_ar_2_platform_pricing.md, "المقارنة
       * الكاملة". It compares plan tiers (المجانية / الاحترافية / الاستوديو /
       * الوكالة) that the live checkout does not sell, over rows — AI credits,
       * seats, storage, version history, SSO — that no shipped surface
       * enforces, and the deck gates it with [CONFIRM: prices are hypotheses
       * until the beta pricing test closes]. It goes in when the real limits
       * exist in billing.py and accountTypes.ts, where check:pricing can hold
       * them to account.
       */
      {
        kind: "table",
        id: "compare",
        title: ar ? "الأنواع الثلاثة، جنباً إلى جنب." : "The three account types, side by side.",
        lead: ar
          ? "نوع الحساب يحدد السعر. وما تحصل عليه مقابل كل دفعة واحد في الحالات الثلاث: علامة واحدة."
          : "Account type sets the price. What each payment buys is the same in all three: one brand.",
        numeric: true,
        head: [
          ar ? "حسب نوع الحساب" : "By account type",
          ...(["freelancer", "studio", "company"] as const).map((type) => names[locale][type]),
        ],
        rows: [
          [
            ar ? "لمن هو" : "Who it is for",
            ar ? "تعمل وحدك" : "Working on your own",
            ar ? "فريق يصمّم للعملاء" : "A team making brands for clients",
            ar ? "تدير علامة شركتك" : "Running your company's brand",
          ],
          [
            ar ? "تصريح المشروع، لمرة واحدة" : "Project Pass, once",
            ...(["freelancer", "studio", "company"] as const).map((type) => ({
              text: `$${CURRENT_PRICES[type].pass}`,
              strong: true,
            })),
          ],
          [
            ar ? "الاشتراك الشهري" : "Monthly plan",
            ...(["freelancer", "studio", "company"] as const).map((type) => ({
              text: `$${CURRENT_PRICES[type].subscription}`,
              strong: true,
            })),
          ],
          [
            ar ? "ما تغطيه كل دفعة" : "What each payment covers",
            ...(["freelancer", "studio", "company"] as const).map(() =>
              ar ? "علامة واحدة" : "One brand",
            ),
          ],
          [
            ar ? "الإعداد قبل المشاركة" : "Preparing before you share",
            ...(["freelancer", "studio", "company"] as const).map(() => (ar ? "مجاني" : "Free")),
          ],
        ],
      },
      {
        kind: "prose",
        title: ar ? "أنشئ حسابك أولاً، ثم اختر خطة لعلامتك." : "Create your account, then choose a plan for your brand.",
        body: [
          ar ? "إنشاء الحساب لا يشتري خطة. بعد إعداد علامتك، افتح إعداداتها لاختيار تصريح المشروع أو الاشتراك الشهري. تتحقق المنصة من الدفع قبل تفعيل الخطة." : "Signing up does not purchase a plan. After setting up your brand, open its settings to choose a Project Pass or monthly plan. The platform verifies payment before activating access.",
          ar ? "لا تشمل الخطط الحالية أرصدة شهرية أو حزم أرصدة مدفوعة." : "The current plans do not include monthly credit allowances or paid credit packs.",
        ],
      },
      /*
       * How handoff pays, on the page where money is the question.
       *
       * The deck puts this strip on /pricing (§17, «شريط: كيف يعمل
       * التسليم») and it earns its place: a studio reading the three cards
       * is working out whether its client's plan is a cost to it or a
       * return. Nothing here is a new claim -- the same 20% of the client's
       * first year, as credit, is already live copy on /solutions/studios,
       * /solutions/freelancers, /platform/handoff and the homepage. This
       * page repeats the site rather than extending it.
       *
       * The deck writes the three beats with arrows between them. They are
       * full stops here, as they are everywhere else a deck arrow reached
       * this site.
       */
      {
        kind: "prose",
        id: "handoff",
        title: ar
          ? "الاستوديو يبني. العميل يملك. الاستوديو يكسب."
          : "The studio builds. The client owns. The return keeps coming.",
        body: [
          ar
            ? "يسلّم الاستوديو المركز مجاناً، فيبقى حيّاً على الخطة المجانية للعميل. وحين يرقّي العميل خطته، يحصل الاستوديو على 20% مما يدفعه في سنته الأولى، رصيداً في اشتراكه."
            : "Handoff is free, and the hub stays live on the client's free plan. When the client upgrades, the studio earns 20% of what they pay in their first year, as credit on its own subscription.",
        ],
        links: [
          {
            label: ar ? "التسليم ومكافأة الشريك" : "How handoff works",
            href: "/platform/handoff",
          },
        ],
      },
      /*
       * Billing, with the four lines that are answerable today.
       *
       * The deck's billing block has eight. Four are left out, each for a
       * reason written down rather than guessed at:
       *
       *   - Yearly billing, "save about 20%". There is no annual rate in
       *     the checkout, and check:pricing asserts `plans.billing ===
       *     undefined` precisely so this page cannot advertise one.
       *   - Refunds. The deck's own cell is [PLACEHOLDER: refund policy,
       *     to be decided].
       *   - Invoices, and the tax and VAT lines on them. The deck marks
       *     those [CONFIRM], and the Arabic master, which leads, has no
       *     invoice line at all.
       *   - Prorated upgrades. True of Stripe by default, but nothing in
       *     this repository says it is switched on.
       *
       * The Mada sentence is not a [CONFIRM] in the Arabic master -- it is
       * an answer in its own FAQ -- and it is the one line here a Gulf
       * reader most needs before reaching for a card.
       */
      {
        kind: "terms",
        id: "billing",
        title: ar ? "الفوترة." : "Billing.",
        lead: ar
          ? "كل ما يخص الدفع، في أربعة أسطر."
          : "Everything about paying, in four lines.",
        cols: 2,
        items: [
          {
            term: ar ? "العملة" : "Currency",
            body: ar ? "الدولار الأمريكي." : "US dollars.",
          },
          {
            term: ar ? "الدفع" : "Payment",
            body: ar
              ? "بالبطاقة عبر Stripe. لا نرى رقم بطاقتك ولا نحفظه. والبطاقات التي تعمل على شبكة مدى فقط غير مدعومة حالياً."
              : "By card, through Stripe. We never see or store your card number. Cards that run on the Mada network only are not supported yet.",
          },
          {
            term: ar ? "الاشتراك" : "Subscription",
            body: ar
              ? "شهري، يتجدد تلقائياً، وتلغيه متى شئت من إعدادات العلامة."
              : "Monthly, renews automatically, and you cancel it whenever you like from the brand's settings.",
          },
          {
            term: ar ? "الإلغاء" : "Cancelling",
            body: ar
              ? "لا يُحذف شيء. تبقى علامتك ودليلها كما أعددتهما، ويتوقف عرض الدليل للزوار حتى تعود."
              : "Nothing is deleted. Your brand and its guideline stay as you prepared them, and the published guideline stops being served until you come back.",
          },
        ],
      },
      {
        kind: "faq",
        id: "faq",
        /* The deck's own heading for this section. These answer what a
           price means, not only how a card is charged. */
        title: ar ? "أسئلة عن الأسعار." : "Pricing questions.",
        items: [
          { q: ar ? "ما الفرق بين التصريح والاشتراك؟" : "How do the pass and subscription differ?", a: ar ? "تصريح المشروع دفعة واحدة لفتح رابط العميل لدليل علامة واحدة. الاشتراك خطة شهرية لدليل تلك العلامة، ويمكن إدارته من إعداداتها." : "A Project Pass is a one-time payment to open the client link for one guideline. A subscription is a monthly plan for that brand's guideline, managed from its settings." },
          { q: ar ? "هل يغطي الاشتراك كل علاماتي؟" : "Does a subscription cover all my brands?", a: ar ? "لا. كل عملية شراء تخص علامة واحدة. يحدد نوع الحساب عدد العلامات والمحررين المسموح بهم، وليس مستوى الاشتراك." : "No. Each purchase covers one brand. Account type determines the brand and editor limits; it is separate from the paid plan." },
          { q: ar ? "هل نشر الدليل متاح مجاناً؟" : "Can I publish a guideline for free?", a: ar ? "يمكنك إعداد الدليل قبل الدفع. عرض الدليل المنشور يتطلب تصريحاً مدفوعاً تم التحقق منه أو اشتراكاً نشطاً لتلك العلامة." : "You can prepare the guideline before paying. Serving the published guideline requires a verified paid pass or active subscription for that brand." },
          { q: ar ? "كيف أدفع؟" : "How do I pay?", a: ar ? "من إعدادات العلامة عبر Stripe، بالدولار الأمريكي. تعرض صفحة الدفع الخطة والسعر قبل تأكيد الشراء." : "From the brand's settings through Stripe, in US dollars. Checkout shows the plan and price before you confirm the purchase." },
          /* The studio's question, from the deck's FAQ. It is the one a
             studio asks before agreeing to hand a brand over at all. */
          { q: ar ? "ماذا يحدث لمركز عميلي إن لم يدفع؟" : "What happens to my client's hub if they don't pay?", a: ar ? "يبقى قابلاً للتعديل على الخطة المجانية، ولا يُحذف منه شيء. وعرض الدليل لزوار العميل هو ما يحتاج تصريحاً أو اشتراكاً لتلك العلامة." : "It stays editable on the free plan and nothing in it is deleted. Serving the guideline to their visitors is the part that needs a pass or a subscription for that brand." },
        ],
      },
      /*
       * The closing ask.
       *
       * The page had none: it ended on the last FAQ answer, on the one page
       * of this site a reader reaches having decided to spend money. The
       * deck closes it on «ابدأ مجاناً اليوم.» and the two doors, which are
       * the same two doors as the homepage hero and the sign-up fork, word
       * for word.
       *
       * The enterprise route is the deck's own closing line, as a link
       * rather than a plan: §17 ends «تحتاج أكثر من ذلك؟» and sends the
       * reader to the team. It names no price, because the deck's $299
       * floor sits inside the same [CONFIRM] as the rest of its tiers.
       */
      {
        kind: "cta",
        title: ar ? "ابدأ مجاناً اليوم." : "Start free today.",
        lead: ar
          ? "تحتاج أكثر مما تراه هنا؟ تواصل معنا، ونبني خطة على مقاس حجمك."
          : "Need more than you see here? Talk to us, and we will build a plan around your size.",
        buttons: [
          { label: ar ? "أصمّم هويات لعملائي" : "I make brands for clients", href: "/start?type=studio" },
          { label: ar ? "أدير علامة شركتي" : "I run my company's brand", href: "/start?type=company" },
        ],
        links: [{ label: ar ? "تواصل معنا" : "Talk to us", href: "/contact?topic=sales" }],
      },
    ],
  };
}

/**
 * The launch offer, for the announcement bar on every page.
 *
 * Returns null when no offer is running, which is what makes the bar absent
 * rather than empty. The same two instants as the block on /pricing, from
 * the same constant, so the bar and the page cannot disagree about when the
 * window closes.
 */
export function currentLaunchOffer(locale: Locale): OfferBarCopy | null {
  const ar = locale === "ar";
  return {
    label: ar
      ? `عرض الإطلاق: خصم ${LAUNCH_OFFER.percent}% على سنتك الأولى بالاشتراك السنوي`
      : `Launch offer: ${LAUNCH_OFFER.percent}% off your first year, paid yearly`,
    /* The deck's own short form (§1.1), not a truncation of the line above. */
    short: ar
      ? `خصم ${LAUNCH_OFFER.percent}% على سنتك الأولى`
      : `${LAUNCH_OFFER.percent}% off your first year`,
    opens: LAUNCH_OFFER.opens,
    closes: LAUNCH_OFFER.closes,
    window: ar
      ? "ينتهي العرض في 15 فبراير 2027."
      : "The offer ends on 15 Feb 2027.",
    countdown: {
      before: ar ? "يبدأ بعد" : "Opens in",
      during: ar ? "ينتهي بعد" : "Ends in",
      after: ar ? "انتهى عرض الإطلاق." : "The launch offer has ended.",
      units: ar
        ? { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
        : { days: "days", hours: "hours", minutes: "mins", seconds: "secs" },
    },
    link: { label: ar ? "اطّلع على العرض" : "See the offer", href: "/pricing#launch-offer" },
    close: ar ? "إغلاق" : "Close",
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
    underBoth: ar ? "ادفع شهرياً أو سنة مقدماً؛ ولا توجد حزم أرصدة مدفوعة ضمن هذه الخطط." : "Pay monthly or a year up front; these plans do not include paid credit packs.",
    link: { label: ar ? "اطّلع على الأسعار" : "See full pricing", href: "/pricing" },
  };
}
