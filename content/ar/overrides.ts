import type { DeepPartial, SiteCopy } from "../types";

/*
 * Arabic copy — the primary edition.
 *
 * Transcribed from docs/copy/markyos_landing_page_copy_ar.md, which is not a
 * translation of the English document: it is the homepage written in Arabic,
 * with the same argument and the same section numbers, transcreated rather
 * than translated. Arabic is the language the site is published in — see
 * lib/i18n/locales.ts, where it is the default locale and therefore the one
 * served from the root.
 *
 * ── Why this file is still "overrides" ────────────────────────────────────
 *
 * Because the merge direction has not changed: content/ar/index.ts layers
 * this over the English in content/en/index.ts, so any key not written here
 * falls back rather than rendering blank. That mattered when most of the page
 * was still English; it now covers the whole homepage, and what it buys is a
 * build that cannot produce an empty section if a key is ever added to the
 * contract and only filled in one language.
 *
 * `npm run check:locales` prints what is still English. Run it after touching
 * the copy contract.
 *
 * Two rules for editing:
 *
 *   - **Transcreate, do not translate.** §0.2 of the source sets the
 *     register: Modern Standard Arabic, contemporary and conversational, with
 *     short sentences and the same rhythm as the English. Western digits.
 *     «» for quotation marks. PDF, Figma, Stripe and file names stay in Latin
 *     script, because that is how Arabic-speaking designers write them.
 *   - **Arabic is never an afterthought.** A line that reads as translated
 *     undermines the one claim the whole product rests on, on the page making
 *     that claim.
 *
 * Open [CONFIRM]s from the source, all in docs/BEFORE-PUBLISH.md: the Arabic
 * spelling of the brand name and of the founder's name, "no card needed" on
 * the free plans, and every price.
 */

