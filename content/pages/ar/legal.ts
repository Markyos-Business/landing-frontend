import type { PageDoc } from "../types";
import { HOME, LINK } from "./_shared";

/*
 * سياسة الخصوصية · الشروط · ملفات تعريف الارتباط —
 * docs/copy/pages_ar_4_signup_legal.md, pages 32 to 34.
 *
 * ── These are frames. Read this before adding a sentence. ─────────────────
 *
 * The source is explicit: "These are frames, not legal text… The full text
 * must be drafted or reviewed by a lawyer who knows the laws that apply to
 * Markyos: at least the US (Delaware entity), Saudi Arabia's PDPL, the UAE's
 * data protection law, and Malaysia's PDPA, plus GDPR if you accept EU
 * customers. **Don't publish them from this file.**"
 *
 * So each page here is exactly two things and nothing else:
 *
 *   1. The **plain-language summary**, which the source says belongs on the
 *      page. Every line of it is a product fact stated elsewhere on the site
 *      and verifiable in the code — not a legal undertaking.
 *   2. The **section outline** a lawyer will fill, shown as the list of what
 *      the finished document will cover.
 *
 * What is *not* here is any sentence that reads as a term or a policy. A
 * plausible-looking privacy policy is worse than an obviously unfinished one:
 * the unfinished page sends a careful buyer to ask, and the plausible one
 * gets relied on. All three are `noindex` for the same reason.
 *
 * The summary boxes stay when the real text lands — they go above it.
 */

const PENDING =
  "النص القانوني الكامل لهذه الصفحة قيد الإعداد مع محامٍ قبل الإطلاق. ما يظهر أدناه ملخص بلغة بسيطة لكيفية عمل ماركيوس فعلاً، وقائمة بما سيغطيه النص الكامل. وهو لا يُغني عن النص القانوني ولا يحلّ محله.";

/* ── 32 · سياسة الخصوصية ──────────────────────────────────────────────── */

const privacy: PageDoc = {
  path: "/privacy",
  shortTitle: "سياسة الخصوصية",
  title: "سياسة الخصوصية · ماركيوس",
  description: "كيف يتعامل ماركيوس مع بياناتك ومحتوى علامتك، بلغة بسيطة.",
  breadcrumbs: [HOME],
  noindex: true,
  blocks: [
    {
      kind: "hero",
      title: "سياسة الخصوصية",
      lead: PENDING,
    },
    {
      kind: "terms",
      title: "الخلاصة بلغة بسيطة",
      cols: 1,
      items: [
        { term: "نجمع ما نحتاجه لتشغيل حسابك وعلامتك فقط." },
        { term: "ملفاتك ومحتوى علامتك ملكك. لا نبيعها، ولا نستخدمها للإعلانات." },
        {
          term: "النصوص التي تراجعها في مدقّق النبرة لا تُحفظ، إلا إن اخترت حفظها 30 يوماً.",
        },
        {
          term: "لا يُرسل شيء إلى مزوّد الذكاء الاصطناعي إلا حين تشغّل إجراءً ذكياً بنفسك.",
        },
        { term: "تستطيع تنزيل بياناتك أو حذف حسابك متى شئت." },
      ],
      note: "هذا الملخص لا يغني عن النص الكامل.",
    },
    {
      kind: "table",
      title: "ما سيغطيه النص الكامل",
      head: ["#", "القسم"],
      rows: [
        ["1", "من نحن وكيف تتواصل معنا"],
        ["2", "البيانات التي نجمعها"],
        ["3", "لماذا نستخدمها، والأساس القانوني لكل استخدام"],
        ["4", "الذكاء الاصطناعي: ما يُرسل، ومتى، وشروط المزوّد"],
        ["5", "من نشاركها معه، ومعالجو البيانات من الباطن"],
        ["6", "مكان تخزين البيانات ونقلها بين الدول"],
        ["7", "مدة الاحتفاظ بكل نوع من البيانات"],
        ["8", "حقوقك: الوصول، والتصحيح، والحذف، والتصدير، والاعتراض"],
        ["9", "الأمان"],
        ["10", "بيانات الأطفال"],
        ["11", "ملفات تعريف الارتباط"],
        ["12", "التغييرات على هذه السياسة"],
      ],
    },
    {
      kind: "prose",
      body: [
        "حتى يُنشر النص الكامل، صفحة الأمان تشرح بالتفصيل ما نفعله بملفاتك ونصوصك، وكل ما فيها قابل للتحقق.",
      ],
      links: [LINK.security, LINK.terms, LINK.contact],
    },
  ],
};

