import type { Locale } from "@/lib/i18n/locales";

/*
 * The words inside the product mocks.
 *
 * ── Why they are here and not in the components ───────────────────────────
 *
 * They were English string literals inside `src/components/public/mock/*` and
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
  /** src/components/public/mock/ToneResult.tsx */
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

  /** src/components/public/mock/VoiceMock.tsx */
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

  /** src/components/public/mock/DraftsPanel.tsx */
  drafts: {
    heading: string;
    positioningLabel: string;
    acceptedLabel: string;
    positioningLine: string;
    sources: string;
    personaLabel: string;
    personaLine: string;
    /*
     * The two controls under the draft.
     *
     * They were English string literals in the component, which is the one
     * thing the note at the top of this file exists to stop — and they got
     * away with it for as long as this mock was a 300px card halfway down
     * the English homepage. It is now full width on an Arabic solution
     * page, where "Accept / Dismiss" under four lines of Arabic is the
     * first thing you see.
     */
    accept: string;
    dismiss: string;
  };

  /** src/components/public/mock/LeadershipMock.tsx */
  leadership: {
    question: string;
    /** Four answers. The first two clash; the fourth is already Arabic. */
    answers: { role: string; word: string }[];
    disagreeLabel: string;
    disagreeLine: string;
    unansweredLabel: string;
    unansweredLine: string;
  };

  /** The three product fragments of the studio path section (component deleted 9 Nov 2026; copy kept for its future page). */
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
   * The platform grid's seven cell fragments (component deleted 9 Nov 2026;
   * copy kept for its future page).
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

  /*
   * src/components/public/mock/ProjectBoard.tsx — the studio board.
   *
   * Four of one studio's projects, each at a different stage, which is the
   * whole claim of /solutions/client-projects in one picture: you can see
   * where everything stands without opening anything. The client names are
   * invented and stay as they are in both editions — a Gulf studio's book
   * has Arabic and Latin names in it either way.
   */
  board: {
    heading: string;
    /** The filter chip above the list, showing what is being counted. */
    filter: string;
    /** Column heads: client, stage, who is waiting, when it moved. */
    columns: { client: string; stage: string; waiting: string; moved: string };
    rows: {
      client: string;
      /** Arabic script in the client name, so the row sets its own `lang`. */
      clientAr?: boolean;
      stage: string;
      /** One of the five, which decides the dot's hue. */
      tone: "live" | "review" | "waiting" | "done";
      waiting: string;
      moved: string;
    }[];
  };

  /*
   * src/components/public/mock/HandoffCard.tsx — the moment of handoff.
   *
   * Ownership moves to the client, the studio keeps the role it agreed, the
   * project's seat comes back, and the reward starts. Four facts that are a
   * paragraph on the page and a receipt in the product.
   */
  handoff: {
    heading: string;
    /** The hub being handed over, and its address. */
    hub: string;
    hubUrl: string;
    /** The ownership row, before and after. */
    ownerLabel: string;
    ownerFrom: string;
    ownerTo: string;
    /** What the studio keeps. */
    rows: { label: string; value: string; good?: boolean }[];
    /** The reward line at the foot, which is the part nobody believes. */
    rewardLabel: string;
    rewardValue: string;
    rewardNote: string;
  };

  /*
   * src/components/public/mock/SeatsPanel.tsx — who is paid for.
   *
   * The company plans charge for editors and not for viewers, which is the
   * one thing about the pricing that sounds too good and so has to be shown
   * rather than claimed. The partner link underneath is the same idea from
   * outside the company.
   */
  seats: {
    heading: string;
    groups: {
      label: string;
      count: string;
      price: string;
      /** The one that costs nothing is marked, not just priced. */
      free?: boolean;
      line: string;
    }[];
    partnerLabel: string;
    partnerValue: string;
    partnerExpiry: string;
  };

  /** components/sections/AiAlongside.tsx — the three article fragments. */
  ai: {
    /**
     * Three directions. The brand word itself is not translated.
     *
     * `tag` is the small label in the corner of the artwork — short,
     * because it shares a row with the brand word inside a 4:5 card whose
     * column is 13.75rem at its narrowest. It used to be set at 9px, which
     * bought the room by breaking §13's 12px floor; it is on the floor now
     * (`--fs-eyebrow`), so the tag has to earn its width instead.
     * "Direction A" / «اتجاه A» fits; a sentence would not.
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

  /*
   * src/components/public/mock/BrandHub.tsx — the hub in the hero.
   *
   * This one was a set of Arabic string literals inside the component,
   * with a comment arguing that it should stay Arabic on the English page:
   * the hub belongs to a fictional Gulf client, and showing it in Arabic
   * told an English-reading studio owner "this is what your client's brand
   * hub looks like, and it is not an afterthought".
   *
   * Site Copy v3, Part A §3, decides otherwise — "Window content: the demo
   * brand's published hub, in English" — and the hero is the first thing an
   * English reader sees. A picture of the product they cannot read is a
   * worse first impression than the point it was making.
   *
   * The brand is the same brand in both editions. Nakhla is a coffee
   * roaster either way; only the script it writes in changes, which is
   * exactly what the product does.
   */
  hub: {
    /** The fictional client. `initial` is the avatar's single glyph. */
    name: string;
    initial: string;
    url: string;
    /** The sidebar, and which item is open. */
    nav: string[];
    activeNav: string;
    breadcrumb: string;
    title: string;
    lead: string;
    /** The four specimen tiles, in the order the reference shows them. */
    captions: { lockup: string; symbol: string; colour: string; type: string };
    /** The type specimen: two letters, and a line set in the brand's face. */
    specimenGlyph: string;
    specimenLine: string;
  };

  /*
   * src/components/public/mock/GuidelinesBuilder.tsx — the second pane in the hero.
   *
   * Pinned to Arabic until 8 Nov 2026, with the same argument the hub
   * carried and the same answer: Part A §3 asks for the English window in
   * English, and the first picture of the product should be one the reader
   * can read.
   *
   * The three template *names* are not here. "Vault", "Docs" and "Studio"
   * are product nouns and stay in Latin in both editions, exactly as they
   * do in the product — a studio picking a template is picking "Docs", not
   * a translation of it.
   */
  builder: {
    name: string;
    initial: string;
    url: string;
    /** The cover's two lines, each its own line in the artwork. */
    coverTitle: [string, string];
    /** The rail's tab strip, and which one is open. */
    tabs: string[];
    activeTab: string;
    railLead: string;
    railNote: string;
    /** One line per template, keyed by the kind it describes. */
    notes: { vault: string; docs: string; studio: string };
    canvasLabel: string;
    assets: string;
    preview: string;
    unpublished: string;
    allGood: string;
    publish: string;
  };

  /*
   * src/components/public/home/Problem.tsx — the two pictures in the problem cards.
   *
   * The queue is the one that mattered: three questions landing on one
   * desk, hard-coded in Arabic, so the English homepage showed an Arabic
   * chat under an English heading. The first question is the card's own
   * copy and comes from the dictionary; these are the two under it.
   *
   * Initials, not names. A name in a picture of a product is a person to
   * invent, and these are three colleagues in a queue, not characters.
   */
  problem: {
    /** The chip on the old logo in the drifting-asset card. */
    oldLogo: string;
    /** Who asked the first question, and how long ago. */
    firstWho: string;
    firstWhen: string;
    /** The two questions under it. */
    queue: { who: string; q: string; when: string }[];
    /*
     * The two locale rows in the "two languages, drifting apart" card.
     *
     * `code` labels the row carrying the card's own line, which is in the
     * page's language. `other` is the row beside it, and it is always the
     * *other* language, because the whole picture is two locales saying
     * different things — one row of each is the evidence.
     *
     * Until 8 Nov 2026 the first row was hard-coded `dir="rtl" lang="ar"`
     * in both editions, so the English page put an English sentence in an
     * Arabic row: the full stop jumped to the front, the `ar-SA` chip was
     * squeezed onto two lines, and the text ran over it.
     */
    drift: {
      code: string;
      other: { code: string; text: string; accent: string };
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
    accept: "Accept",
    dismiss: "Dismiss",
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

  board: {
    heading: "Studio board",
    filter: "Active projects · 4 of 10",
    columns: { client: "Client", stage: "Stage", waiting: "Waiting on", moved: "Moved" },
    rows: [
      { client: "Nakhla Coffee", stage: "Design", tone: "live", waiting: "You", moved: "2d" },
      { client: "مجموعة الواحة", clientAr: true, stage: "Discovery", tone: "waiting", waiting: "Client", moved: "6d" },
      { client: "Harbour Dental", stage: "Guideline", tone: "review", waiting: "Client sign-off", moved: "1d" },
      { client: "Tilal Realty", stage: "Handed over", tone: "done", waiting: "Nobody", moved: "12 Sep" },
    ],
  },

  handoff: {
    heading: "Hand over",
    hub: "Nakhla Coffee",
    hubUrl: "brand.nakhla.sa",
    ownerLabel: "Owner",
    ownerFrom: "Mirkaz Studio",
    ownerTo: "Nakhla Coffee",
    rows: [
      { label: "Your role after handover", value: "Editor" },
      { label: "Active project freed", value: "1 of 3 back on your plan", good: true },
      { label: "Client plan", value: "Company Free" },
    ],
    rewardLabel: "Partner reward",
    rewardValue: "20% back as credit",
    rewardNote: "For 12 months, if they upgrade.",
  },

  seats: {
    heading: "People",
    groups: [
      {
        label: "Editors",
        count: "6 of 10",
        price: "Paid",
        line: "Change the brand: assets, guideline, voice, pages.",
      },
      {
        label: "Viewers",
        count: "248",
        price: "Free",
        free: true,
        line: "Open the hub, download approved files, check their writing.",
      },
    ],
    partnerLabel: "Partner link",
    partnerValue: "Print house · view and download",
    partnerExpiry: "Expires 31 Dec 2026",
  },

  ai: {
    directions: [
      {
        tag: "Direction A",
        title: "Direction A: Heritage",
        note: "Calligraphic warmth. Serif Latin paired with a soft naskh.",
      },
      {
        tag: "Direction B",
        title: "Direction B: Modern",
        note: "Clean geometric sans. Bright blue for delivery and digital.",
      },
      {
        tag: "Direction C",
        title: "Direction C: Bold",
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
  hub: {
    name: "Nakhla",
    initial: "N",
    url: "nakhla.markyos.com",
    nav: ["Overview", "Strategy", "Logo", "Colour", "Type", "Voice"],
    activeNav: "Logo",
    breadcrumb: "Guidelines / Logo",
    title: "The logo system",
    lead: "The primary lockup and the symbol, and the space each one needs.",
    captions: {
      lockup: "Primary lockup · clear space",
      symbol: "The symbol",
      colour: "Colour",
      type: "Type",
    },
    specimenGlyph: "Aa",
    specimenLine: "Coffee, grown slowly.",
  },

  builder: {
    name: "Nakhla",
    initial: "N",
    url: "nakhla.markyos.com/guidelines",
    coverTitle: ["Brand", "guidelines"],
    tabs: ["Layers", "Insert", "Template", "Site"],
    activeTab: "Template",
    railLead: "Guideline editor",
    railNote:
      "The template the client's guideline site is built on. All three read the colours, the logo and the type from the workspace itself.",
    notes: {
      vault: "An editorial archive. Dark ground, numbered chapters.",
      docs: "A technical manual. Light paper, comfortable lines.",
      studio: "A showcase. Big images, text to the side.",
    },
    canvasLabel: "Desktop",
    assets: "Assets",
    preview: "Preview",
    unpublished: "Not published",
    allGood: "Everything checks out",
    publish: "Publish",
  },

  problem: {
    oldLogo: "Old logo",
    firstWho: "S",
    firstWhen: "10m",
    queue: [
      { who: "L", q: "Do we have this in Arabic?", when: "1h" },
      { who: "A", q: "Which font do we use for headings?", when: "2d" },
    ],
    drift: {
      code: "en-GB",
      /*
       * 30 against the English row's 40. The two numbers are the whole
       * picture: the Arabic is not a translation of the English, and it
       * never was — it is a different offer that nobody noticed.
       */
      other: {
        code: "ar-SA",
        text: "تخفيضات الصيف، حتى 30%",
        accent: "30%",
      },
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
    accept: "اعتمد",
    dismiss: "تجاهل",
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

  board: {
    heading: "لوحة الاستوديو",
    filter: "المشاريع النشطة · 4 من 10",
    columns: { client: "العميل", stage: "المرحلة", waiting: "بانتظار", moved: "آخر تحديث" },
    rows: [
      { client: "قهوة نخلة", clientAr: true, stage: "التصميم", tone: "live", waiting: "أنت", moved: "يومان" },
      { client: "مجموعة الواحة", clientAr: true, stage: "الاكتشاف", tone: "waiting", waiting: "العميل", moved: "6 أيام" },
      { client: "Harbour Dental", stage: "الدليل", tone: "review", waiting: "اعتماد العميل", moved: "يوم" },
      { client: "عقارات تلال", clientAr: true, stage: "سُلّم", tone: "done", waiting: "لا أحد", moved: "12 سبتمبر" },
    ],
  },

  handoff: {
    heading: "التسليم",
    hub: "قهوة نخلة",
    hubUrl: "brand.nakhla.sa",
    ownerLabel: "المالك",
    ownerFrom: "استوديو مركز",
    ownerTo: "قهوة نخلة",
    rows: [
      { label: "دورك بعد التسليم", value: "محرّر" },
      { label: "حصة المشروع", value: "عاد 1 من 3 إلى خطتك", good: true },
      { label: "خطة العميل", value: "الشركات، المجانية" },
    ],
    rewardLabel: "مكافأة الشريك",
    rewardValue: "20% رصيداً لك",
    rewardNote: "لمدة 12 شهراً، إن رقّى خطته.",
  },

  seats: {
    heading: "الأشخاص",
    groups: [
      {
        label: "المحرّرون",
        count: "6 من 10",
        price: "مدفوع",
        line: "يغيّرون العلامة: الأصول، والدليل، والصوت، والصفحات.",
      },
      {
        label: "المشاهدون",
        count: "248",
        price: "مجاني",
        free: true,
        line: "يفتحون المركز، وينزّلون الملفات المعتمدة، ويراجعون كتاباتهم.",
      },
    ],
    partnerLabel: "رابط شريك",
    partnerValue: "مطبعة · عرض وتنزيل",
    partnerExpiry: "ينتهي في 31 ديسمبر 2026",
  },

  ai: {
    directions: [
      { tag: "اتجاه A", title: "اتجاه A: تراثي", note: "دفء الخط العربي. لاتيني مذيّل مع نسخ ليّن." },
      { tag: "اتجاه B", title: "اتجاه B: حديث", note: "خط هندسي نظيف. أزرق ساطع للتوصيل والرقمي." },
      { tag: "اتجاه C", title: "اتجاه C: جريء", note: "خط ثقيل على أسود. زعفراني للتغليف واللافتات." },
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
  hub: {
    name: "نخلة",
    initial: "ن",
    url: "nakhla.markyos.com",
    nav: [
      "نظرة عامة",
      "الاستراتيجية",
      "الشعار",
      "الألوان",
      "الخطوط",
      "النبرة",
    ],
    activeNav: "الشعار",
    breadcrumb: "الإرشادات / الشعار",
    title: "نظام الشعار",
    lead: "الشعار الأساسي والأيقونة، والمساحة التي يحتاجها كل منهما.",
    captions: {
      lockup: "الشعار الأساسي · المساحة الآمنة",
      symbol: "الأيقونة",
      colour: "الألوان",
      type: "الخطوط",
    },
    specimenGlyph: "أب",
    specimenLine: "قهوة، تُزرع على مهل.",
  },

  builder: {
    name: "نخلة",
    initial: "ن",
    url: "nakhla.markyos.com/guidelines",
    coverTitle: ["إرشادات", "العلامة"],
    tabs: ["طبقات", "إدراج", "القالب", "الموقع"],
    activeTab: "القالب",
    railLead: "محرر الإرشادات",
    railNote:
      "القالب الذي يُبنى عليه موقع إرشادات العميل. الثلاثة تقرأ الألوان والشعار والخطوط من مساحة العمل نفسها.",
    notes: {
      vault: "أرشيف تحريري. أرضية داكنة، وفصول مرقّمة.",
      docs: "دليل تقني. ورقٌ فاتح، وسطور مريحة.",
      studio: "عرضٌ للعمل. الصور كبيرة، والنص جانباً.",
    },
    canvasLabel: "سطح المكتب",
    assets: "الأصول",
    preview: "معاينة",
    unpublished: "غير منشور",
    allGood: "كل شيء سليم",
    publish: "نشر",
  },

  problem: {
    oldLogo: "الشعار القديم",
    firstWho: "س",
    firstWhen: "10د",
    queue: [
      { who: "ل", q: "هل عندنا هذا بالعربية؟", when: "1س" },
      { who: "ع", q: "أي خط نستخدم للعناوين؟", when: "2ي" },
    ],
    drift: {
      code: "ar-SA",
      other: { code: "en-US", text: "Summer Sale, up to 40%", accent: "40%" },
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
