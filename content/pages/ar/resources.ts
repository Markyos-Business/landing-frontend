import type { PageDoc } from "../types";
import { CTA, FORK, HOME, LINK } from "./_shared";

/*
 * الموارد · المقارنات · من نحن · تواصل معنا —
 * docs/copy/pages_ar_3_resources_company.md, pages 20, 24 to 29.
 *
 * The blog, the guides and the help centre are *not* here. They are editorial
 * content with their own routes and their own lifecycle: added weekly, by
 * whoever is writing that week, through the CMS. Page copy and editorial
 * content are kept apart deliberately — see lib/content/adapter.ts, which is
 * the boundary.
 *
 * Page 27 (the named competitor template) is also absent, and that is the
 * source's own instruction: no named comparison may be published until every
 * fact about the competitor has been checked on their own site, with the date
 * checked shown on the page. A template rendered as a page is a page of
 * square brackets, and the one thing a comparison cannot be is approximate.
 */

/* ── 20 · الموارد ──────────────────────────────────────────────────────── */

const resources: PageDoc = {
  path: "/resources",
  shortTitle: "الموارد",
  title: "الموارد · ماركيوس",
  description:
    "مقالات وأدلة عملية عن بناء العلامات التجارية بالعربية والإنجليزية، ومركز مساعدة، ومقارنات واضحة.",
  breadcrumbs: [HOME],
  priority: 0.7,
  blocks: [
    {
      kind: "hero",
      title: "تعلّم كيف تُبنى العلامات، وكيف تبقى حيّة.",
      lead: "ما تعلّمناه من سنوات العمل على العلامات في الخليج وجنوب شرق آسيا، مكتوباً لمن يصنع العلامات ولمن يديرها.",
    },
    {
      kind: "cards",
      cols: 3,
      items: [
        /* ستة أبواب، ولكلٍّ منها شكله. الأيقونات هنا دليل اتجاه لا زينة:
           الصفحة فهرس، والقارئ يمسح ستة مقاصد لا ستة نصوص. */
        {
          title: "المدونة",
          icon: "book",
          body: "أفكار ومقالات عن الاستراتيجية، والهوية، والعلامات ثنائية اللغة.",
          cta: { label: "اقرأ المدونة", href: "/blog" },
        },
        {
          title: "الأدلة والقوالب",
          icon: "fileAlt",
          body: "أدلة عملية وقوالب جاهزة تستخدمها في مشروعك القادم.",
          cta: { label: "تصفّح الأدلة", href: "/guides" },
        },
        {
          title: "مركز المساعدة",
          icon: "help",
          body: "كل ما تحتاجه لاستخدام ماركيوس، خطوة بخطوة.",
          cta: { label: "افتح مركز المساعدة", href: "/help" },
        },
        {
          title: "المقارنات",
          icon: "exchange",
          body: "كيف يقارَن ماركيوس بما تستخدمه اليوم، بصراحة.",
          cta: { label: "اقرأ المقارنات", href: "/compare" },
        },
        {
          title: "ما الجديد",
          icon: "history",
          body: "آخر ما أضفناه إلى ماركيوس.",
          cta: LINK.whatsNew,
        },
        {
          title: "خريطة الطريق",
          icon: "rocket",
          body: "ما نبنيه الآن، وما يأتي بعده، بالمواسم لا بالتواريخ.",
          cta: LINK.roadmap,
        },
      ],
    },
    {
      kind: "callout",
      title: "دليل مميّز",
      body: [
        "كيف تكتب استبيان اكتشاف يكشف ما لا يقوله العميل. ومعه 40 سؤالاً جاهزاً بالعربية والإنجليزية.",
      ],
      cta: { label: "اقرأ الدليل", href: "/solutions/discovery" },
    },
    {
      kind: "signup",
      title: "مقال واحد مفيد في الشهر. لا أكثر.",
      lead: "نرسل مقالاً واحداً كل شهر عن العلامات بالعربية والإنجليزية. ويمكنك إلغاء الاشتراك متى شئت.",
      placeholder: "بريدك الإلكتروني",
      submit: "اشترك",
      topic: "newsletter",
    },
  ],
};

/* ── 28 · من نحن ──────────────────────────────────────────────────────── */

