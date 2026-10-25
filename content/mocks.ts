import type { Locale } from "@/lib/i18n/locales";

/*
 * The words inside the product mocks.
 *
 * ── Why they are here and not in the components ───────────────────────────
 *
 * They were English string literals inside `components/mock/*` and
 * `components/sections/StudioPath.tsx`, which meant that on the Arabic
 * homepage four of the five pictures of the product were blocks of
 * left-aligned English. A page whose central claim is «بُنيت بالعربية. لا
 * تُرجمت إليها» cannot show an Arabic customer reply being checked by an
 * English interface.
 *
 * `content/types.ts` already says why a word on the page does not live in a
 * component: "a word on the page in an English string literal is a word that
 * never gets translated". These are words on the page.
 *
 * ── Both editions are complete ────────────────────────────────────────────
 *
 * `AR` was null for a long time, which meant every locale got `EN` and the
 * Arabic homepage showed its product pictures in English. It is filled now,
 * and the type is `MockCopy` rather than `MockCopy | null` deliberately: the
 * switch is all-or-nothing, because a mock with English headings over Arabic
 * rows is worse than either edition on its own. TypeScript names any field a
 * new mock forgets.
 *
 * One move switches the whole picture — the strings, the direction of the
 * product's own page, and its `lang`.
 *
 * Transcreate, do not translate. These are product-interface strings, so the
 * register is the product's, not the marketing page's: short, plain, Modern
 * Standard Arabic, no exclamation marks (MARKYOS-DESIGN-SYSTEM.md §11). And
 * where the platform app already ships an Arabic label for the same thing,
 * use its word — see the note above `AR`.
 *
 * ── What does NOT belong here ─────────────────────────────────────────────
 *
 * Content being *shown* inside the product stays as it is. The dialect slip
 * in the tone checker's sample reply is Egyptian on purpose — it is the
 * mistake the product is catching — and `voice.termAr` is the approved
 * Arabic for a term whose English is `voice.termEn`. Both are the example,
 * not the interface.
 */

export type MockCopy = {
  /** components/mock/ToneResult.tsx */
  tone: {
    /** The pasted item's label. */
    title: string;
    /** The channel chip above the sample. */
    channel: string;
    /** The verdict beside the score. */
    verdict: string;
    /** "out of 100". */
    outOf: string;
    traits: { name: string; why: string }[];
    flagLabel: string;
    flagLine: string;
  };

  /** components/mock/VoiceMock.tsx */
  voice: {
    traitsHeading: string;
    /** In order. The first three are on, the last two off. */
    traits: string[];
    channels: { channel: string; register: string }[];
    termHeading: string;
    /** The term being standardised, and the approved Arabic for it. */
    termEn: string;
    termAr: string;
    approved: string;
  };

  /** components/mock/DraftsPanel.tsx */
  drafts: {
    heading: string;
    positioningLabel: string;
    acceptedLabel: string;
    positioningLine: string;
    sources: string;
    personaLabel: string;
    personaLine: string;
  };

  /** components/mock/LeadershipMock.tsx */
  leadership: {
    question: string;
    /** Four answers. The first two clash; the fourth is already Arabic. */
    answers: { role: string; word: string }[];
    disagreeLabel: string;
    disagreeLine: string;
    unansweredLabel: string;
    unansweredLine: string;
  };

  /** The three product fragments in components/sections/StudioPath.tsx */
  studio: {
    findings: { label: string; line: string }[];
    zip: {
      summary: string;
      /** Logo roles found in the archive. */
      roles: string[];
      /** The two scripts the archive covers. */
      scripts: string[];
      confirm: string;
    };
  };

  /*
   * components/sections/PlatformGrid.tsx — the seven cell fragments.
   *
   * These are interface labels in a picture of the product, so the Arabic is
   * the *product's* Arabic, taken from the platform app's own `arLabel`
   * fields (`components/workspace/Sidebar.tsx` and friends next door) rather
   * than invented here. A mock that labels the same screen differently from
   * the screen is a mock that will drift.
   */
  platform: {
    discovery: {
      title: string;
      live: string;
      answered: string;
      answeredValue: string;
      language: string;
      languageValue: string;
      account: string;
      accountValue: string;
    };
    /** The asset tree. `count` only where the real tree shows one. */
    assets: { label: string; count?: string }[];
    guidelines: { path: string; caption: string };
    handoff: {
      heading: string;
      rows: { name: string; role: string; initial?: string }[];
    };
    viewers: { perViewer: string };
    rights: { licence: string; expires: string; from: string; to: string };
    health: { heading: string; stats: { label: string; value: string }[] };
  };

  /** components/sections/AiAlongside.tsx — the three article fragments. */
  ai: {
    /**
     * Three directions. The brand word itself is not translated.
     *
     * `tag` is the small label in the corner of the artwork — short,
     * because it sits at 9px inside a 4:5 card.
     */
    directions: { tag: string; title: string; note: string }[];
    brief: {
      group: string;
      stakeholders: { name: string; count: string }[];
      invite: string;
      columns: { answer: string; lang: string; signal: string };
      /*
       * The answers are *content* — what four people actually typed — so the
       * two that are Arabic stay Arabic in both editions, and the English
       * ones become Arabic on the Arabic page because an Arabic-speaking
       * leadership team would have typed Arabic.
       */
      answers: { text: string; lang: string; signal: string; ar: boolean }[];
    };
    tone: {
      channel: string;
      checks: { label: string; state: string }[];
    };
  };
};