/* ── 33 · الشروط ──────────────────────────────────────────────────────── */

const terms: PageDoc = {
  path: "/terms",
  shortTitle: "الشروط",
  title: "شروط الاستخدام · ماركيوس",
  description: "ملكية المحتوى، والتسليم، والخطط والفوترة، بلغة بسيطة.",
  breadcrumbs: [HOME],
  noindex: true,
  blocks: [
    {
      kind: "hero",
      title: "شروط الاستخدام",
      lead: PENDING,
    },
    {
      kind: "terms",
      title: "الخلاصة بلغة بسيطة",
      cols: 1,
      items: [
        { term: "علامتك وملفاتك ملكك، ونحن نستضيفها لتعمل عليها." },
        { term: "حين يسلّم الاستوديو مركزاً لعميله، تنتقل ملكيته إلى العميل." },
        { term: "مسودات الذكاء الاصطناعي اقتراحات، والقرار والمسؤولية عمّا تنشره لك." },
        { term: "ارفع ما تملك حق استخدامه فقط، وخاصة الخطوط والصور." },
        { term: "الاشتراكات تتجدد تلقائياً، ويمكنك الإلغاء متى شئت." },
      ],
      note: "هذا الملخص لا يغني عن النص الكامل.",
    },
    {
      kind: "table",
      title: "ما سيغطيه النص الكامل",
      head: ["#", "القسم"],
      rows: [
        ["1", "القبول والأهلية"],
        ["2", "الحسابات ومساحات العمل"],
        ["3", "ملكية المحتوى"],
        ["4", "التسليم ونقل الملكية"],
        ["5", "الذكاء الاصطناعي: المسودات والمسؤولية"],
        ["6", "الاستخدام المقبول"],
        ["7", "الخطوط والصور وحقوق الطرف الثالث"],
        ["8", "الخطط والفوترة والرصيد"],
        ["9", "مكافأة الشريك"],
        ["10", "الترقية والتخفيض والإلغاء"],
        ["11", "الاسترداد"],
        ["12", "التوفر والدعم"],
        ["13", "إنهاء الخدمة وتصدير البيانات"],
        ["14", "حدود المسؤولية والضمانات"],
        ["15", "القانون الحاكم وحل النزاعات"],
        ["16", "التغييرات على الشروط"],
      ],
    },
    { kind: "prose", body: [], links: [LINK.privacy, LINK.security, LINK.contact] },
  ],
};

/* ── 34 · ملفات تعريف الارتباط ────────────────────────────────────────── */

const cookies: PageDoc = {
  path: "/cookies",
  shortTitle: "ملفات تعريف الارتباط",
  title: "ملفات تعريف الارتباط · ماركيوس",
  description: "ما نستخدمه من ملفات تعريف الارتباط، وما يحتاج موافقتك.",
  breadcrumbs: [HOME],
  noindex: true,
  blocks: [
    {
      kind: "hero",
      title: "ملفات تعريف الارتباط",
      lead: PENDING,
    },
    {
      kind: "prose",
      body: [
        "نستخدم ملفات تعريف الارتباط لتسجيل دخولك، وتذكّر لغتك، ومعرفة الطريق الذي اخترته (استوديو أو شركة)، وفهم كيف يُستخدم الموقع. والملفات غير الضرورية لا تعمل إلا بموافقتك.",
      ],
      align: "start",
    },
    {
      kind: "table",
      title: "الفئات",
      head: ["الفئة", "مثال", "تحتاج موافقة؟"],
      rows: [
        ["ضرورية", "تسجيل الدخول، والأمان، والدفع", "لا"],
        ["التفضيلات", "اللغة، والطريق المختار في الموقع", "يُحدَّد قبل الإطلاق"],
        ["التحليلات", "فهم كيف تُستخدم الصفحات", "نعم"],
        ["التسويق", "لا نستخدم شيئاً منها اليوم", "نعم"],
      ],
      // Worth saying plainly, because it is both true and unusual: the site's
      // own analytics are first-party and cookieless (app/api/track/route.ts),
      // which is why there is no banner on it today.
      note: "قياس الزيارات على هذا الموقع يعمل دون ملفات تعريف ارتباط ودون حفظ عنوان IP، ولهذا لا يظهر لك شريط موافقة عليه.",
    },
    { kind: "prose", body: [], links: [LINK.privacy, LINK.terms] },
  ],
};

export const legalPages: PageDoc[] = [privacy, terms, cookies];
