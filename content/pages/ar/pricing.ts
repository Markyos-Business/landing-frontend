import { currentPricingPage } from "../../current-pricing.ts";
import type { PageDoc } from "../types";
import { CTA, HOME, LINK } from "./_shared";

/** Prices and copy reflect the current per-brand checkout, shared with the homepage. */

const pricing = currentPricingPage("ar");

const roadmap: PageDoc = {
  path: "/roadmap",
  shortTitle: "خريطة الطريق",
  title: "خريطة الطريق · ماركيوس",
  description:
    "ما بنيناه، وما نبنيه الآن، وما يأتي بعد ذلك في ماركيوس خلال 2027.",
  breadcrumbs: [HOME],
  priority: 0.7,
  blocks: [
    {
      kind: "hero",
      title: "ما بنيناه. وما نبنيه.",
      lead: "ما نبنيه نكتبه دون مواعيد، لأننا نفضّل أن نَصدقك على أن نَعِدك.",
    },
    {
      kind: "terms",
      eyebrow: "متاح الآن · الإطلاق، فبراير 2027",
      title: "ما يعمل اليوم.",
      cols: 1,
      items: [
        {
          term: "للاستوديوهات",
          body: "استبيانات الاكتشاف باللغتين · التحليل الذكي، والأول مجاني · مركز الاستراتيجية · لوحة الإلهام واستخراج الألوان · استلام ملفات الهوية · البناء التلقائي لموقع الدليل بـ 8 تصاميم · التسليم ومكافأة الشريك · لوحة الاستوديو.",
        },
        {
          term: "للشركات",
          body: "مركز العلامة · صوت العلامة وقاموس المصطلحات · مدقّق النبرة بالعربية والإنجليزية · استبيان القيادة وتقرير التوافق · المشاهدون بلا حدود · روابط الشركاء · دعوة الاستوديو.",
        },
        {
          term: "للجميع",
          body: "واجهة عربية وإنجليزية كاملة · نطاقات خاصة وحماية بكلمة مرور · «اسأل علامتك» · موصّل الذكاء الاصطناعي · المساعد الاستراتيجي · نصوص أقسام الدليل · صانع الموك اب · خطط مجانية.",
        },
      ],
    },
      /*
       * Two columns, not four seasons.
       *
       * Copy deck v4.1 Part D Page 2 replaced the season ladder with "what
       * is live at launch" and "what is coming soon", and dropped every
       * date from the second one. Two things forced it.
       *
       * The first is that the seasons had become a list of promises with
       * quarters attached, which is the one thing src/lib/status.ts exists
       * to keep off this site: a chip that names a quarter is wrong for the
       * whole site the moment one release slips. The roadmap was the last
       * page still naming them.
       *
       * The second is that a third of the entries no longer exist. v4.1
       * removed the live board, campaigns, email signatures, Word and PDF
       * checks, Figma sync, templates, sub-brands, webhooks, the API and
       * the Agency and Business plans from the product, so the ladder was
       * promising nine things nobody is building.
       *
       * The dates have not gone into hiding: each feature's `shipsIn` in
       * status.ts still carries its release for our own reference. They are
       * simply not said to a visitor as a commitment.
       */
    {
      kind: "cards",
      title: "ما يأتي بعده.",
      cols: 2,
      items: [
        {
          title: "قريباً",
          body: "لوحات الإلهام · التوجيه الفني من عقل العلامة · أدلّة الأقسام · إضافة Chrome · تحويل دليل PDF قديم إلى مركز حيّ · لوحة صحة العلامة · من نزّل ماذا من روابط الشركاء · المراجعات والموافقات · مراجعة التصاميم · خطة المؤسسات.",
          note: "لا تواريخ هنا. كل ميزة تصل حين تصبح حقيقية، وتظهر في «ما الجديد» يوم وصولها.",
        },
      ],
    },
    {
      kind: "terms",
      title: "ما لن نبنيه",
      cols: 2,
      items: [
        {
          term: "نظام مبيعات (CRM)",
          body: "أدواتك الحالية تقوم بذلك أفضل منا، وسنتصل بها.",
        },
        { term: "أداة تصميم", body: "صمّم حيث تحب." },
        { term: "شعارات بالذكاء الاصطناعي", body: "علامتك تستحق مصمماً." },
        {
          term: "أداة استبيانات عامة",
          body: "نبني أسئلة العلامات فقط، ونتقنها.",
        },
      ],
    },
    {
      kind: "callout",
      title: "كيف نقرر",
      body: [
        "ما يستخدمه عملاؤنا فعلاً يغيّر هذا الترتيب. إن كانت هناك ميزة تحتاجها، أخبرنا.",
      ],
      cta: CTA.suggestFeature,
    },
    {
      kind: "cta",
      title: "قل لنا ما الذي ينقصك.",
      buttons: [CTA.startFree],
      links: [LINK.whatsNew],
    },
  ],
};

/* ── 19 · ما الجديد ────────────────────────────────────────────────────── */

const whatsNew: PageDoc = {
  path: "/whats-new",
  shortTitle: "ما الجديد",
  title: "ما الجديد في ماركيوس",
  description: "كل ما أضفناه إلى ماركيوس، بالترتيب، مع شرح قصير لكل تحديث.",
  breadcrumbs: [HOME],
  priority: 0.6,
  blocks: [
    {
      kind: "hero",
      title: "ما الجديد.",
      lead: "كل تحديث، بسطر يقول ما تغيّر ولماذا يهمّك.",
    },
    {
      kind: "cards",
      cols: 2,
      items: [
        {
          title: "ماركيوس متاح للجميع.",
          body: "بعد شهرين من البرنامج التجريبي، أصبح ماركيوس مفتوحاً للجميع. الاستوديوهات تستطيع الآن إدارة مشروع كامل، من الاستبيان والتحليل الذكي حتى بناء موقع الدليل وتسليمه. والشركات تستطيع بناء مركز علامتها، وتجهيز صوتها باللغتين، ومراجعة محتواها بمدقّق النبرة. وكل ذلك يبدأ مجاناً.",
          note: "15 فبراير 2027 · جديد · للجميع",
          cta: CTA.startFree,
        },
      ],
      // The source's launch entry carries [PLACEHOLDER: X] studios and
      // [PLACEHOLDER: X] companies. Those two numbers are omitted rather than
      // guessed: a beta cohort size is a verifiable claim and this page is
      // the one place a reader checks whether we say true things.
      note: "هذه الصفحة تُحدَّث مع كل إصدار. والسجل الكامل يبدأ من يوم الإطلاق.",
    },
    {
      kind: "table",
      title: "كيف نكتب كل تحديث",
      head: ["الجزء", "الإرشاد"],
      rows: [
        ["التاريخ", "يوم وشهر وسنة"],
        ["الوسم", "جديد · تحسين · إصلاح"],
        ["لمن", "الاستوديوهات · الشركات · الجميع"],
        [
          "العنوان",
          "ما يستطيع المستخدم فعله الآن، بفعل: «سلّم مركزك بنطاقك الخاص» لا «دعم النطاقات»",
        ],
        ["سطران", "ما الذي تغيّر، ولماذا يهمّ"],
      ],
    },
    {
      kind: "cta",
      title: "اقرأ الجديد. ثم جرّبه بنفسك.",
      buttons: [CTA.startFree],
      links: [LINK.roadmap],
    },
  ],
};

export const pricingPages: PageDoc[] = [pricing, roadmap, whatsNew];
