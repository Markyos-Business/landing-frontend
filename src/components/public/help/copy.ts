import type { Locale } from "@/lib/i18n/locales";
import { arabicArticles, arabicMinutes } from "../editorial/copy";

/*
 * The Help Center's words, one key per string, named screen.element(.state):
 * `home.search.label`, `category.empty`… Both languages live side by side so
 * a key added in one is a type error until it exists in the other.
 *
 * Wording follows the site's voice rules (MARKYOS-DESIGN-SYSTEM.md §11):
 * sentence case, short, no exclamation marks; the Arabic is written for
 * Arabic readers, not translated word for word. It will be aligned with
 * «دليل نصوص الواجهة» when that guide is shared.
 *
 * Counts are functions over `Intl.PluralRules`, because Arabic has six plural
 * categories and the number itself disappears in the singular and the dual.
 */

type ArticleType = "guide" | "tutorial" | "faq" | "troubleshooting";

const AR_PLURAL = new Intl.PluralRules("ar");

function arabicResults(count: number): string {
  switch (AR_PLURAL.select(count)) {
    case "zero":
      return "لا نتائج";
    case "one":
      return "نتيجة واحدة";
    case "two":
      return "نتيجتان";
    case "few":
      return `${count} نتائج`;
    default:
      return `${count} نتيجة`;
  }
}

const ARTICLE_TYPES: Record<Locale, Record<ArticleType, string>> = {
  en: { guide: "Guide", tutorial: "Tutorial", faq: "FAQ", troubleshooting: "Troubleshooting" },
  ar: { guide: "دليل", tutorial: "شرح خطوة بخطوة", faq: "سؤال شائع", troubleshooting: "حل مشكلة" },
};

const en = {
  meta: {
    title: "Help Center — Markyos",
    description: "Answers and step-by-step guides for everything in Markyos, in Arabic and English.",
  },
  home: {
    hero: {
      eyebrow: "Help Center",
      title: "How can we help?",
      lead: "Answers and step-by-step guides for everything in Markyos.",
    },
    search: {
      label: "Search the Help Center",
      placeholder: "Search for an answer…",
      submit: "Search",
    },
    categories: { title: "Browse by topic" },
    gettingStarted: { title: "Getting started", lead: "New to Markyos? Start here." },
    popular: { title: "Popular articles" },
    recent: { title: "Recently updated" },
    contact: {
      title: "Didn't find what you need?",
      body: "Our team answers in Arabic or English.",
      action: "Contact support",
    },
  },
  category: {
    breadcrumb: "Help Center",
    empty: "No articles in this topic yet.",
    subcategories: "In this topic",
  },
  article: {
    breadcrumb: "Breadcrumb",
    updated: "Updated",
    readingTime: (m: number) => `${m} min read`,
    toc: "On this page",
    anchor: (heading: string) => `Link to “${heading}”`,
    video: (n: number) => `Video ${n}`,
    related: "Related articles",
    pager: "More in this topic",
    previous: "Previous",
    next: "Next",
    notTranslated: {
      eyebrow: "Not in English yet",
      title: "This article isn't available in English yet",
      body: "It's written in Arabic. You can read it there, or go back to the Help Center.",
      read: "اقرأ المقالة بالعربية",
      back: "Help Center",
    },
  },
  search: {
    meta: { title: "Search — Help Center — Markyos", description: "Search the Markyos Help Center." },
    title: "Search the Help Center",
    label: "Search the Help Center",
    placeholder: "Search for an answer…",
    clear: "Clear search",
    results: "Search results",
    status: (n: number, q: string) => (n === 1 ? `1 result for “${q}”` : `${n} results for “${q}”`),
    searching: "Searching…",
    hint: "Type at least two letters.",
    error: "Search isn't available right now. Try again in a moment.",
    filters: { label: "Filter results", topic: "Topic", type: "Type", all: "All" },
    none: (q: string) => `No articles match “${q}”.`,
    suggestions: "Did you mean",
    popular: "Popular articles",
  },
  feedback: {
    question: "Was this article helpful?",
    yes: "Yes",
    no: "No",
    reasonsLabel: "What was wrong with it? (optional)",
    reasons: {
      outdated: "It's out of date",
      unclear: "It's unclear",
      missing_steps: "Steps are missing",
      not_solved: "It didn't solve my problem",
    },
    commentLabel: "Anything else? (optional)",
    commentHint: "Only our team reads this.",
    send: "Send",
    skip: "Skip",
    sending: "Sending…",
    thanksYes: "Thanks. Glad it helped.",
    thanksNo: "Thanks. We'll use this to improve the article.",
    change: "Change answer",
    already: "You've already answered for this article.",
    error: "Couldn't send your answer. Try again.",
    honeypot: "Leave this field empty",
  },
  count: {
    articles: (n: number) => (n === 1 ? "1 article" : `${n} articles`),
  },
  articleType: ARTICLE_TYPES.en,
};