const about: PageDoc = {
  path: "/about",
  shortTitle: "من نحن",
  title: "من نحن · ماركيوس",
  description:
    "ماركيوس منصة علامات تجارية ثنائية اللغة، بناها مصمم واستراتيجي علامات عمل في الخليج وجنوب شرق آسيا منذ 2019.",
  breadcrumbs: [HOME],
  priority: 0.7,
  blocks: [
    {
      kind: "hero",
      title: "بُني من داخل المشكلة.",
      lead: "ماركيوس لم يبدأ كفكرة شركة ناشئة. بدأ من مشكلة تكررت في كل مشروع علامة عملنا عليه.",
    },
    {
      kind: "prose",
      // [CONFIRM] in the source: Abdullah to rewrite in his own voice, and
      // confirm the Arabic spelling of his name. Kept first person and
      // specific, as the note asks.
      title: "القصة",
      body: [
        "منذ 2019 وأنا أعمل مصمماً واستراتيجياً للعلامات التجارية. وفي كل مشروع تقريباً كان يتكرر الشيء نفسه: نعمل أشهراً على الاستراتيجية والهوية، ثم نسلّم العلامة في ملف PDF، ثم نراها تبهت خلال عام. شعار قديم في عرض المبيعات. نسخة عربية لا تشبه الإنجليزية. ومدير تسويق يجيب عن الأسئلة نفسها كل أسبوع.",
        "وكانت العربية دائماً الجزء الأضعف، لا لأن أحداً لا يهتم بها، بل لأن كل أداة استخدمناها صُنعت للإنجليزية أولاً.",
        "فقررنا أن نبني الأداة التي تمنّيناها في كل مشروع: مكاناً يُدار فيه مشروع العلامة كما يجب، وتُسلَّم فيه كما يجب، وتعيش فيه بعد التسليم. بالعربية والإنجليزية، وعلى قدم المساواة.",
      ],
      align: "start",
    },
    {
      kind: "numbered",
      title: "ما نؤمن به",
      items: [
        {
          title: "العلامة مكان، لا ملف",
          body: ["تعيش حيث يجدها الجميع، وتتغيّر في مكان واحد."],
        },
        {
          title: "العربية ليست ترجمة",
          body: ["هي لغة أولى، تستحق أدوات بُنيت لها."],
          cta: LINK.arabic,
        },
        {
          title: "الذكاء الاصطناعي مساعد، لا مصمم",
          body: ["يكتب المسودة الأولى، والإنسان يقرر. ولن يرسم شعاراً."],
        },
        {
          title: "الاستوديو والشركة في صف واحد",
          body: ["حين ينجح عميل الاستوديو، يكسب الاستوديو أيضاً."],
          cta: LINK.handoff,
        },
        {
          title: "نبني بشفافية",
          body: ["نقول ما بنيناه، وما نبنيه، وما لن نبنيه."],
          cta: LINK.roadmap,
        },
      ],
    },
    {
      kind: "terms",
      title: "الفريق",
      cols: 2,
      items: [
        {
          term: "عبدالله سعيدان · الشريك المؤسس",
          body: "استراتيجي علامات ومصمم منذ 2019. مسؤول عن المنتج، والتجربة، والتصميم، ومنهجية العلامات في ماركيوس.",
        },
        {
          // The source has [PLACEHOLDER: name] for the technical co-founder.
          // The role is named and the person is not, which is honest; an
          // invented name on an about page is the worst possible place for one.
          term: "الشريك المؤسس · الهندسة والمنصة",
          body: "مسؤول عن الهندسة والمنصة. نضيف اسمه وسطره هنا قبل الإطلاق.",
        },
      ],
    },
    {
      kind: "cta",
      title: "اصنع علامة تبقى حيّة.",
      buttons: [CTA.startFree],
      links: [LINK.contact],
    },
  ],
};

/* ── 29 · تواصل معنا ──────────────────────────────────────────────────── */

const contact: PageDoc = {
  path: "/contact",
  shortTitle: "تواصل معنا",
  title: "تواصل معنا · ماركيوس",
  description:
    "تواصل مع فريق ماركيوس بشأن المبيعات، أو الدعم، أو الشراكات مع الاستوديوهات، أو الصحافة.",
  breadcrumbs: [HOME],
  priority: 0.6,
  blocks: [
    {
      kind: "hero",
      title: "تحدّث معنا.",
      lead: "فريق صغير، يقرأ كل رسالة. اختر موضوعك لتصل رسالتك إلى الشخص المناسب.",
    },
    {
      kind: "table",
      title: "المواضيع",
      // The source's email column is all [PLACEHOLDER: sales@], [support@]
      // and so on, and the reply times are [X] days. Neither is invented
      // here: the column is dropped and the form carries the routing, which
      // is what the topic parameter is for. Addresses go in when they exist.
      head: ["الموضوع", "لمن"],
      rows: [
        ["المبيعات وخطة المؤسسات", "الشركات الكبيرة والمجموعات"],
        ["الدعم", "مستخدمو ماركيوس. جرّب مركز المساعدة أولاً"],
        ["شراكات الاستوديوهات", "الاستوديوهات التي تريد العمل معنا عن قرب"],
        ["الصحافة", "الصحفيون والإعلام"],
        ["الأمان", "الإبلاغ عن ثغرة"],
        ["اقتراح ميزة", "الجميع. نقرأ كل اقتراح"],
      ],
      note: "نردّ على كل رسالة. ومواعيد الردّ لكل موضوع تُنشر هنا قبل الإطلاق.",
    },
    {
      kind: "signup",
      title: "اكتب لنا",
      lead: "أدخل بريدك وسنتواصل معك. وإن كان سؤالك عن استخدام ماركيوس، فقد تجد إجابته في مركز المساعدة أسرع.",
      placeholder: "بريد العمل",
      submit: "أرسل",
      topic: "contact",
    },
    {
      kind: "cta",
      lead: "تبحث عن إجابة سريعة؟",
      links: [LINK.help, LINK.pricing],
    },
    { kind: "prose", body: [], links: FORK },
  ],
};

/*
 * `/compare` and its two pages are not here any more (8 Nov 2026).
 *
 * They were page copy because there was no comparison content and no route
 * for it. There are ten written comparisons now, in both languages, so the
 * section is a CMS collection with its own route like the blog and the
 * guides — `app/[lang]/compare/` — and `pdf-guidelines` and `tool-stack` are
 * two of the ten rather than two hand-written pages that would shadow them.
 *
 * `git show HEAD:content/pages/ar/resources.ts` has the copy they held.
 */
export const resourcePages: PageDoc[] = [resources, about, contact];