export const overrides: DeepPartial<SiteCopy> = {
  // §7 of the Arabic source document, which specifies these four separately
  // from the English — the share title is the hero headline, not the page
  // title, because a link preview is read on its own.
  meta: {
    title: "ماركيوس · منصة واحدة للعلامة التجارية، بالعربية والإنجليزية",
    description:
      "استبيان الاكتشاف، والاستراتيجية، ولوحات الإلهام، والأصول، وموقع دليل الهوية، وذكاء يعرف علامتك، في منصة واحدة. ابدأ مجاناً.",
    ogTitle: "علامتك كلها في مكان واحد. من أول سؤال، إلى آخر منشور.",
    ogDescription:
      "منظومة واحدة تغنيك عن سبع أدوات، لمن يصنع العلامات ولمن يديرها.",
  },

  // §0.4. Resolved per locale from lib/status.ts, so a feature that ships
  // stops being chipped in both languages on the same day.
  chips: {
    comingSoon: "قريباً",
    arrivingSoon: "يصل قريباً",
  },

  /*
   * The header, in full.
   *
   * Transcribed from markyos_solutions_menu.md §2.2, which supplies the
   * Solutions menu in Arabic as the primary version rather than as a
   * translation of §2.3. The whole `items` array is given because deepMerge
   * replaces arrays rather than merging them element-wise — a translated menu
   * is a different menu, not four patches (see lib/i18n/merge.ts).
   *
   * The Resources labels come from the Arabic copy document's footer table,
   * which is where those four already had approved Arabic.
   */
  nav: {
    items: [
      {
        label: "الحلول",
        href: "/solutions",
        // الشريط الجانبي. سطر معتمد من §11 حرفياً — وهو يسمّي الأعمدة الثلاثة
        // تحته بالترتيب: الاستوديوهات تبني، والتسليم يسلّم، والشركات تُبقي
        // العلامة حيّة. «كل الحلول» هو نص التذييل نفسه، لا تسمية جديدة.
        intro: {
          title: "ابنِ الهوية. سلّمها. وأبقِها حيّة.",
          more: { label: "كل الحلول", href: "/solutions" },
        },
        groups: [
          {
            heading: "للاستوديوهات والوكالات",
            line: "أدِر كل مشاريع عملائك وفريقك من مكان واحد.",
            items: [
              {
                title: "كل مشروع في مكان واحد",
                line: "من أول استبيان حتى التسليم، وكل مشاريعك في لوحة واحدة حسب مرحلتها.",
                href: "/solutions/client-projects",
              },
              {
                title: "استبيان وتحليل ذكي",
                line: "استبيانات باللغتين، وتقرير يكشف تناقضات العميل والأسئلة الناقصة.",
                href: "/solutions/discovery",
              },
              {
                title: "مواقع دليل تبني نفسها",
                line: "اسحب الملفات النهائية، واختر تصميماً، ويُبنى موقع الدليل ببضع نقرات.",
                href: "/solutions/guideline-sites",
              },
              {
                title: "تسليم يعيد لك العائد",
                line: "سلّم عميلك مركزاً حيّاً، واكسب 20% حين يرقّي خطته.",
                href: "/solutions/client-handoff",
              },
            ],
            more: { label: "كل ما يخص الاستوديوهات", href: "/solutions/studios" },
          },
          {
            heading: "للمصممين المستقلين",
            line: "اظهر كفريق كامل، حتى لو كنت تعمل وحدك.",
            items: [
              {
                title: "قراءة استراتيجية لكل عميل",
                line: "تحليل ذكي لإجابات عميلك، والتحليل الأول في كل مشروع مجاني.",
                href: "/solutions/discovery#analysis",
              },
              {
                title: "دليل هوية دون أن تبنيه",
                line: "ملفاتك النهائية تتحول إلى موقع دليل كامل، دون ساعات من التنسيق.",
                href: "/solutions/guideline-sites",
              },
              {
                title: "تسليم يليق بعملك",
                line: "بدلاً من ملف PDF، يتسلّم عميلك مركز علامة حيّاً باسمه.",
                href: "/solutions/client-handoff",
              },
              {
                title: "استبيان يبدو احترافياً",
                line: "أسئلة كتبها استراتيجي، بالعربية والإنجليزية، ودون حساب للعميل.",
                href: "/solutions/discovery#forms",
              },
            ],
            more: { label: "كل ما يخص المستقلين", href: "/solutions/freelancers" },
          },
          {
            heading: "للشركات",
            line: "شركتك كلها على هوية واحدة، باللغتين.",
            items: [
              {
                title: "بيت واحد لعلامتك",
                line: "الأصول ودليل الهوية والاستراتيجية في مركز واحد، محدّث دائماً.",
                href: "/solutions/brand-hub",
              },
              {
                title: "مدقّق النبرة",
                line: "اعرف خلال ثوانٍ إن كان النص يتحدث بصوت علامتك، بالعربية والإنجليزية.",
                href: "/solutions/tone-checker",
              },
              {
                title: "الشركة كلها، مجاناً",
                line: "مشاهدون بلا حدود في الخطط المدفوعة، وروابط آمنة لوكالاتك وشركائك.",
                href: "/solutions/company-rollout",
              },
              {
                title: "صوت واحد باللغتين",
                line: "سمات صوتك، ومستوى العربية لكل قناة، وترجمة معتمدة لكل مصطلح.",
                href: "/solutions/brand-voice",
              },
            ],
            more: { label: "كل ما يخص الشركات", href: "/solutions/companies" },
          },
        ],
        strip: [
          { label: "بُنيت بالعربية، لا تُرجمت إليها.", href: "/platform/arabic" },
          { label: "كيف يعمل التسليم؟", href: "/solutions/client-handoff#how" },
          { label: "محتار؟ ساعدني أختار", href: "/start" },
        ],
      },
      /*
       * «المنصة ▾» — the second mega menu, added at v2.2.
       *
       * Built from §1.6 of the Arabic deck rather than translated from the
       * English menu: the nine module names and their «بديل عن» lines are
       * already transcreated there. The whole `items` array is given because
       * deepMerge replaces arrays rather than merging them element-wise —
       * see lib/i18n/merge.ts.
       */
      {
        label: "المنصة",
        href: "/platform",
        // سطر معتمد من §11 حرفياً. «كل المزايا» انتقل إلى هنا من `strip`:
        // كان الرابط الوحيد هناك الذي يفتح القائمة كلها لا باباً جانبياً،
        // والشريط هو المكان الذي يبحث فيه الزائر عنه. ولا يتكرر تحته.
        intro: {
          title: "علامتك تستحق بيتاً أفضل من ملف PDF.",
          more: { label: "كل المزايا", href: "/platform" },
        },
        // مراحل، لا جمهور، فلا تُعنون القائمة أعمدتها على سطح المكتب —
        // انظر `grouping` في content/types.ts.
        grouping: "stage",
        groups: [
          {
            heading: "اصنع",
            line: "الاكتشاف، والاستراتيجية، والإلهام، والملفات، والدليل.",
            items: [
              {
                title: "استبيان الاكتشاف",
                line: "بديل عن Google Forms وTypeform",
                href: "/platform/discovery-forms",
              },
              {
                title: "مركز الاستراتيجية",
                line: "بديل عن ملفات Word والعروض التقديمية",
                href: "/platform/strategy-hub",
              },
              {
                title: "لوحات الإلهام",
                line: "بديل عن Milanote وPinterest",
                href: "/platform/moodboards",
              },
              {
                title: "مركز الأصول",
                line: "بديل عن Google Drive وDropbox",
                href: "/platform/asset-library",
              },
              {
                title: "موقع دليل الهوية",
                line: "بديل عن دليل PDF وGuidelines.site",
                href: "/platform/guideline-sites",
              },
              {
                title: "لوحة الاستوديو",
                line: "بديل عن جداول المتابعة وTrello",
                href: "/platform/studio-board",
              },
            ],
          },
          {
            heading: "سلّم",
            line: "تنتقل ملكية العلامة كاملة إلى صاحبها.",
            items: [
              {
                title: "التسليم",
                line: "بديل عن الملف المضغوط ورسالة الوداع",
                href: "/platform/handoff",
              },
            ],
          },
          {
            heading: "أدِر",
            line: "الصوت، ومراجعة المحتوى، والموظفون، والشركاء.",
            items: [
              {
                title: "صوت العلامة ومدقّق النبرة",
                line: "بديل عن Grammarly وWriter",
                href: "/platform/brand-voice",
              },
              {
                title: "الشركة كلها",
                line: "بديل عن المجلدات المشتركة ورسائل «أين الشعار؟»",
                href: "/platform/team-and-sharing",
              },
            ],
          },
        ],
        strip: [
          { label: "بُنيت بالعربية، لا تُرجمت إليها.", href: "/platform/arabic" },
          { label: "عقل العلامة", href: "/platform/brand-brain" },
        ],
      },
      { label: "الأسعار", href: "/pricing" },
      {
        label: "الموارد",
        href: "/resources",
        links: [
          { label: "المدونة", href: "/blog" },
          { label: "الأدلة", href: "/guides" },
          { label: "مركز المساعدة", href: "/help" },
          { label: "المقارنات", href: "/compare" },
        ],
      },
    ],
    login: "تسجيل الدخول",
    startFree: "ابدأ مجاناً",
    languageLabel: "لغة الموقع",
    menuLabel: "القائمة",
    skipToContent: "تخطّ إلى المحتوى",
  },

  footer: {
    columns: [
      {
        heading: "المنتج",
        links: [
          { label: "كل المزايا", href: "/platform" },
          { label: "عقل العلامة", href: "/platform/brand-brain" },
          { label: "الأسعار", href: "/pricing" },
          { label: "خريطة الطريق", href: "/roadmap" },
          { label: "ما الجديد", href: "/whats-new" },
        ],
      },
      {
        heading: "لمن",
        links: [
          { label: "الاستوديوهات والوكالات", href: "/solutions/studios" },
          { label: "المصممون المستقلون", href: "/solutions/freelancers" },
          { label: "الشركات", href: "/solutions/companies" },
          { label: "كل الحلول", href: "/solutions" },
        ],
      },
      {
        heading: "الموارد",
        links: [
          { label: "المدونة", href: "/blog" },
          { label: "الأدلة", href: "/guides" },
          { label: "مركز المساعدة", href: "/help" },
          { label: "المقارنات", href: "/compare" },
        ],
      },
      {
        heading: "الشركة",
        links: [
          { label: "من نحن", href: "/about" },
          { label: "تواصل معنا", href: "/contact" },
          { label: "بُنيت بالعربية", href: "/platform/arabic" },
        ],
      },
    ],
    line: "ماركيوس. كل الأصول. كل الإرشادات. بالاتجاهين.",
    legal: [
      { label: "الخصوصية", href: "/privacy" },
      { label: "الشروط", href: "/terms" },
      { label: "الأمان", href: "/security" },
      { label: "ملفات تعريف الارتباط", href: "/cookies" },
    ],
  },

  announcement: {
    live: {
      text: "جديد: ماركيوس متاح الآن. ابدأ مجاناً، استوديو كنت أو شركة.",
      cta: { label: "اكتشف الجديد", href: "/whats-new" },
    },
    beta: {
      text: "البرنامج التجريبي الخاص مفتوح لـ 25 استوديو و15 شركة في الخليج وجنوب شرق آسيا.",
      cta: { label: "قدّم طلبك", href: "/start" },
    },
  },

  home: {
    hero: {
      eyebrow: "منصة العلامات التجارية، بالعربية والإنجليزية",
      /* v3 §2.1. السطران هما الشعار نفسه (§0.2): الاستوديو يبني، والشركة
         تحيي. السجع في «يبنيها / تحييها» هو السجعة الوحيدة في هذا القسم. */
      headline: "الاستوديو يبنيها،",
      headlineAccent: "والشركة تحييها.",
      subheadline:
        "مكانٌ واحد لعلامتك كلها، من أول سؤال إلى آخر منشور. بالعربية والإنجليزية، على قدم المساواة.",
      studioCta: { label: "أصمّم هويات لعملائي", href: "/start?type=studio" },
      companyCta: { label: "أدير علامة شركتي", href: "/start?type=company" },
      microcopy: "ابدأ مجاناً، دون بطاقة.",
      /*
       * نصّا قصة التمرير. العناصر هي قائمة مركز العلامة نفسها وبترتيبها،
       * حتى تكون الأسماء التي تتجمّع داخل النافذة هي الأسماء التي يجدها
       * الزائر فيها.
       */
      scene: {
        elements: ["الشعار", "الألوان", "الخطوط", "النبرة", "لوحة الإلهام", "الاستراتيجية", "الأيقونات"],
        templatesLabel: "ثلاثة قوالب جاهزة لموقع الإرشادات",
      },
      beta: {
        studioCta: { label: "قدّم طلب انضمام استوديوك", href: "/start?type=studio" },
        companyCta: { label: "قدّم طلب انضمام شركتك", href: "/start?type=company" },
        microcopy:
          "25 مكاناً للاستوديوهات و15 للشركات. مجاناً طوال الفترة التجريبية، وسعرك التجريبي ثابت لمدة 12 شهراً.",
      },
    },

    proofStrip: {
      facts: [
        "7 أدوات في منصة واحدة",
        "العربية والإنجليزية من أول سطر",
        "موقع دليل يبني نفسه في دقائق",
        "التحليل الذكي الأول مجاناً",
      ],
    },

    productGlimpse: {
      headline: "علامة واحدة. في كل مكان تحتاج أن تكون فيه.",
      body: [
        "إجابات الاستبيان تتحول إلى استراتيجية. والاستراتيجية مع الملفات النهائية تتحول إلى موقع دليل هوية. والموقع يصبح المركز الذي يفتحه فريق عميلك كل يوم.",
        "لا نسخ ولا لصق في أي خطوة، لذلك لا شيء يتقادم.",
      ],
      flow: [
        { name: "الاستبيان", line: "أسئلة باللغتين، يجيب عنها عميلك دون حساب" },
        { name: "الاستراتيجية", line: "مسودات من التحليل، تقبل منها ما يفيدك" },
        { name: "الدليل", line: "موقع يبني نفسه من ملفات المشروع" },
        { name: "المركز", line: "يفتحه فريق عميلك كل يوم" },
      ],
    },

    problem: {
      eyebrow: "كيف تُبنى العلامة اليوم",
      headline: "العلامات لا تموت، بل تتوه.",
      lead: "كل مشروع علامة يمرّ بالرحلة نفسها، وفي كل محطة أداة مختلفة:",
      stationColumns: { station: "المحطة", tool: "الأداة المعتادة", what: "ما يحدث فعلاً" },
      stations: [
        {
          station: "الاكتشاف",
          tool: "Google Forms أو Typeform",
          what: "تصلك الإجابات في جدول، فتنسخها بيدك إلى ملف آخر",
          icon: "form",
        },
        {
          station: "الإلهام",
          tool: "Milanote أو Pinterest",
          what: "المراجع في مكان، والقرارات التي خرجت منها في مكان آخر",
          icon: "grid",
        },
        {
          station: "الاستراتيجية",
          tool: "Word أو Notion أو عرض تقديمي",
          what: "تُعرض في اجتماع، ثم تُحفظ في مجلد",
          icon: "fileAlt",
        },
        {
          station: "الملفات",
          tool: "Google Drive أو Dropbox",
          what: "«logo_final_2_new.png»، وخمس نسخ من الشعار",
          icon: "folder",
        },
        {
          station: "الدليل",
          tool: "ملف PDF أو Guidelines.site",
          what: "يُبنى من البداية، بعيداً عن الاستبيان والاستراتيجية",
          icon: "filePdf",
        },
        {
          station: "التسليم",
          tool: "ملف مضغوط عبر WeTransfer",
          what: "ينتهي الرابط بعد أيام، وتنتهي العلاقة معه",
          icon: "package",
        },
        {
          station: "الكتابة اليومية",
          tool: "ChatGPT أو Grammarly",
          what: "أدوات ذكية تكتب بثقة، بصوت لا يشبه علامتك",
          icon: "commentDots",
        },
      ],
      body: [
        "كل أداة ممتازة وحدها. لكن العلامة تضيع في المسافات بينها. بعد ستة أشهر، فريق المبيعات يستخدم الشعار القديم، والنسخة العربية تقول ما لم تقله الإنجليزية، وكل سؤال عن العلامة ينتهي على مكتب شخص واحد.",
        "لم يخطئ أحد. كل ما في الأمر أن العلامة لم يكن لها بيت. وهذا ما نسمّيه تآكل العلامة.",
      ],
      cards: [
        {
          headline: "فريق المبيعات يستخدم الشعار القديم.",
          line: "عرض المبيعات · الشريحة 4",
        },
        {
          headline: "النسخة العربية تقول ما لم تقله الإنجليزية.",
          line: "تخفيضات الصيف، حتى 30%",
        },
        {
          headline: "كل سؤال عن العلامة ينتهي على مكتب شخص واحد.",
          line: "أين آخر نسخة من الشعار؟",
        },
      ],
      transition: "المشكلة ليست في الناس. المشكلة أن العلامة بلا بيت.",
    },

    shift: {
      headline: "العلامة التجارية ليست ملفاً. إنها مكان.",
      body: [
        "مكان يكون فيه الشعار هو الصحيح دائماً. تقف فيه الاستراتيجية ونبرة الصوت بجانب الملفات التي تشرحها. تُكتب فيه العربية والإنجليزية معاً، لا واحدة بعد الأخرى. ويجد فيه أي موظف الإجابة دون أن يسأل أحداً.",
        "هذا المكان هو ماركيوس. يبنيه الاستوديو، وتديره الشركة.",
      ],
      cta: { label: "اكتشف كيف يعمل لك", href: "#choose-path" },
    },

    choosePath: {
      headline: "ثلاثة طرق. وعلامة واحدة.",
      youGetLabel: "تبدأ بـ",
      studio: {
        label: "للاستوديوهات",
        who: "الاستراتيجيون والمصممون والوكالات الذين يصنعون علامات لعملائهم",
        headline: "أدِر كل مشاريع عملائك وفريقك من مكان واحد.",
        youGet: "الوحدات 1 إلى 7",
        cta: { label: "أصمّم هويات لعملائي", href: "/start?type=studio" },
      },
      company: {
        label: "للشركات",
        who: "مدراء التسويق ومسؤولو العلامة والمؤسسون الذين يديرون علامتهم بأنفسهم",
        headline: "شركتك كلها على هوية واحدة، باللغتين.",
        youGet: "المركز، ومدقّق النبرة، والمشاهدون",
        cta: { label: "أدير علامة شركتي", href: "/start?type=company" },
      },
      freelancer: {
        label: "المصممون المستقلون",
        who: "مصممون واستراتيجيون يعملون وحدهم",
        headline: "اظهر كفريق كامل، حتى لو كنت تعمل وحدك.",
        youGet: "التحليل الذكي، والدليل، والتسليم",
        cta: { label: "للمستقلين", href: "/solutions/freelancers" },
      },
      closing:
        "يبنيها الاستوديو، وتديرها الشركة. وحين يسلّم الاستوديو العلامة، تنتقل بكل ما فيها، من الاستبيان إلى الصوت، إلى مساحة العميل.",
    },

    studioPath: {
      eyebrow: "للاستوديوهات",
      headline: "من أول سؤال إلى آخر تسليم. في مكان واحد.",
      subheadline:
        "كل خطوة تغذّي التي بعدها. تجاوز أي خطوة لا تحتاجها، أو ابدأ من المنتصف بهوية صمّمتها من قبل.",
      stepLabel: "الخطوة",
      steps: [
        {
          name: "الاكتشاف",
          feature: "question-library",
          headline: "أرسل استبياناً سيُكمله عميلك فعلاً.",
          body: "استبيانات اكتشاف بالعربية والإنجليزية، يجيب عنها عميلك من رابطه الخاص وباللغة التي يختارها، دون أن يُنشئ حساباً. ابدأ من قالب لعلامة جديدة، أو إعادة تصميم، أو علامة فرعية، ثم أضف الأسئلة واحذفها وأعد ترتيبها من مكتبة كتبها استراتيجي علامات تجارية، لا أداة ترجمة. والصق ملاحظات مكالمتك أيضاً، حتى لا يضيع شيء مما قيل في Zoom.",
          smallPrint: "الاستبيانات والإجابات مجانية وبلا حدود في كل الخطط.",
        },
        {
          name: "التحليل",
          feature: "brief-analysis",
          headline: "احصل على قراءة خبير استراتيجي للإجابات. والتحليل الأول مجاني.",
          body: "يقرأ ماركيوس الاستبيان وملاحظات مكالمتك، ويقدّم لك تقريراً منظّماً: الأهداف، والجمهور، والمنافسون، وملامح الشخصية، ثم الأمرين اللذين قد يفوتان مصمماً مبتدئاً: التناقضات في كلام العميل، والأسئلة التي ما زال عليك أن تطرحها. ويختم باتجاهين أو ثلاثة اتجاهات استراتيجية يمكن أن تسلكها العلامة. وكل نتيجة تصلك مسودةً، تقبل منها ما يفيدك، ولا يدخل شيء إلى الاستراتيجية دون موافقتك.",
          smallPrint:
            "تحليل مجاني واحد في كل مشروع، وفي كل الخطط. وإعادة التحليل تُخصم من الرصيد.",
        },
        {
          name: "الاستراتيجية",
          headline: "اكتب الاستراتيجية حيث ستعيش العلامة.",
          body: "الرؤية، والرسالة، والغاية، والتموضع، والشخصيات المستهدفة، وسمات الصوت، والقيم، والمنافسون، باللغتين. اقبل ما يناسبك من مسودات التحليل، واكتب الباقي بنفسك، لتنتقل الاستراتيجية مباشرة إلى موقع دليل الهوية لاحقاً. تعمل على الهوية البصرية فقط؟ تجاوز هذه الخطوة.",
        },
        {
          name: "الاستكشاف",
          headline: "اكتشف الاتجاه مع عميلك، لا نيابةً عنه.",
          body: "اجمع مراجعك على لوحة الإلهام، ويستخرج ماركيوس لوحة الألوان من البكسلات الحقيقية في صورك. جمّعها، واستبعد ما لا يلزم، وأرِ عميلك اتجاهاً يستطيع أن يتفاعل معه.",
          coming: {
            feature: "whiteboard",
            headline: "اللوح التفاعلي المباشر.",
            body: "ارسم الاتجاهات مع فريقك وعميلك في الوقت نفسه وعلى اللوح نفسه، مع شعارك وألوانك وخطوطك المعتمدة كعناصر حيّة. يدخل العميل من رابط، دون حساب. ويحوّل التوجيه الفني الذكي أي لوحة إلى كلمات للمزاج العام، ومنطق لاختيار الألوان، وثنائيات خطوط عربية ولاتينية.",
          },
        },
        {
          name: "التصميم",
          headline: "صمّم كما اعتدت، بالأدوات التي تحبها.",
          body: "ماركيوس ليس أداة تصميم، ولا يريد أن يكون. صمّم الهوية في Figma أو Illustrator أو أي أداة تفضّلها. وكل ما تحتاجه لتصمّم جيداً، من الاستبيان والتحليل إلى الاستراتيجية واللوحات، على بُعد نقرة.",
        },
        {
          name: "استلام الملفات",
          feature: "brand-kit-intake",
          headline: "اسحب الملف المضغوط. والباقي علينا.",
          body: "أفلِت المجلد النهائي، ويفتحه ماركيوس داخل متصفحك: يجد الشعارات ويخمّن أيّها الرئيسي والأيقونة وأحادي اللون والمعكوس، ويجمع الخطوط في عائلات ويتحقق أيّها يدعم العربية، ويستخرج الألوان، ويرتّب الباقي. ثم يعرض عليك شاشة واحدة: «وجدنا 6 ملفات شعار، وعائلتَي خطوط، و9 ألوان»، لتؤكد وتنتقل.",
        },
        {
          name: "البناء",
          feature: "auto-compose",
          headline: "موقع دليل هويتك، جاهز ببضع نقرات.",
          body: "اختر واحداً من 8 تصاميم، ويبني ماركيوس الموقع مما يحتويه المشروع: نظام الشعار مع المساحة الآمنة وأمثلة الاستخدام الخاطئ، وقسم الألوان مع فحص التباين، والخطوط بالعربية واللاتينية، والصور، والاستراتيجية التي اعتمدتها. ستة عشر قسماً تبني نفسها بنفسها متى توفرت بياناتها. ثم عدّل ما تشاء، مع 19 تخطيطاً ومحرّر كامل، على الحاسوب والجهاز اللوحي والجوال.",
        },
        {
          name: "التسليم",
          feature: "handoff",
          headline: "سلّمها تسليماً يليق بقيمتها.",
          body: "ادعُ عميلك، ويصبح المركز ملكه: موقع علامته الخاص، حيّ وقابل للتعديل، وبحسابه هو. وتحتفظ أنت بالدور الذي اتفقتما عليه، ويتوقف احتساب المشروع من خطتك، فتتحرر حصته لعميلك التالي. لا ملف مضغوط. ولا «final_FINAL_v3.pdf». علامة يستطيع عميلك أن يستخدمها فعلاً.",
        },
      ],
      cta: { label: "ابدأ مشروعك الأول مجاناً", href: "/start?type=studio" },
    },

    handoffLoop: {
      feature: "partner-reward",
      headline: "ابنِها مجاناً. سلّمها. واكسب كلما نما عميلك.",
      body: [
        "يمكنك تنفيذ مشروع كامل على الخطة المجانية، من الاستبيان حتى التسليم. وحين يرقّي عميلك خطة مركزه، تحصل على 20% مما يدفعه خلال أول 12 شهراً، رصيداً في خطتك أنت.",
        "خمسة عملاء على خطة «العلامة» يغطّون اشتراكك في الخطة «الاحترافية».",
      ],
      strip: [
        { label: "أنت تبني", line: "العلامة، والاستراتيجية، والمركز" },
        { label: "هم يملكون", line: "مركز علامة حيّاً يحمل اسمهم" },
        { label: "أنت تكسب", line: "20% رصيداً لك طوال سنتهم الأولى" },
      ],
      cta: { label: "أصمّم هويات لعملائي", href: "/start?type=studio" },
    },

    company: {
      eyebrow: "للشركات",
      headline: "شركتك كلها على هوية واحدة. باللغتين.",
      subheadline:
        "يجمع ماركيوس استراتيجيتك وأصولك وصوت علامتك في مركز واحد، ويساعد الجميع على استخدامها كما يجب، فتتوقف عن أن تكون مكتب الاستعلامات الوحيد للعلامة.",
      partLabel: "الجزء",
      parts: [
        {
          name: "ابدأ بطريقتك",
          headline: "ابدأ من حيث تقف علامتك اليوم.",
          table: [
            {
              condition: "ملفات الهوية، وربما ملف PDF قديم",
              action: "استورد. أفلِت الملفات، ويبني ماركيوس المركز منها",
            },
            {
              condition: "شعار وألوان، لكن لا شيء مكتوب",
              action:
                "حدّد. أرسل استبياناً قصيراً لقيادات الشركة، ودع ماركيوس يُريك أين يتفقون وأين يختلفون",
            },
            {
              condition: "لا شيء بعد",
              action: "أحضِر الاستوديو. ادعُ الاستوديو الذي تعمل معه، أو ابدأ مع استوديو جديد",
            },
          ],
        },
        {
          name: "وحّد رؤية القيادة",
          feature: "stakeholder-workshop",
          headline: "اكتشف ما تعتقده قيادتك فعلاً عن علامتك.",
          body: [
            "أرسل أسئلة العلامة نفسها إلى الرئيس التنفيذي، والمبيعات، والتسويق، وخدمة العملاء. يجيب كل شخص وحده، بالعربية أو الإنجليزية. ثم يقارن ماركيوس الإجابات ويُريك أين تتفق القيادة، وأين تختلف («فاخرة» عند الرئيس التنفيذي، و«في متناول الجميع» عند المبيعات)، وأيّ الأسئلة لم يستطع أحد الإجابة عنها.",
            "إنها أنفع صفحة ستحملها إلى اجتماع الإدارة القادم. والتحليل الأول مجاني.",
          ],
        },
        {
          name: "حدّد الصوت مرة واحدة",
          feature: "voice-profile",
          headline: "اكتب كيف تتحدث علامتك، ليتحدث الجميع بصوتها.",
          body: [
            "حدّد من ثلاث إلى خمس سمات لصوت علامتك («نحن كذا / لسنا كذا»)، وأضف أمثلة لمحتوى يمثّلها تماماً، وقرّر كيف يتغيّر الصوت بين وسائل التواصل، والبريد، والموقع، والإعلانات، وخدمة العملاء. واختر مستوى العربية لكل قناة (الفصحى، أو الخليجية، أو المصرية، أو الشامية)، والإنجليزية البريطانية أو الأمريكية، وهل يُسمح بالمزج بين اللغتين.",
            "ثم ابنِ قاموس مصطلحاتك: الكلمات المفضّلة، والكلمات الممنوعة، وأسماء المنتجات، والترجمة المعتمدة لكل منها في الاتجاهين.",
          ],
          coming: {
            feature: "department-playbooks",
            headline: "أدلّة الأقسام.",
            body: "لكل فريق صفحته الخاصة: مع من يتحدث، ورسائله الأساسية باللغتين، ومؤشر يجعل الصوت الرئيسي أدفأ قليلاً للموارد البشرية أو أدقّ قليلاً للمبيعات، دون أن يفقد ملامحه.",
          },
        },
        {
          name: "راجِع قبل أن تنشر",
          headline: "لمدقّق النبرة مساحته الخاصة في القسم التالي.",
        },
        {
          name: "أدخِل الجميع",
          feature: "company-free-plan",
          headline: "المحرّرون يغيّرون العلامة. والبقية يستخدمونها مجاناً.",
          body: [
            "في الخطط المدفوعة، عدد المشاهدين غير محدود ومجاني. تستطيع شركتك كلها فتح المركز، وتنزيل الشعار الصحيح، ومراجعة كتاباتها بنفسها، دون أن تدفع مقابل كل موظف. وشارك الملفات المعتمدة مع وكالتك أو مطبعتك أو صحفي عبر رابط ينتهي في الموعد الذي تحدده.",
          ],
          coming: {
            feature: "ask-the-brand",
            headline: "اسأل علامتك.",
            body: "مساعد جانبي يجيب عن أسئلة مثل «هل أستطيع وضع الشعار على خلفية حمراء؟» أو «ما عبارتنا التعريفية بالعربية؟» من مركزك أنت، مع رابط للصفحة المقصودة بالضبط. وإن لم يجد الإجابة في المركز يخبرك بذلك، ويضيف السؤال إلى قائمة الثغرات التي عليك سدّها.",
          },
        },
      ],
      cta: { label: "جهّز علامتك مجاناً", href: "/start?type=company" },
    },

    toneChecker: {
      feature: "tone-checker",
      eyebrow: "مدقّق النبرة",
      headline: "هل يتحدث هذا النص بصوت علامتك؟ اعرف خلال ثوانٍ. بالعربية والإنجليزية.",
      body: "الصق أي محتوى، واختر القناة، ويراجعه ماركيوس مقابل صوت علامتك أنت، وقواعد قسمك، وقاموس مصطلحاتك. ليس إعداداً عاماً مثل «ودود» أو «رسمي». بل صوتك أنت.",
      outputHeading: "ما تحصل عليه",
      outputs: [
        { term: "درجة من 100", line: "مع وصف بكلمة: مطابق، أو قريب، أو بعيد عن الهوية" },
        { term: "درجة لكل سمة من سمات الصوت", line: "مع السبب في سطر واحد" },
        { term: "جمل مظلّلة", line: "مع القاعدة أو السمة التي تخالفها كل جملة" },
        { term: "مشكلات المصطلحات", line: "كلمة ممنوعة، أو اسم منتج تُرجم خطأً" },
        { term: "اختلاف مستوى العربية", line: "لهجة مصرية في قناة مضبوطة على الخليجية، مثلاً" },
      ],
      extrasHeading: "وأمران آخران",
      extras: [
        { term: "أعِد الصياغة بصوت علامتك", line: "يبقى المعنى، ويُضبط الصوت." },
        {
          term: "ترجِم بصوت علامتك",
          line: "من العربية إلى الإنجليزية وبالعكس، وفق قاموس مصطلحاتك ومستوى اللغة في كل قناة. صياغة جديدة، لا ترجمة حرفية.",
        },
      ],
      privacy:
        "نراجع نصّك، ولا نحتفظ به. نحفظ الدرجة لا الكلمات، إلا إن اخترت أنت حفظ النص (لمدة 30 يوماً).",
      comingHeading: "القادم للمدقّق",
      coming: [
        { feature: "document-checks", label: "مراجعة ملفات Word وPDF كاملة" },
        { feature: "chrome-extension", label: "مراجعة النص أينما تكتب، عبر إضافة Chrome" },
      ],
      cta: { label: "جرّب أول مراجعة مجاناً", href: "/start?type=company" },
      smallPrint: "25 مراجعة سريعة شهرياً في الخطة المجانية، و1000 مراجعة في خطة «العلامة».",
    },

    pillars: {
      headline: "عدّلها مرة، تتغيّر في كل مكان.",
      body: "معظم أدوات العلامات تحتفظ بنُسخ: شعار في الدليل، وآخر في مجلد المبيعات، وثالث في عرض تقديمي. والنُّسخ تتباعد مع الوقت. أما ماركيوس فيحتفظ بنسخة واحدة من كل شيء ويعرضها حيث تلزم، فإذا تغيّر لون، تغيّرت معه كل صفحة تستخدمه.",
      pillars: [
        {
          name: "الأصول",
          headline: "كل ملف في بيت واحد",
          line: "الشعارات والخطوط والألوان والصور والمستندات، والنسخة الصحيحة دائماً في المقدمة.",
        },
        {
          name: "الدليل",
          headline: "القواعد في موقع حقيقي",
          line: "موقع دليل هوية يفتحه الناس فعلاً، مبنيّ من الأصول نفسها لا من نُسخ عنها.",
        },
        {
          name: "الاستراتيجية",
          headline: "الفكرة التي وراء كل شيء",
          line: "صفحات الاستراتيجية والأقسام تشير إلى الأصول والقواعد نفسها، فيقرأ كل فريق العلامة نفسها.",
        },
      ],
    },

    bilingual: {
      eyebrow: "العربية والإنجليزية",
      headline: "من اليمين، ومن اليسار، دائماً في المسار.",
      body: "تعرف هذا الشعور: أداة رائعة بالإنجليزية، ثم تكتب أول سطر بالعربية، فتنقلب الأسهم، وتتكسّر الجمل، ويختفي خطّك العربي خلف خط بديل. معظم أدوات الهوية صُنعت بالإنجليزية، ثم تعلّمت شيئاً من العربية لاحقاً. في ماركيوس، العربية ليست ضيفة. بُنيت المنصة على اللغتين متساويتين من أول سطر برمجي.",
      points: [
        { term: "انعكاس حقيقي", line: "لا محاذاة النص فقط، بل كل تخطيط وقائمة وسهم" },
        {
          term: "كتابتان ونظام واحد",
          line: "الشعارات والخطوط وأحجامها بالعربية واللاتينية جنباً إلى جنب",
        },
        {
          term: "تفهم مستويات العربية",
          line: "الفصحى والخليجية والمصرية والشامية، ولكل قناة إعدادها",
        },
        { term: "مصطلحات ثابتة", line: "ترجمة معتمدة لكل اسم منتج وكل كلمة مهمة" },
      ],
      lineEn: "Every asset. Every instruction. Both directions.",
      lineAr: "كل الأصول. كل الإرشادات. بالاتجاهين.",
      features: [
        { term: "انعكاس حقيقي", line: "لكل تخطيط وقائمة وسهم", icon: "exchange" },
        { term: "شعار عربي ولاتيني", line: "لكل منهما خانته", icon: "copyright" },
        { term: "خطوط بالكتابتين", line: "جنباً إلى جنب", icon: "font" },
        { term: "مستويات العربية", line: "لكل قناة", icon: "comments" },
        { term: "مصطلحات ثابتة", line: "في اللغتين", icon: "book" },
      ],
      link: { label: "كيف بُني ماركيوس بالعربية", href: "/platform/bilingual" },
    },

    aiRules: {
      headline: "الذكاء الاصطناعي يكتب المسودة الأولى. والقرار لك.",
      body: "يستخدم ماركيوس الذكاء الاصطناعي حيث يوفّر عليك وقتاً حقيقياً: قراءة الاستبيان، ومقارنة إجابات القيادات، ومراجعة المحتوى مقابل صوت علامتك. لكنه لا يملك الكلمة الأخيرة أبداً.",
      promises: [
        {
          term: "مسودات، لا قرارات",
          line: "كل ما ينتجه الذكاء الاصطناعي يصلك مسودةً مع مصادرها. ولا يتغير شيء في علامتك حتى يقبله شخص.",
        },
        {
          term: "أعمالك الحقيقية فقط",
          line: "الذكاء الاصطناعي لا يرسم شعارك ولا يخترع حروف علامتك. ملفاتك ملفاتك.",
        },
        {
          term: "كلماتك تبقى لك",
          line: "المحتوى الذي تراجعه لا يُحفظ إلا إن اخترت حفظه.",
        },
        {
          term: "لا فواتير مفاجئة",
          line: "يعمل الذكاء الاصطناعي برصيد تراه أمامك. وإن نفد، يتوقف ويستأذنك. ولا يحاسبك على شيء من وراء ظهرك.",
        },
      ],
    },

    /*
     * v2 §03. The section's own words.
     *
     * Transcreated, not translated — "AI does the first draft. People make
     * the call." is two short sentences whose whole effect is the pivot
     * between them, and a literal Arabic rendering loses the pivot. «الذكاء
     * الاصطناعي يكتب المسودة. والقرار لك.» keeps it: same two beats, same
     * landing on the second.
     */
    ecosystem: {
      headline: "هنا مكانها،",
      headlineAccent: "وفي كل مكانٍ بيانها.",
      body:
        "في ماركيوس، لا تنتقل العلامة من أداة إلى أخرى. تكبر في مكان واحد: إجابات الاستبيان تصبح تحليلاً. والتحليل يصبح مسودات للاستراتيجية. والاستراتيجية تصبح صوتاً تكتب به الشركة. والملفات النهائية تصبح موقع دليل. والموقع يصبح المركز الذي يعيش فيه فريق العميل كل يوم. وكل خطوة من هذه يتعلّمها عقل العلامة، فيعرف علامتك أكثر كلما عملت.",
      tools: [
        { label: "استبيان", tool: "Google Forms", icon: "form" },
        { label: "لوحة", tool: "Milanote", icon: "grid" },
        { label: "مستند", tool: "Word", icon: "fileAlt" },
        { label: "مجلد", tool: "Drive", icon: "folder" },
        { label: "دليل", tool: "PDF", icon: "filePdf" },
        { label: "محادثة", tool: "ChatGPT", icon: "commentDots" },
      ],
      brainLabel: "عقل العلامة",
      stages: [
        {
          name: "اصنع",
          what: "الاكتشاف، والتحليل، والاستراتيجية، والإلهام، والملفات، والدليل",
          who: "الاستوديوهات والمستقلون، أو فريق الشركة نفسه",
          icon: "pencilRuler",
        },
        {
          name: "سلّم",
          what: "تنتقل ملكية العلامة كاملة إلى صاحبها",
          who: "الاستوديو والعميل",
          icon: "key",
        },
        {
          name: "أدِر",
          what: "الصوت، ومراجعة المحتوى، والموظفون، والشركاء",
          who: "الشركات",
          icon: "sync",
        },
      ],
      closing:
        "وفي المنتصف شيئان لا يتغيّران: مصدر واحد للحقيقة، فلكل شعار ولون وقاعدة نسخة واحدة تظهر حيث تلزم، وعقل العلامة الذي يقرأ منها.",
      link: { label: "كل المزايا", href: "/platform" },
    },

    /*
     * §1.7, as rewritten at v2.1 of the Arabic copy deck.
     *
     * The old section led with «ChatGPT يعرف كل شيء عن العالم» and listed the
     * sources the brain reads. That line survives — it is the third paragraph
     * of the body now — but it is no longer the headline, because the deck's
     * stated reason for the rewrite is that buyers ask whether the AI makes
     * the brand better, not what it can generate. The capabilities and the
     * costs moved to /platform/brand-brain.
     */
    aiAlongside: {
      eyebrow: "عقل العلامة",
      headline: "يقرأ",
      headlineAccent: "قبل أن يكتب.",
      body: [
        "كل علامة تتكوّن من أجزاء: ما قاله العميل، والاستراتيجية، والصوت، والاتجاه البصري، والمحتوى الذي يُكتب كل يوم، باللغتين. وفي معظم المشاريع، لا يرى هذه الأجزاء معاً أحد. كل جزء في أداة، وكل أداة عند شخص.",
        "عقل العلامة هو الذكاء الاصطناعي داخل ماركيوس، والمكان الذي تلتقي فيه هذه الأجزاء. يقرأ علامتك أنت، لا معلومات عامة، فيلاحظ ما يفوت الجميع: عميلاً يناقض نفسه، وقيادة لا تتفق، ونصاً يبتعد عن الصوت، ونسخة عربية تقول غير ما تقوله الإنجليزية.",
        "ChatGPT يعرف كل شيء عن العالم. عقل العلامة يعرف علامتك.",
      ],
      effect: {
        headline: "أثره على النتيجة",
        newBrand: "حين تبني علامة جديدة",
        existingBrand: "حين تحسّن علامة قائمة",
        rows: [
          {
            label: "يبدأ من",
            newBrand: "إجابات الاستبيان وملاحظات المكالمة",
            existingBrand:
              "إجابات قياداتك، ومحتواك الحالي، وملفات علامتك",
          },
          {
            label: "يكشف لك",
            newBrand: "التناقضات والأسئلة الناقصة، قبل أن تبدأ التصميم",
            existingBrand:
              "أين تختلف القيادة، وأين ابتعد المحتوى عن الصوت، وفي أي قسم",
          },
          {
            label: "يقترح",
            newBrand:
              "اتجاهات استراتيجية، ومسودات للجمهور والصوت، مبنية على كلام العميل نفسه",
            existingBrand:
              "صياغات تعيد النص إلى صوته، وترجمات تلتزم بالمصطلحات المعتمدة",
          },
          {
            label: "فتخرج بـ",
            newBrand:
              "علامة متسقة من يومها الأول، وكل قرار فيها يعود إلى سبب",
            existingBrand:
              "قائمة واضحة بما يتآكل في علامتك، بدل الشعور بأن «شيئاً ما ليس على ما يرام»",
          },
        ],
      },
      seamsHeadline:
        "يحرس الاتساق في المواضع التي تتباعد فيها العلامات",
      seams: [
        {
          title: "بين ما يقوله العميل وما يقصده",
          line: "التحليل الذكي للاستبيان، والأول مجاني في كل مشروع.",
        },
        {
          title: "بين قياداتك",
          line: "تقرير التوافق، والأول مجاني لكل علامة.",
        },
        {
          title: "بين صوتك وكل نص يُكتب",
          line: "مدقّق النبرة، ومعه إعادة الصياغة بصوت العلامة.",
        },
        {
          title: "بين العربية والإنجليزية",
          line: "قاموس المصطلحات، والترجمة بصوت العلامة.",
        },
        {
          title: "بين الاستراتيجية والاتجاه البصري",
          line: "التوجيه الفني الذكي من لوحات الإلهام.",
          chip: "board-shapes",
        },
        {
          title: "بين دليلك وما يسأل عنه الناس",
          line: "«اسأل علامتك»، وقائمة بما ينقص الدليل.",
          chip: "ask-the-brand",
        },
      ],
      limitsHeadline: "حدود واضحة",
      limits: [
        "يقترح، ولا يقرر. كل ما يكتبه يصلك مسودةً تُظهر مصدرها، ولا يتغيّر شيء في علامتك حتى تقبله. ولا يرسم شعاراً أبداً.",
      ],
      connector: {
        line: "وإن كان فريقك يكتب في ChatGPT أو Claude، فاربطهما بماركيوس عبر موصّل الذكاء الاصطناعي، ليقرآ علامتك الحقيقية قبل أن يكتبا. يقرآن فقط، ولا يغيّران شيئاً.",
        chip: "ai-connector",
      },
      cta: {
        label: "كيف يعمل عقل العلامة",
        href: "/platform/brand-brain",
      },
    },

    /*
     * v2 §04.
     *
     * `headline` is `pillars.headline` word for word — the same approved
     * line, already transcreated, and this section is what it was always
     * claiming. The seven cell names follow the platform app's own Arabic
     * where it has one, so the marketing page and the product call the same
     * thing by the same name.
     */
    platformGrid: {
      headline: "كل ما تحتاجه العلامة. وما يحتويه كل جزء.",
      cta: { label: "تعرّف على المنصة", href: "/platform" },
      subheadline: "كل وحدة تعمل وحدها، وتعمل أفضل مع البقية. ابدأ من أي واحدة.",
      stageLabels: {
        create: "المرحلة الأولى · اصنع",
        handOver: "المرحلة الثانية · سلّم",
        manage: "المرحلة الثالثة · أدِر",
      },
      replacesLabel: "بديل عن:",
      moduleLabel: "الوحدة",
      modules: [
        {
          n: 1,
          stage: "create",
          name: "استبيان الاكتشاف",
          replaces: "Google Forms وTypeform",
          promise: "أسئلة أفضل، وإجابات تتحول إلى عمل.",
          icon: "form",
          feats: [
            {
              name: "قوالب جاهزة",
              line: "علامة جديدة، وإعادة تصميم، وعلامة فرعية، ومشروع تسمية، وإطلاق منتج.",
            },
            {
              name: "مكتبة أسئلة باللغتين",
              line: "كل سؤال كتبه استراتيجي علامات بالعربية والإنجليزية. أضف، واحذف، وأعد الترتيب.",
            },
            {
              name: "أسئلة مبنية للعلامات",
              line: "مقياس لسمات الشخصية، وترتيب حسب الأولوية، واختيار من صور مرجعية، ورفع الشعار الحالي.",
            },
            {
              name: "رابط للعميل دون حساب",
              line: "يجيب بالعربية أو الإنجليزية، والاستبيان يظهر بشعار استوديوك وألوانه.",
            },
            { name: "منطق بسيط", line: "أظهر سؤالاً أو أخفِه حسب إجابة سابقة." },
            {
              name: "ملاحظات المكالمة",
              line: "الصق ملاحظاتك أو نص المحضر من Zoom، لتدخل في التحليل مع الإجابات.",
            },
            { name: "مجاني وبلا حدود", line: "في كل الخطط." },
          ],
          link: { label: "استبيان الاكتشاف والتحليل الذكي", href: "/platform/discovery-forms" },
        },
        {
          n: 2,
          stage: "create",
          name: "مركز الاستراتيجية",
          replaces: "ملفات Word والعروض التقديمية",
          promise: "معظم الاستراتيجيات تعيش في ملف لا يُفتح بعد الاجتماع. هنا تعيش حيث تُستخدم.",
          icon: "layers",
          feats: [
            { name: "أسس العلامة", line: "الرؤية، والرسالة، والغاية، والقيم." },
            { name: "التموضع والمنافسون", line: "أين تقف علامتك، ومن حولها." },
            { name: "الشخصيات المستهدفة", line: "من تخاطب، وماذا يحتاج أن يسمع." },
            {
              name: "سمات الصوت",
              line: "«نحن كذا، لسنا كذا»، وهي أساس مدقّق النبرة لاحقاً.",
            },
            { name: "باللغتين", line: "كل حقل بالعربية والإنجليزية، جنباً إلى جنب." },
            {
              name: "من التحليل بنقرة",
              line: "نتائج التحليل الذكي تصل مسودات، تقبل منها ما يناسبك.",
            },
            {
              name: "تنتقل وحدها",
              line: "الاستراتيجية المعتمدة تظهر في موقع الدليل وفي صوت العلامة دون نسخ.",
            },
            {
              name: "المساعد الاستراتيجي والعصف الذهني",
              line: "يفكّر معك في التموضع والتسمية والعبارات.",
              chip: "strategy-ai",
            },
          ],
          link: { label: "مركز الاستراتيجية", href: "/platform/strategy-hub" },
        },
        {
          n: 3,
          stage: "create",
          name: "لوحات الإلهام",
          replaces: "Milanote وPinterest",
          promise: "مراجعك لا تبقى صوراً. تصبح قرارات.",
          icon: "grid",
          feats: [
            { name: "لوحة مرتّبة", line: "مناطق جاهزة تجمع فيها المراجع حسب نوعها." },
            {
              name: "الألوان من صورك",
              line: "يستخرج ماركيوس لوحة الألوان من البكسلات الحقيقية في صورك، ويقترحها مسودة لهويتك.",
            },
            {
              name: "خاصة حتى تعتمدها",
              line: "مراجع الإلهام لا تظهر في أي صفحة عامة.",
            },
            {
              name: "لوح تفاعلي مباشر",
              line: "أنت وفريقك وعميلك على اللوح نفسه في الوقت نفسه، ويدخل العميل من رابط دون حساب.",
              chip: "whiteboard",
            },
            {
              name: "عناصر العلامة الحيّة",
              line: "شعارك وألوانك وخطوطك المعتمدة كعناصر على اللوح، تتحدّث حين تتغيّر.",
              chip: "board-shapes",
            },
            {
              name: "التوجيه الفني الذكي",
              line: "يقرأ عقل العلامة اللوحة، ويقترح كلمات للمزاج، وألواناً، وثنائيات خطوط عربية ولاتينية.",
              chip: "board-shapes",
            },
          ],
          link: { label: "لوحات الإلهام", href: "/platform/moodboards" },
        },
        {
          n: 4,
          stage: "create",
          name: "مركز الأصول",
          replaces: "Google Drive وDropbox",
          promise: "أفلِت المجلد. والترتيب علينا.",
          icon: "folderOpen",
          feats: [
            {
              name: "استلام الملفات",
              line: "أفلِت مجلداً أو ملفاً مضغوطاً، ويفتحه ماركيوس في متصفحك.",
            },
            {
              name: "تصنيف تلقائي",
              line: "يتعرّف على الشعارات ونوع كل منها، ويجمع الخطوط في عائلات، ويستخرج الألوان.",
            },
            { name: "الخطوط العربية", line: "يتحقق أي الخطوط يدعم العربية فعلاً." },
            {
              name: "تأكيد واحد",
              line: "«وجدنا 6 ملفات شعار، وعائلتَي خطوط، و9 ألوان». تؤكد وتنتقل.",
            },
            {
              name: "نسخة واحدة صحيحة",
              line: "كل ملف في مكانه، والنسخة المعتمدة دائماً في المقدمة.",
            },
            {
              name: "تراخيص الخطوط",
              line: "الخطوط غير المرخّصة للتوزيع تُعرض ولا تُنزَّل.",
            },
          ],
          link: { label: "مركز الأصول", href: "/platform/asset-library" },
        },
        {
          n: 5,
          stage: "create",
          name: "موقع دليل الهوية",
          replaces: "دليل PDF وGuidelines.site",
          promise: "من الملفات النهائية إلى موقع دليل كامل. ببضع نقرات.",
          icon: "book",
          feats: [
            { name: "8 تصاميم جاهزة", line: "اختر واحداً، ويُبنى الموقع مما يحتويه المشروع." },
            {
              name: "16 قسماً تبني نفسها",
              line: "نظام الشعار مع المساحة الآمنة وأمثلة الخطأ، والألوان مع فحص التباين، والخطوط، والصور، والاستراتيجية.",
            },
            {
              name: "محرّر كامل",
              line: "19 تخطيطاً للأقسام، وكتل تضيفها كما تشاء، وتراجع وإعادة.",
            },
            { name: "باللغتين", line: "دليل واحد يقرؤه كل زائر بلغته، لا دليلان." },
            { name: "على كل شاشة", line: "مراجعة على الحاسوب والجهاز اللوحي والجوال." },
            {
              name: "يتحدّث وحده",
              line: "غيّر لوناً في الأصول، فيتغيّر في كل صفحة من الدليل.",
            },
            { name: "نشر آمن", line: "رابط ماركيوس، أو نطاقك الخاص، أو حماية بكلمة مرور." },
          ],
          link: { label: "موقع دليل الهوية", href: "/platform/guideline-sites" },
        },
        {
          n: 6,
          stage: "create",
          name: "لوحة الاستوديو",
          replaces: "جداول المتابعة وTrello",
          promise: "كل عملائك، وكل مراحلهم، في نظرة واحدة.",
          icon: "scan",
          feats: [
            {
              name: "مسار لكل مشروع",
              line: "اكتشاف، وتحليل، واستراتيجية، واستكشاف، وتصميم، واستلام، وبناء، وتسليم. تجاوز ما لا تحتاجه.",
            },
            {
              name: "لوحة حسب المرحلة",
              line: "كل مشاريعك في أعمدة، فتعرف ما يحتاج انتباهك اليوم.",
            },
            { name: "الفريق والأدوار", line: "مالك، ومحرّر، ومشاهد." },
            { name: "العملاء ضيوف", line: "على الاستبيان والمراجعة، دون حساب ودون حدود." },
            {
              name: "أختام الموافقة",
              line: "يعتمد العميل الأقسام الأساسية من الدليل، ويُحفظ كل اعتماد بتاريخه.",
            },
          ],
          link: { label: "لوحة الاستوديو", href: "/platform/studio-board" },
        },
        {
          n: 7,
          stage: "handOver",
          name: "التسليم",
          replaces: "الملف المضغوط ورسالة الوداع",
          promise: "لا ملف مضغوط. ولا «final_FINAL_v3.pdf». علامة يملكها عميلك فعلاً.",
          icon: "key",
          feats: [
            { name: "نقل الملكية", line: "ادعُ عميلك، ويصبح المركز ملكه بحسابه هو." },
            { name: "تبقى بدورك", line: "محرّراً أو مشاهداً، حسب ما اتفقتما." },
            {
              name: "حصتك تتحرر",
              line: "يتوقف احتساب المشروع من خطتك لحظة التسليم.",
            },
            {
              name: "مجاني دائماً",
              line: "التسليم مجاني في كل الخطط، والمركز يبقى حيّاً على الخطة المجانية للعميل.",
            },
            {
              name: "مكافأة الشريك",
              line: "20% مما يدفعه عميلك في سنته الأولى، رصيداً في اشتراكك.",
            },
            {
              name: "سنة العميل مقدّماً",
              line: "ادفع سنته الأولى في خطة «العلامة» بـ 190 دولاراً بدلاً من 228، وأضفها إلى قيمة مشروعك.",
            },
          ],
          link: { label: "التسليم ومكافأة الشريك", href: "/platform/handoff" },
        },
        {
          n: 8,
          stage: "manage",
          name: "صوت العلامة ومدقّق النبرة",
          replaces: "Grammarly وWriter، لكل ما يخص صوت علامتك",
          promise: "هل يتحدث هذا النص بصوت علامتك؟ اعرف خلال ثوانٍ.",
          icon: "penSquare",
          feats: [
            {
              name: "سمات الصوت والأمثلة",
              line: "اكتب كيف تتحدث علامتك مرة واحدة، مع نصوص تمثّلها.",
            },
            {
              name: "مستوى العربية لكل قناة",
              line: "الفصحى أو الخليجية أو المصرية أو الشامية، والإنجليزية البريطانية أو الأمريكية.",
            },
            {
              name: "قاموس المصطلحات",
              line: "المفضّل، والممنوع، وما لا يُترجم، والترجمة المعتمدة لكل كلمة.",
            },
            {
              name: "المراجعة السريعة",
              line: "درجة من 100، وسبب كل ملاحظة، والكلمات الممنوعة، واختلاف مستوى اللغة.",
            },
            {
              name: "المراجعة المعمّقة",
              line: "شرح لكل ملاحظة، واقتراح صياغة لكل جملة.",
            },
            {
              name: "أعِد الصياغة، أو ترجِم، بصوت العلامة",
              line: "من العربية إلى الإنجليزية وبالعكس، وفق قاموسك.",
            },
            { name: "نصّك لا يُحفظ", line: "نحفظ الدرجة، لا الكلمات." },
          ],
          link: { label: "صوت العلامة", href: "/platform/brand-voice" },
          link2: { label: "مدقّق النبرة", href: "/platform/tone-checker" },
        },
        {
          n: 9,
          stage: "manage",
          name: "الشركة كلها",
          replaces: "المجلدات المشتركة، ورسائل «أين الشعار؟»",
          promise: "المحرّرون يغيّرون العلامة. والبقية يستخدمونها مجاناً.",
          icon: "building",
          feats: [
            {
              name: "مشاهدون بلا حدود",
              line: "في الخطط المدفوعة، يدخل كل موظف المركز مجاناً، وينزّل الملف الصحيح، ويراجع كتاباته.",
            },
            {
              name: "وحّد رؤية القيادة",
              line: "استبيان واحد لقياداتك، وتقرير يُريك أين يتفقون وأين يختلفون. التقرير الأول مجاني.",
            },
            {
              name: "روابط الشركاء",
              line: "شارك الملفات المعتمدة مع وكالتك أو مطبعتك عبر رابط ينتهي في موعد تحدده.",
            },
            {
              name: "ادعُ الاستوديو",
              line: "يعمل الاستوديو داخل علامتك، دون أن يُحتسب من محرّريك.",
            },
            {
              name: "أدلّة الأقسام وتوقيعات البريد",
              line: "صوت ورسائل لكل قسم، وتوقيع باللغتين لكل موظف.",
              chip: "department-playbooks",
            },
            {
              name: "القوالب، والمراجعات، وصحة العلامة",
              line: "منشورات وعروض بأصولك الحقيقية، وموافقات قبل النشر، ولوحة تعرضها على الإدارة.",
              chip: "brand-health",
            },
          ],
          link: { label: "المشاهدون والمشاركة", href: "/platform/team-and-sharing" },
        },
      ],
      cells: [
        { name: "الاستكشاف", href: "/platform#discovery" },
        {
          name: "مكتبة الأصول",

          href: "/platform#assets",
          line: "أفلِت الملف المضغوط النهائي. يرتّب ماركيوس الأساسي والأيقونة والأحادي والمعكوس.",
        },
        {
          name: "موقع الدليل",

          href: "/platform#guidelines",
          line: "الشعار، والألوان مع فحص التباين، والخطوط بالكتابتين. يُبنى في نقرات.",
        },
        {
          name: "التسليم",

          href: "/platform#handoff",
          line: "لا ملف مضغوط، ولا final_FINAL_v3.pdf. العميل يملك مركزاً حيّاً.",
        },
        {
          name: "مشاهدون بلا حدّ",

          href: "/pricing",
          line: "ادفع عن من يغيّرون العلامة، لا عن من يستخدمونها.",
        },
        {
          name: "الحقوق والانتهاء",

          href: "/platform#rights",
          line: "نوافذ الاستخدام لكل منطقة، تُسحب قبل أن تنتهي.",
        },
        {
          name: "صحة العلامة",

          href: "/platform#health",
          line: "اعرف ما فُحص، وما صُحّح، وأين تنقص العربية.",
        },
      ],
    },

    replaceStack: {
      headline: "ملفاتٌ أقل، وعلامةٌ أوضح.",
      subheadline:
        "مقارنة صريحة، محطة بمحطة. والأهم ليس عدد الأدوات التي تستغني عنها، بل أن كل ما تبقّى أصبح متصلاً.",
      columns: {
        job: "المهمة",
        usually: "تستخدم اليوم",
        markyos: "في ماركيوس",
        change: "ما يتغيّر فعلاً",
      },
      rows: [
        {
          job: "استبيان الاكتشاف",
          usually: "Google Forms · Typeform · Tally",
          markyos: "استبيانات علامة باللغتين، بأسئلة كتبها استراتيجي",
          change: "الإجابات تصبح تحليلاً ومسودات استراتيجية، دون نسخ ولصق",
        },
        {
          job: "قراءة الإجابات",
          usually: "ساعتان من وقتك، أو ChatGPT دون سياق",
          markyos: "التحليل الذكي: التناقضات، والأسئلة الناقصة، والاتجاهات",
          change: "الأول مجاني في كل مشروع",
        },
        {
          job: "الاستراتيجية",
          usually: "Word · Google Docs · Notion · عرض تقديمي",
          markyos: "مركز استراتيجية مبني للعلامات، باللغتين",
          change: "تنتقل إلى الدليل والصوت، ولا تبقى في مجلد",
        },
        {
          job: "لوحات الإلهام",
          usually: "Milanote · Pinterest · Miro",
          markyos: "لوحة إلهام تستخرج الألوان من صورك الحقيقية",
          change: "اللوحة تتحول إلى قرارات: ألوان ومسودات. ولوح مباشر مع عميلك",
          changeChip: "whiteboard",
        },
        {
          job: "الملفات",
          usually: "Google Drive · Dropbox",
          markyos: "مكتبة أصول تصنّف ملفاتك وحدها",
          change: "نسخة واحدة صحيحة من كل شعار وخط ولون",
        },
        {
          job: "دليل الهوية",
          usually: "PDF من InDesign · Guidelines.site",
          markyos: "موقع دليل يُبنى من ملفات المشروع، باللغتين",
          change: "دقائق بدل أيام، ومتصل بكل ما سبقه",
        },
        {
          job: "التسليم",
          usually: "ملف مضغوط عبر WeTransfer ورسالة بريد",
          markyos: "نقل ملكية مركز علامة حيّ",
          change: "العميل يملك علامته، وأنت تكسب حين يرقّي خطته",
        },
        {
          job: "صوت العلامة",
          usually: "Grammarly · Writer · ChatGPT",
          markyos: "مدقّق نبرة يعرف صوتك ومصطلحاتك",
          change: "يفهم العربية ومستوياتها، وسعره للشركة لا للفرد",
        },
        {
          job: "متابعة المشاريع",
          usually: "جدول بيانات · Trello",
          markyos: "لوحة الاستوديو حسب مرحلة كل مشروع",
          change: "تعرف أين يقف كل عميل بنظرة واحدة",
        },
        {
          job: "أسئلة الموظفين",
          usually: "رسائل لا تنتهي إلى مدير التسويق",
          markyos: "«اسأل علامتك»",
          chip: "ask-the-brand",
          change: "يجيب الموظف نفسه من المركز",
        },
        {
          job: "أدواتك الذكية",
          usually: "ChatGPT وClaude، دون أن يعرفا علامتك",
          markyos: "موصّل الذكاء الاصطناعي",
          chip: "ai-connector",
          change: "يقرآن علامتك الحقيقية قبل أن يكتبا",
        },
      ],
      line: "أدوات أقل. علامة واحدة. ولغتان.",
      trademarkNote:
        "الأسماء المذكورة علامات تجارية لأصحابها، وتُذكر فقط لوصف الأدوات الشائعة.",
      link: { label: "المقارنة كاملة", href: "/compare/tool-stack" },
      notReplacedHeadline: "ما لا يحلّ ماركيوس محله",
      notReplaced: [
        {
          title: "أداة التصميم",
          line: "صمّم في Figma أو Illustrator كما تفعل اليوم. ماركيوس يستلم الملفات النهائية، ويحيط التصميم بكل ما يحتاجه.",
          icon: "bezier",
        },
        {
          title: "نظام المبيعات والفواتير",
          line: "العروض والفواتير تبقى في أدواتك.",
          icon: "invoice",
        },
        {
          title: "اللوح العام لكل شيء",
          line: "إن كنت تستخدم Miro لاجتماعات لا علاقة لها بالعلامة، فسيبقى مكانه. لوحاتنا مبنية للعلامات.",
          icon: "chalkboard",
        },
      ],
    },
    comingNext: {
      headline: "المنظومة تكبر. وهذا ما يأتي بعد ذلك.",
      subheadline: "نبني بشفافية. هذا ما يأتي بعد ذلك، بالترتيب.",
      phases: [
        {
          season: "ربيع 2027",
          theme: "استكشاف مشترك",
          items: [
            "لوح تفاعلي مباشر تشاركه مع عميلك",
            "شعار علامتك وألوانها وخطوطها كعناصر حيّة على اللوح",
            "توجيه فني ذكي من أي لوحة",
            "أدلّة الأقسام",
            "الحملات والإطلاقات داخل العلامة",
            "توقيعات بريد إلكتروني بالعربية والإنجليزية لكل موظف",
          ],
        },
        {
          season: "منتصف 2027",
          theme: "فكّر، اسأل، اعرض",
          items: [
            "«اسأل علامتك» لكل موظف",
            "المساعد الاستراتيجي والعصف الذهني",
            "اربط ChatGPT أو Claude بعلامتك",
            "مراجعة ملفات Word وPDF كاملة",
            "تحويل دليل PDF قديم إلى مركز حيّ",
            "قوالب جاهزة لعلامتك: منشورات التواصل، والعروض التقديمية، والأوراق الرسمية، وبطاقات العمل",
          ],
        },
        {
          season: "أواخر 2027",
          theme: "إدارة فريق علامة كامل",
          items: [
            "طلبات المراجعة والموافقة",
            "لوحة لصحة العلامة تعرضها على الإدارة",
            "مراجعة كتاباتك في أي مكان عبر إضافة Chrome",
            "علامات فرعية ترث من العلامة الأم",
            "مزامنة مع Figma، وواجهة برمجية (API)، وتسجيل دخول موحّد",
          ],
        },
      ],
      link: { label: "اطّلع على خريطة الطريق كاملة", href: "/roadmap" },
    },

    pricingTeaser: {
      headline: "ابدأ مجاناً. وادفع حين تكبر.",
      body: "مشروع كامل مجاناً للاستوديوهات، ومركز كامل مجاناً للشركات. والخطط المدفوعة من 24 دولاراً شهرياً.",
      studioToggle: "للاستوديوهات",
      companyToggle: "للشركات",
      recommendedLabel: "موصى بها",
      studioPlans: [
        {
          name: "المجانية",
          price: "مجاناً",
          rows: [{ label: "المشاريع النشطة", value: "1" }],
          line: "نفّذ مشروعاً كاملاً، من الاستبيان حتى التسليم",
          cta: { label: "ابدأ مجاناً", href: "/start?type=studio" },
        },
        {
          name: "الاحترافية",
          price: "24 دولاراً شهرياً",
          recommended: true,
          rows: [{ label: "المشاريع النشطة", value: "3" }],
          line: "للمستقلين الذين يعملون مع عدة عملاء في وقت واحد",
          cta: { label: "ابدأ الاحترافية", href: "/start?type=studio&plan=pro" },
        },
        {
          name: "الاستوديو",
          price: "59 دولاراً شهرياً",
          rows: [{ label: "المشاريع النشطة", value: "10" }],
          line: "للاستوديوهات التي لديها فريق (5 مقاعد)",
          cta: { label: "ابدأ الاستوديو", href: "/start?type=studio&plan=studio" },
        },
      ],
      companyPlans: [
        {
          name: "المجانية",
          price: "مجاناً",
          rows: [
            { label: "المحرّرون", value: "2" },
            { label: "المشاهدون", value: "25" },
          ],
          line: "ابنِ مركزك وراجع محتواك",
          cta: { label: "ابدأ مجاناً", href: "/start?type=company" },
        },
        {
          name: "العلامة",
          price: "24 دولاراً شهرياً",
          recommended: true,
          rows: [
            { label: "المحرّرون", value: "5" },
            { label: "المشاهدون", value: "بلا حدود" },
          ],
          line: "شركتك كلها على هوية واحدة",
          cta: { label: "ابدأ العلامة", href: "/start?type=company&plan=brand" },
        },
        {
          name: "الفريق",
          price: "59 دولاراً شهرياً",
          rows: [
            { label: "المحرّرون", value: "15" },
            { label: "المشاهدون", value: "بلا حدود" },
          ],
          line: "لعدة علامات (3) وفرق أكبر",
          cta: { label: "ابدأ الفريق", href: "/start?type=company&plan=team" },
        },
      ],
      studioNote: "المشاريع المسلّمة لا تُحتسب. تتحرر حصتها لحظة يتسلّم العميل مركزه.",
      companyNote:
        "المشاهدون مجانيون في كل الخطط المدفوعة. تدفع مقابل من يغيّر العلامة، لا من يستخدمها.",
      underBoth: "وفّر نحو 20% مع الاشتراك السنوي.",
      link: { label: "قارن كل الخطط", href: "/pricing" },
    },

    founderNote: {
      headline: "لماذا بنيت ماركيوس",
      body: [
        "منذ 2019 وأنا أعمل مصمماً واستراتيجياً للعلامات التجارية. وفي كل مشروع كنت أفتح الأدوات نفسها: استبياناً في Google Forms، ولوحة في Milanote، واستراتيجية في ملف Word، ومجلداً في Drive، ودليلاً بصيغة PDF. وفي كل مرة، كانت العلامة تبهت بعد التسليم بأشهر، والعربية دائماً الجزء الأضعف، لأن كل أداة بُنيت للإنجليزية أولاً.",
        "ماركيوس هو المكان الذي تمنّيته في كل واحد من تلك المشاريع: منظومة واحدة تُصنع فيها العلامة، وتُسلَّم، وتعيش، بالعربية والإنجليزية على قدم المساواة.",
      ],
      signature: "عبدالله سعيدان، المؤسس",
    },

    faq: {
      headline: "الأسئلة الشائعة",
      items: [
        {
          question: "هل يغنيني ماركيوس فعلاً عن Google Forms وMilanote وDrive؟",
          answer:
            "لكل ما يخص العلامة، نعم: الاستبيان، والإلهام، والملفات، والدليل، والتسليم في مكان واحد ومتصلة ببعضها. وإن كنت تستخدم أداة منها لأمور أخرى لا علاقة لها بالعلامة، فقد تبقى لها.",
        },
        {
          question: "ما «عقل العلامة»؟ وهل هو ChatGPT؟",
          answer:
            "عقل العلامة هو الذكاء الاصطناعي داخل ماركيوس، ويجيب من علامتك أنت: استبياناتك، واستراتيجيتك، وصوتك، ومصطلحاتك. يحلّل، ويقارن، ويراجع، ويكتب مسودات تنتظر موافقتك. لا يرسم شعارات، ولا يغيّر شيئاً وحده.",
        },
        {
          question: "هل أستطيع ربط ChatGPT أو Claude بعلامتي؟",
          answer:
            "نعم، في كل الخطط المدفوعة. تقرأ أداتك استراتيجيتك وصوتك ومصطلحاتك وملفاتك المعتمدة ولوحاتك واستبياناتك قبل أن تكتب. تقرأ فقط، ولا تغيّر شيئاً، ولا تستهلك رصيدك. ومالك المساحة يحدد من يستطيع الربط.",
          coming: "ai-connector",
        },
        {
          question: "لديّ دليل على Guidelines.site أو بصيغة PDF. هل أبدأ من الصفر؟",
          answer:
            "لا. أفلِت ملفات علامتك، ويبني ماركيوس المركز والدليل منها. وقريباً سيقرأ ملف PDF القديم نفسه، ويكتب منه المسودات.",
          coming: "pdf-import",
        },
        {
          question: "هل ماركيوس أداة تصميم؟",
          answer:
            "لا. صمّم في Figma أو Illustrator. ماركيوس هو المكان الذي يعيش فيه كل ما حول التصميم.",
        },
        {
          question: "لمن صُمّم ماركيوس؟",
          answer:
            "للاستوديوهات والمصممين المستقلين الذين يصنعون علامات لعملائهم، وللشركات التي تدير علامتها بنفسها. وحساب واحد يمكن أن يجمع الاثنين.",
        },
        {
          question: "ماذا يحدث لمركز عميلي إن لم يدفع؟",
          answer:
            "يبقى حيّاً وقابلاً للتعديل على الخطة المجانية للشركات، بمحرّرين اثنين، ورابط على نطاق ماركيوس، وشارة صغيرة «صُنع باستخدام ماركيوس».",
        },
        {
          question: "ما مستوى العربية فعلاً؟",
          answer:
            "العربية ليست طبقة ترجمة. الواجهة تنعكس بالكامل، ولكل كتابة خانتها للشعار والخط، ومدقّق النبرة يميّز مستويات العربية. والأسئلة مكتوبة باللغتين بيد استراتيجي.",
        },
        {
          question: "هل محتواي آمن؟",
          answer:
            "لا شيء في مساحتك يصبح عاماً حتى تنشره. والنصوص التي تراجعها لا تُحفظ إلا إن اخترت ذلك.",
        },
        {
          question: "كيف أدفع؟",
          answer:
            "بالبطاقة عبر Stripe، وبالدولار الأمريكي. البطاقات التي تعمل على شبكة مدى فقط غير مدعومة حالياً.",
        },
      ],
      link: { label: "كل الأسئلة", href: "/pricing#faq" },
    },

    /*
     * الختام.
     *
     * كان العنوان «تُبنى. تُشارك. تحيا.»: ثلاثة أفعال مبنية للمجهول،
     * بلا فاعل ولا مخاطَب. وموضعه هذا هو آخر ما يقرأه الزائر قبل أن يقرر،
     * فحلّ محلّه السطر المعتمد من §11 حرفياً. هو سطر العلامة نفسه، وهو أمرٌ
     * موجّه لا وصف، وهو نفس السطر الذي تفتح به قائمة «الحلول» في الرأس،
     * فتُقفل الصفحة على ما فُتحت به.
     *
     * والسطر تحته لم يعد يكرر «ابدأ مجاناً» — وهي مكتوبة أسفله في
     * الميكروكوبي وفي الزرّين — بل يسمّي العدوّ الذي تقوم عليه الصفحة كلها:
     * التآكل. وهو محايد بين البابين، لأنّ القرار الذي يليه هو اختيار باب.
     */
    finalCta: {
      eyebrow: "ابدأ اليوم",
      headline: "ابنِ الهوية. سلّمها. وأبقِها حيّة.",
      subheadline:
        "علامتك كلها في مكان واحد، بالعربية والإنجليزية. من يفتحها بعد سنة يجدها كما تركتها، لا نُسخاً منها.",
      studioCta: { label: "أصمّم هويات لعملائي", href: "/start?type=studio" },
      companyCta: { label: "أدير علامة شركتي", href: "/start?type=company" },
      microcopy: "خطة مجانية، دون بطاقة دفع.",
      beta: {
        studioCta: { label: "احجز مكان استوديوك", href: "/start?type=studio" },
        companyCta: { label: "احجز مكان شركتك", href: "/start?type=company" },
        microcopy: "25 مكاناً للاستوديوهات و15 للشركات في البرنامج التجريبي.",
      },
    },
  },
};