type HelpCopy = typeof en;

const ar: HelpCopy = {
  meta: {
    title: "مركز المساعدة — ماركيوس",
    description: "إجابات وشروحات خطوة بخطوة لكل ما في ماركيوس، بالعربية والإنجليزية.",
  },
  home: {
    hero: {
      eyebrow: "مركز المساعدة",
      title: "كيف نساعدك؟",
      lead: "إجابات وشروحات خطوة بخطوة لكل ما في ماركيوس.",
    },
    search: {
      label: "ابحث في مركز المساعدة",
      placeholder: "ابحث عن إجابة…",
      submit: "ابحث",
    },
    categories: { title: "تصفّح حسب الموضوع" },
    gettingStarted: { title: "البدء", lead: "جديد على ماركيوس؟ ابدأ من هنا." },
    popular: { title: "الأكثر قراءة" },
    recent: { title: "حُدّثت مؤخراً" },
    contact: {
      title: "لم تجد ما تبحث عنه؟",
      body: "فريقنا يجيبك بالعربية أو الإنجليزية.",
      action: "تواصل مع الدعم",
    },
  },
  category: {
    breadcrumb: "مركز المساعدة",
    empty: "لا مقالات في هذا الموضوع بعد.",
    subcategories: "ضمن هذا الموضوع",
  },
  article: {
    breadcrumb: "مسار التنقل",
    updated: "آخر تحديث",
    readingTime: arabicMinutes,
    toc: "في هذه الصفحة",
    anchor: (heading: string) => `رابط إلى «${heading}»`,
    video: (n: number) => `فيديو ${n}`,
    related: "مقالات ذات صلة",
    pager: "المزيد في هذا الموضوع",
    previous: "السابق",
    next: "التالي",
    notTranslated: {
      eyebrow: "غير متاحة بالعربية",
      title: "هذه المقالة غير متاحة بالعربية بعد",
      body: "كُتبت بالإنجليزية. يمكنك قراءتها بالإنجليزية أو العودة إلى مركز المساعدة.",
      read: "Read the article in English",
      back: "مركز المساعدة",
    },
  },
  search: {
    meta: { title: "البحث — مركز المساعدة — ماركيوس", description: "ابحث في مركز مساعدة ماركيوس." },
    title: "ابحث في مركز المساعدة",
    label: "ابحث في مركز المساعدة",
    placeholder: "ابحث عن إجابة…",
    clear: "امسح البحث",
    results: "نتائج البحث",
    status: (n: number, q: string) => `${arabicResults(n)} لـ«${q}»`,
    searching: "جارٍ البحث…",
    hint: "اكتب حرفين على الأقل.",
    error: "البحث غير متاح الآن. حاول بعد قليل.",
    filters: { label: "تصفية النتائج", topic: "الموضوع", type: "النوع", all: "الكل" },
    none: (q: string) => `لا توجد مقالات تطابق «${q}».`,
    suggestions: "ربما تقصد",
    popular: "الأكثر قراءة",
  },
  feedback: {
    question: "هل كانت هذه المقالة مفيدة؟",
    yes: "نعم",
    no: "لا",
    reasonsLabel: "ما الذي لم يكن مفيداً؟ (اختياري)",
    reasons: {
      outdated: "معلوماتها قديمة",
      unclear: "غير واضحة",
      missing_steps: "تنقصها خطوات",
      not_solved: "لم تحلّ مشكلتي",
    },
    commentLabel: "هل من ملاحظة أخرى؟ (اختياري)",
    commentHint: "يقرؤها فريقنا فقط.",
    send: "أرسل",
    skip: "تخطَّ",
    sending: "جارٍ الإرسال…",
    thanksYes: "شكراً لك. يسعدنا أنها أفادتك.",
    thanksNo: "شكراً لك. سنستفيد من رأيك لتحسين المقالة.",
    change: "غيّر إجابتك",
    already: "أجبت عن هذه المقالة من قبل.",
    error: "تعذّر إرسال إجابتك. حاول مرة أخرى.",
    honeypot: "اترك هذا الحقل فارغاً",
  },
  count: {
    articles: arabicArticles,
  },
  articleType: ARTICLE_TYPES.ar,
};

export const HELP_COPY: Record<Locale, HelpCopy> = { en, ar };
export type { HelpCopy };