const EN: MockCopy = {
  tone: {
    title: "Customer service reply",
    channel: "Channel: Customer service · Gulf",
    verdict: "Close",
    outOf: "out of 100",
    traits: [
      { name: "Warm", why: "Friendly opening and a real apology." },
      { name: "Clear", why: "Tells the customer when the order arrives." },
      { name: "Confident", why: "“Very sorry” twice in one reply reads as unsure." },
    ],
    flagLabel: "Flag",
    flagLine: "Register: Egyptian dialect on a Gulf channel.",
  },

  voice: {
    traitsHeading: "Voice traits",
    traits: ["Warm", "Clear", "Confident", "Cute", "Corporate"],
    channels: [
      { channel: "Website", register: "Modern Standard · UK English" },
      { channel: "Social", register: "Gulf · mixing allowed" },
      { channel: "Customer service", register: "Gulf" },
    ],
    termHeading: "Term base",
    termEn: "Loyalty card",
    termAr: "بطاقة الولاء",
    approved: "Approved",
  },

  drafts: {
    heading: "Drafts · from the brief analysis",
    positioningLabel: "Positioning",
    acceptedLabel: "Accepted · moved to Strategy",
    positioningLine: "Specialty coffee for slow mornings, priced for every day.",
    sources: "Sources: Brief, question 7 · Call notes, 12 October",
    personaLabel: "Persona · The early commuter",
    personaLine: "Buys on the way in, wants it fast, notices when the cup looks cheap.",
  },

  leadership: {
    question: "“In one word, our brand is…”",
    answers: [
      { role: "CEO", word: "Premium" },
      { role: "Sales", word: "Affordable" },
      { role: "Marketing", word: "Warm" },
      { role: "خدمة العملاء", word: "ودود" },
    ],
    disagreeLabel: "Disagree",
    disagreeLine: "CEO and Sales see a different price position.",
    unansweredLabel: "Unanswered",
    unansweredLine: "Who is the brand not for?",
  },

  studio: {
    findings: [
      {
        label: "Contradiction",
        line: "Wants to feel premium. Asked for the lowest price point in the area.",
      },
      { label: "Still to ask", line: "Who signs off on the Arabic name?" },
      {
        label: "Route 2 of 3",
        line: "The neighbourhood ritual: small, local, on first-name terms.",
      },
    ],
    zip: {
      summary: "We found 6 logo files, 2 font families and 9 colours",
      roles: ["Primary", "Icon", "Mono", "Reversed"],
      scripts: ["Arabic", "Latin"],
      confirm: "Confirm",
    },
  },

  platform: {
    discovery: {
      title: "Discovery brief",
      live: "LIVE",
      answered: "Answered",
      answeredValue: "18 / 24",
      language: "Language",
      languageValue: "ar-SA · en-US",
      account: "Client account",
      accountValue: "Not needed",
    },
    assets: [
      { label: "Strategy" },
      { label: "Assets" },
      { label: "Logos", count: "12" },
      { label: "Imagery", count: "48" },
      { label: "Typography", count: "4" },
      { label: "Voice" },
      { label: "Campaigns" },
    ],
    guidelines: {
      path: "/logo",
      caption: "Look 1 of 8 · 16 sections",
    },
    handoff: {
      heading: "Ownership",
      rows: [
        { name: "Studio Qamar", role: "Built", initial: "S" },
        { name: "Nakhla Coffee", role: "Owner", initial: "N" },
        { name: "Marketing", role: "5 editors" },
        { name: "Everyone else", role: "Viewers" },
      ],
    },
    viewers: { perViewer: "per viewer" },
    rights: {
      licence: "Photo licence · GCC",
      expires: "Expires in 12 days",
      from: "01 Jan 2026",
      to: "05 Nov 2026",
    },
    health: {
      heading: "Brand health",
      stats: [
        { label: "Checked today", value: "84" },
        { label: "On brand", value: "86%" },
        { label: "Terms fixed", value: "341" },
        { label: "Needs Arabic", value: "12" },
      ],
    },
  },

  ai: {
    directions: [
      {
        tag: "Direction A",
        title: "Direction A — Heritage",
        note: "Calligraphic warmth. Serif Latin paired with a soft naskh.",
      },
      {
        tag: "Direction B",
        title: "Direction B — Modern",
        note: "Clean geometric sans. Bright blue for delivery and digital.",
      },
      {
        tag: "Direction C",
        title: "Direction C — Bold",
        note: "Heavy type on black. Saffron for packaging and signage.",
      },
    ],
    brief: {
      group: "Discovery",
      stakeholders: [
        { name: "CEO", count: "24" },
        { name: "Sales", count: "24" },
        { name: "Marketing", count: "22" },
        { name: "Customer service", count: "18" },
      ],
      invite: "Invite…",
      columns: { answer: "Answer", lang: "Lang", signal: "Signal" },
      answers: [
        { text: "We are the coffee you bring to your family", lang: "en-US", signal: "Warmth · matches CEO", ar: false },
        { text: "قهوة سعودية بطابع عصري", lang: "ar-SA", signal: "Heritage + modern", ar: true },
        { text: "Premium, but not intimidating", lang: "en-US", signal: "Conflicts with Sales", ar: false },
        { text: "نريد أن نكون أول اختيار في الصباح", lang: "ar-SA", signal: "Ritual", ar: true },
        { text: "Fast, friendly, always the same quality", lang: "en-US", signal: "Consistency", ar: false },
        { text: "Local roots, regional ambition", lang: "en-US", signal: "Growth", ar: false },
      ],
    },
    tone: {
      channel: "Instagram · Saudi Arabia · Gulf Arabic",
      checks: [
        { label: "Voice: warm and direct", state: "Matches" },
        { label: "Dialect: Gulf Arabic", state: "Matches" },
        { label: "Key term: «قهوة نخلة»", state: "Fix" },
        { label: "Punctuation: one exclamation mark", state: "Fix" },
      ],
    },
  },
};

