import type { Collection } from "@/lib/content";
import type { Locale } from "@/lib/i18n/locales";

/* ── plurals ──────────────────────────────────────────────────────────────
 *
 * Arabic does not have one plural, it has six categories, and a count of one
 * takes a different word from a count of three — "1 دقائق" is as wrong as
 * "1 minutes" and was on every card in the help centre until a screenshot
 * caught it. `Intl.PluralRules` knows the categories; these map them to each
 * noun's four written forms. Written out rather than templated, because the
 * number itself disappears in the dual and the singular — which is exactly
 * the case a format string gets wrong.
 */
const AR_PLURAL = new Intl.PluralRules("ar");

function arabicMinutes(count: number): string {
  switch (AR_PLURAL.select(count)) {
    case "one":
      return "دقيقة واحدة للقراءة";
    case "two":
      return "دقيقتان للقراءة";
    case "few":
      return `${count} دقائق للقراءة`;
    default:
      return `${count} دقيقة للقراءة`;
  }
}

function arabicArticles(count: number): string {
  switch (AR_PLURAL.select(count)) {
    case "zero":
      return "لا مقالات";
    case "one":
      return "مقال واحد";
    case "two":
      return "مقالان";
    case "few":
      return `${count} مقالات`;
    default:
      return `${count} مقالاً`;
  }
}

/*
 * The URL segment for each collection.
 *
 * Four of the five are their own name. `whatsNew` is not: the route is
 * `/whats-new`, which cannot be a TypeScript key without quoting it
 * everywhere, and a hyphen in an identifier is the kind of thing that
 * silently becomes `/whatsNew` in one link out of twenty. One map, and every
 * link below reads it.
 */
export const PATH: Record<Collection, string> = {
  blog: "blog",
  guides: "guides",
  help: "help",
  compare: "compare",
  whatsNew: "whats-new",
};

export type CollectionCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  empty: string;
  back: string;
  readingTime: (minutes: number) => string;
  /** Said on every piece ticked "Placeholder content" in the panel. */
  provisional: string;
};