/*
 * The Arabic product interface.
 *
 * ── Where these words come from ───────────────────────────────────────────
 *
 * Not from a translator, and not invented here. Every interface label the
 * platform app already ships in Arabic is taken from it verbatim — the
 * `label` / `arLabel` pairs in `../markyosmvp/components/workspace/*`. So
 * "Discovery brief" is «موجز التعريف» here because that is what it says on
 * the real screen; "Strategy" is «الاستراتيجية», "Approved" is «معتمد»,
 * "Typography" is «الخطوط», "Primary" is «أساسي».
 *
 * That rule matters more than it looks. These are pictures of the product,
 * and a picture that labels a screen differently from the screen is a picture
 * that will drift the first time either one changes. Where the platform has
 * no Arabic for something, the register here follows its: short, plain
 * Modern Standard Arabic, no exclamation marks (MARKYOS-DESIGN-SYSTEM.md
 * §11).
 *
 * ── What stays as it is ───────────────────────────────────────────────────
 *
 * Content being *shown* inside the product, rather than the interface around
 * it. `voice.termEn` is the English term being standardised and has to stay
 * English or the row stops meaning anything. The tone checker's sample reply
 * keeps its Egyptian slip, because that slip is the mistake being caught.
 * Locale codes (`ar-SA`, `en-US`), the client's web address, and the brand
 * word "Nakhla" in the exploration cards are not interface strings either.
 *
 * The leadership answers and the brief answers are the opposite case: they
 * are what four people typed, and an Arabic-speaking leadership team types
 * Arabic. On the Arabic page all of them are Arabic; the English page keeps
 * the mix, because a bilingual team is what that page is describing.
 */
const AR: MockCopy = {
  tone: {
    title: "ردّ خدمة العملاء",
    channel: "القناة: خدمة العملاء · خليجي",
    verdict: "قريب",
    outOf: "من 100",
    traits: [
      { name: "دافئ", why: "افتتاحية ودّية واعتذار حقيقي." },
      { name: "واضح", why: "يخبر العميل متى يصل طلبه." },
      { name: "واثق", why: "«آسف جداً» مرتين في ردّ واحد تبدو مترددة." },
    ],
    flagLabel: "تنبيه",
    flagLine: "المستوى اللغوي: لهجة مصرية على قناة خليجية.",
  },

  voice: {
    traitsHeading: "سمات الصوت",
    traits: ["دافئ", "واضح", "واثق", "لطيف", "رسمي"],
    channels: [
      { channel: "الموقع", register: "فصحى معاصرة · إنجليزية بريطانية" },
      { channel: "التواصل الاجتماعي", register: "خليجي · يُسمح بالمزج" },
      { channel: "خدمة العملاء", register: "خليجي" },
    ],
    termHeading: "قاعدة المصطلحات",
    // The English term is the thing being standardised. It stays English.
    termEn: "Loyalty card",
    termAr: "بطاقة الولاء",
    approved: "معتمد",
  },

  drafts: {
    heading: "المسودات · من تحليل الموجز",
    positioningLabel: "التموضع",
    acceptedLabel: "مقبولة · نُقلت إلى الاستراتيجية",
    positioningLine: "قهوة مختصّة لصباحات هادئة، بسعر يومي.",
    sources: "المصادر: الموجز، السؤال 7 · ملاحظات المكالمة، 12 أكتوبر",
    personaLabel: "شخصية · المتنقّل الباكر",
    personaLine: "يشتري في طريقه، يريدها سريعة، ويلاحظ حين يبدو الكوب رخيصاً.",
  },

  leadership: {
    question: "«علامتنا في كلمة واحدة…»",
    answers: [
      { role: "الرئيس التنفيذي", word: "فاخرة" },
      { role: "المبيعات", word: "في المتناول" },
      { role: "التسويق", word: "دافئة" },
      { role: "خدمة العملاء", word: "ودود" },
    ],
    disagreeLabel: "اختلاف",
    disagreeLine: "الرئيس التنفيذي والمبيعات يريان تموضعاً سعرياً مختلفاً.",
    unansweredLabel: "بلا إجابة",
    unansweredLine: "لمن ليست هذه العلامة؟",
  },

  studio: {
    findings: [
      { label: "تناقض", line: "يريدها فاخرة. وطلب أقل سعر في المنطقة." },
      { label: "يبقى أن نسأل", line: "من يعتمد الاسم العربي؟" },
      { label: "المسار 2 من 3", line: "طقس الحيّ: صغير، محليّ، بأسماء أولى." },
    ],
    zip: {
      summary: "وجدنا 6 ملفات شعار، وعائلتَي خط، و9 ألوان",
      roles: ["أساسي", "أيقونة", "أحادي", "معكوس"],
      scripts: ["عربي", "لاتيني"],
      confirm: "تأكيد",
    },
  },

  platform: {
    discovery: {
      title: "موجز التعريف",
      live: "مباشر",
      answered: "تمت الإجابة",
      answeredValue: "18 / 24",
      language: "اللغة",
      languageValue: "ar-SA · en-US",
      account: "حساب العميل",
      accountValue: "غير مطلوب",
    },
    assets: [
      { label: "الاستراتيجية" },
      { label: "الأصول" },
      { label: "الشعارات", count: "12" },
      { label: "الصور", count: "48" },
      { label: "الخطوط", count: "4" },
      { label: "الصوت" },
      { label: "الحملات" },
    ],
    guidelines: {
      // A published URL path is technical, and stays as it is published.
      path: "/logo",
      caption: "المظهر 1 من 8 · 16 قسماً",
    },
    handoff: {
      heading: "الملكية",
      rows: [
        { name: "استوديو قمر", role: "نفّذ", initial: "ق" },
        { name: "قهوة نخلة", role: "المالك", initial: "ن" },
        { name: "التسويق", role: "5 محررين" },
        { name: "الجميع", role: "مشاهدون" },
      ],
    },
    viewers: { perViewer: "لكل مشاهد" },
    rights: {
      licence: "رخصة صور · الخليج",
      expires: "تنتهي خلال 12 يوماً",
      from: "01 يناير 2026",
      to: "05 نوفمبر 2026",
    },
    health: {
      heading: "صحة العلامة",
      stats: [
        { label: "فُحص اليوم", value: "84" },
        { label: "مطابق", value: "86%" },
        { label: "مصطلحات صُحّحت", value: "341" },
        { label: "ينقصه العربية", value: "12" },
      ],
    },
  },

  ai: {
    directions: [
      { tag: "اتجاه A", title: "اتجاه A — تراثي", note: "دفء الخط العربي. لاتيني مذيّل مع نسخ ليّن." },
      { tag: "اتجاه B", title: "اتجاه B — حديث", note: "خط هندسي نظيف. أزرق ساطع للتوصيل والرقمي." },
      { tag: "اتجاه C", title: "اتجاه C — جريء", note: "خط ثقيل على أسود. زعفراني للتغليف واللافتات." },
    ],
    brief: {
      group: "الاستكشاف",
      stakeholders: [
        { name: "الرئيس التنفيذي", count: "24" },
        { name: "المبيعات", count: "24" },
        { name: "التسويق", count: "22" },
        { name: "خدمة العملاء", count: "18" },
      ],
      invite: "دعوة…",
      columns: { answer: "الإجابة", lang: "اللغة", signal: "الإشارة" },
      answers: [
        {
          text: "نحن القهوة التي تحملها إلى أهلك",
          lang: "ar-SA",
          signal: "دفء · يوافق الرئيس التنفيذي",
          ar: true,
        },
        { text: "قهوة سعودية بطابع عصري", lang: "ar-SA", signal: "تراث وحداثة", ar: true },
        {
          text: "فاخرة، لكن غير متعالية",
          lang: "ar-SA",
          signal: "يتعارض مع المبيعات",
          ar: true,
        },
        {
          text: "نريد أن نكون أول اختيار في الصباح",
          lang: "ar-SA",
          signal: "طقس يومي",
          ar: true,
        },
        {
          text: "سريعة، ودودة، بالجودة نفسها دائماً",
          lang: "ar-SA",
          signal: "اتساق",
          ar: true,
        },
        { text: "جذور محلية، وطموح إقليمي", lang: "ar-SA", signal: "نمو", ar: true },
      ],
    },
    tone: {
      channel: "إنستغرام · السعودية · خليجي",
      checks: [
        { label: "الصوت: دافئ ومباشر", state: "مطابق" },
        { label: "اللهجة: خليجية", state: "مطابق" },
        { label: "مصطلح أساسي: «قهوة نخلة»", state: "صحّح" },
        { label: "الترقيم: علامة تعجب واحدة", state: "صحّح" },
      ],
    },
  },
};

export type MockStrings = {
  t: MockCopy;
  /*
   * The direction of the *product's own page*, not of this website.
   *
   * The window around it never mirrors: a browser's chrome stays where the
   * operating system puts it whatever is loaded inside (MARKYOS-DESIGN-SYSTEM
   * §9). So a mock sets `dir="ltr"` on its frame and this on the viewport
   * inside it — which is exactly what BrandHub has always done, and what the
   * other four did not.
   */
  dir: "rtl" | "ltr";
  lang: "ar" | "en";
};

export function mockCopy(locale: Locale): MockStrings {
  const arabic = locale === "ar";
  return {
    t: arabic ? AR : EN,
    dir: arabic ? "rtl" : "ltr",
    lang: arabic ? "ar" : "en",
  };
}