export const COLLECTIONS: Record<Collection, Record<Locale, CollectionCopy>> = {
  blog: {
    ar: {
      eyebrow: "الموارد",
      title: "المدونة.",
      lead: "عن العلامات التي تُصنع بعناية، وتعيش بالعربية والإنجليزية.",
      empty: "لا توجد مقالات بعد. الأولى قيد الكتابة.",
      back: "المدونة",
      readingTime: arabicMinutes,
      provisional:
        "هذه المقالة محتوى مبدئي، كُتبت لتجربة تصميم الصفحة قبل أن نكتب مقالاتنا الحقيقية. لا تعتمد على تفاصيلها، ولا تشاركها خارج الفريق.",
    },
    en: {
      eyebrow: "Resources",
      title: "Blog.",
      lead: "On brands made carefully, and kept alive in Arabic and English.",
      empty: "No posts yet. The first one is being written.",
      back: "Blog",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This piece is placeholder content, written to try the page design before the real articles are written. Don't rely on it or share it outside the team.",
    },
  },
  guides: {
    ar: {
      eyebrow: "الموارد",
      title: "أدلة وقوالب تستخدمها اليوم.",
      lead: "مجانية، وعملية، وبالعربية والإنجليزية. خذها إلى مشروعك القادم، سواء استخدمت ماركيوس أم لا.",
      empty: "الأدلة قيد الكتابة.",
      back: "الأدلة",
      readingTime: arabicMinutes,
      provisional:
        "هذا الدليل محتوى مبدئي، كُتب لتجربة تصميم الصفحة قبل أن نكتب أدلّتنا الحقيقية. لا تعتمد على تفاصيله، ولا تشاركه خارج الفريق.",
    },
    en: {
      eyebrow: "Resources",
      title: "Guides and templates you can use today.",
      lead: "Free, practical, and in both languages.",
      empty: "The guides are being written.",
      back: "Guides",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This guide is placeholder content, written to try the page design before the real guides are written.",
    },
  },
  compare: {
    ar: {
      eyebrow: "الموارد",
      title: "ماركيوس مقابل غيره.",
      lead: "مقارنات صريحة مع الأدوات التي تستخدمها اليوم، ومتى يكون غيرنا أنسب لك.",
      empty: "المقارنات قيد الكتابة.",
      back: "المقارنات",
      readingTime: arabicMinutes,
      provisional:
        "هذه المقارنة محتوى مبدئي. لا تعتمد على تفاصيلها، ولا تشاركها خارج الفريق.",
    },
    en: {
      eyebrow: "Resources",
      title: "Markyos compared.",
      lead: "Straight comparisons with the tools you use today, including when the other one suits you better.",
      empty: "The comparisons are being written.",
      back: "Comparisons",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This comparison is placeholder content. Don't rely on it or share it outside the team.",
    },
  },
  whatsNew: {
    ar: {
      eyebrow: "الموارد",
      title: "الجديد في ماركيوس.",
      lead: "كل ما أضفناه، بتاريخه، وما يعنيه لك.",
      empty: "لا توجد تحديثات بعد.",
      back: "الجديد",
      readingTime: arabicMinutes,
      provisional:
        "هذا التحديث محتوى مبدئي. لا تعتمد على تفاصيله، ولا تشاركه خارج الفريق.",
    },
    en: {
      eyebrow: "Resources",
      title: "What's new in Markyos.",
      lead: "Everything we have added, dated, and what it means for you.",
      empty: "No updates yet.",
      back: "What's new",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This update is placeholder content. Don't rely on it or share it outside the team.",
    },
  },
  help: {
    ar: {
      eyebrow: "مركز المساعدة",
      title: "كيف نساعدك؟",
      lead: "شروحات خطوة بخطوة لكل ما في ماركيوس: البدء، والمشاريع، والدليل، والتسليم، والنبرة، والحساب والفوترة.",
      empty: "مقالات المساعدة قيد الكتابة.",
      back: "مركز المساعدة",
      readingTime: arabicMinutes,
      provisional:
        "هذا المقال محتوى مبدئي، كُتب لتجربة تصميم الصفحة. قد تختلف الخطوات عن المنتج النهائي.",
    },
    en: {
      eyebrow: "Help centre",
      title: "How can we help?",
      lead: "Step-by-step guidance for everything in Markyos.",
      empty: "The help articles are being written.",
      back: "Help centre",
      readingTime: (m) => `${m} min read`,
      provisional:
        "This article is placeholder content, written to try the page design.",
    },
  },
};

/*
 * The structural words, shared by all three collections.
 *
 * Here and not in `COLLECTIONS` because they say the same thing on every one
 * of them — "latest", "all", "categories", "share". Three copies of each
 * would be three places for them to drift apart.
 */
export const UI: Record<
  Locale,
  {
    latest: string;
    all: string;
    categories: string;
    related: string;
    share: string;
    searchLabel: string;
    searchPlaceholder: string;
    clear: string;
    noMatch: string;
    /** Names the suggestion list under the search field. */
    suggestions: string;
    articles: (n: number) => string;
    date: string;
    category: string;
    reading: string;
    results: (n: number) => string;
  }
> = {
  ar: {
    latest: "أحدث المقالات",
    all: "كل المقالات",
    categories: "التصنيفات",
    related: "اقرأ أيضاً",
    share: "شارك",
    searchLabel: "ابحث في مركز المساعدة",
    searchPlaceholder: "ابحث في مقالات المساعدة…",
    clear: "امسح البحث",
    noMatch: "لا توجد مقالات تطابق بحثك.",
    suggestions: "نتائج مقترحة",
    articles: arabicArticles,
    date: "التاريخ",
    category: "التصنيف",
    reading: "وقت القراءة",
    results: arabicArticles,
  },
  en: {
    latest: "Latest posts",
    all: "All posts",
    categories: "Categories",
    related: "Read next",
    share: "Share",
    searchLabel: "Search the help centre",
    searchPlaceholder: "Search help articles…",
    clear: "Clear search",
    noMatch: "No articles match your search.",
    suggestions: "Suggested results",
    articles: (n) => (n === 1 ? "1 article" : `${n} articles`),
    date: "Date",
    category: "Category",
    reading: "Reading time",
    results: (n) => (n === 1 ? "1 result" : `${n} results`),
  },
};
