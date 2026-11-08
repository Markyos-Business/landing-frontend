import type { PageDoc } from "../types";
import { CTA, LINK, SOLUTION_TRAIL } from "./_shared";

/*
 * The nine solution pages.
 *
 * Site Copy v3 (English), Part C. v3 writes these as fifteen feature pages
 * under /platform; this site has nine pages under /solutions, and each one
 * is the home of one or two of v3's. Where two of v3's pages share one here,
 * the second gets an anchor rather than a page of its own:
 *
 *   /solutions/client-projects      Part C page 10 · Studio board
 *   /solutions/discovery            pages 4 and 5 · the brief, and the read
 *                                   of it (#analysis)
 *   /solutions/guideline-sites      page 9 · Guideline site
 *   /solutions/client-handoff       page 11 · Handoff (#how, #reward)
 *   /solutions/brand-hub            page 8 · Asset library
 *   /solutions/brand-voice          page 12 · Brand voice and term base
 *   /solutions/tone-checker         page 13 · Tone checker
 *   /solutions/leadership-alignment page 14 · Leadership alignment
 *   /solutions/company-rollout      page 15 · Viewers and sharing
 *
 * Every "what's inside" list keeps v3's chips as `feature` ids, so a line
 * that has not shipped carries the same status chip it does everywhere else
 * on the site and cannot quietly become a promise.
 */

/* ── Studio board ───────────────────────────────────────────────────────── */

const clientProjects: PageDoc = {
  path: "/solutions/client-projects",
  shortTitle: "Client projects",
  title: "Brand Project Management · Studio Board · Markyos",
  description:
    "Every brand project on one board, by stage, from discovery to handoff. Roles for your team, sign-off from your client.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "Every project. Every stage. One view.",
      lead: "Each project has a path from discovery to handoff, and every project sits on one board, by stage.",
      buttons: [CTA.firstProject],
    },
    {
      kind: "prose",
      title: "What it is",
      body: [
        "The project path shows where each project stands, and the studio board shows them all. Both update with every step.",
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        { term: "Eight steps", body: "And you skip what you don't need." },
        { term: "A board by stage", body: "Every project, where it actually is." },
        { term: "Roles for your team", body: "Owner, editor, viewer." },
        { term: "Clients as guests", body: "With no account and no limit." },
        { term: "Sign-off", body: "On the core sections, dated.", feature: "roles-approvals" },
        { term: "Not a CRM, on purpose", body: "Proposals and invoices stay in your tools." },
        { term: "Webhooks to your tools", body: "And the Agency plan.", feature: "webhooks" },
      ],
    },
    {
      kind: "callout",
      title: "Works with, and plans",
      body: [
        "Every feature in a project updates its stage, and handoff frees its slot. 1 active project free · 3 on Pro · 10 on Studio.",
      ],
      cta: LINK.pricing,
    },
    {
      kind: "cta",
      title: "Every project. Every stage. One view.",
      buttons: [CTA.firstProject],
      links: [LINK.studios],
    },
  ],
};

/* ── Discovery forms, and the analysis ──────────────────────────────────── */

const discovery: PageDoc = {
  path: "/solutions/discovery",
  shortTitle: "Discovery",
  title: "Bilingual Brand Discovery Forms · Markyos",
  description:
    "A brand brief your client answers from a link, in English or Arabic, with no account. Five templates, a bilingual question library, free and unlimited.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "Better questions. Clearer answers. A faster start.",
      lead: "A bilingual brand brief your client answers from a link, no account needed. Their answers become work, not a spreadsheet you copy from.",
      buttons: [CTA.firstBrief],
    },
    {
      kind: "prose",
      title: "What it is",
      body: [
        "The first step of a brand project: the questions that help you understand the client before you start. Built for brands, and connected to everything after.",
      ],
    },
    {
      kind: "steps",
      title: "How it works",
      items: [
        { body: "Pick a template and adjust it." },
        { body: "Send the link. Your client answers in their language." },
        { body: "Request the analysis when it's done." },
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        {
          term: "Five templates",
          body: "New brand, rebrand, sub-brand, naming, product launch.",
        },
        { term: "A bilingual question library", body: "Written by a strategist." },
        {
          term: "Questions made for brands",
          body: "Personality scales, ranking, picking images, file upload.",
          feature: "question-library",
        },
        { term: "Simple logic", body: "Show or hide a question based on an answer." },
        {
          term: "In your studio's branding",
          body: "And right-to-left automatically in Arabic.",
        },
        {
          term: "Call notes",
          body: "They go into the analysis with the answers.",
          feature: "call-notes",
        },
      ],
      note: "Feeds the AI brief analysis, the Strategy hub and moodboards. Free and unlimited on every plan.",
    },
    {
      kind: "prose",
      id: "analysis",
      eyebrow: "AI brief analysis",
      title: "What your client said. And what they didn't.",
      body: [
        "A ten-part report that reads the answers the way a senior strategist would. The first analysis in every project is free.",
        "A Brand Brain tool. It turns answers and call notes into a bilingual report, and every finding is a draft that waits for you.",
      ],
    },
    {
      kind: "terms",
      title: "What the report holds",
      cols: 2,
      items: [
        {
          term: "A snapshot",
          body: "Goals, audience, competitors and personality.",
          feature: "brief-analysis",
        },
        {
          term: "Contradictions in the answers",
          body: "“Premium”, then “cheapest”.",
          feature: "brief-analysis",
        },
        { term: "The missing questions", body: "Ranked.", feature: "brief-analysis" },
        {
          term: "Two or three directions",
          body: "The brand could take any of them.",
          feature: "brief-analysis",
        },
        {
          term: "Creative starting points",
          body: "With the constraints and the risks.",
          feature: "brief-analysis",
        },
        {
          term: "A share link you can revoke",
          body: "And PDF export.",
          feature: "brief-analysis",
        },
      ],
      note: "Reads the discovery form and writes drafts into the Strategy hub. The first one per project is free on every plan. A re-run uses 15 credits.",
    },
    {
      kind: "cta",
      title: "Know your client before you start.",
      buttons: [CTA.firstBrief],
      links: [LINK.guidelineSites],
    },
  ],
};

/* ── Guideline site ─────────────────────────────────────────────────────── */

const guidelineSites: PageDoc = {
  path: "/solutions/guideline-sites",
  shortTitle: "Guideline sites",
  title: "Bilingual Brand Guideline Sites · Markyos",
  description:
    "Pick one of 8 looks, and your brand guidelines build themselves from the project's files, in both languages, in minutes.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "A guide people open. Not a file they forget.",
      lead: "Pick one of 8 looks, and the guideline site builds from the project's files, in both languages, in minutes.",
      buttons: [CTA.firstGuide],
    },
    {
      kind: "prose",
      title: "What it is",
      body: [
        "The brand's rules in a real site, built from the same files and strategy, so nobody has to keep it updated.",
      ],
    },
    {
      kind: "steps",
      title: "How it works",
      items: [
        { body: "Pick a look." },
        { body: "The site builds from the project." },
        { body: "Edit, check on three screens, publish." },
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        {
          term: "8 looks",
          body: "Vault, Docs, Studio in three styles, Manual, Mosaic, Deck.",
          feature: "guideline-templates",
        },
        {
          term: "16 sections that build themselves",
          body: "When their data exists.",
          feature: "auto-sections",
        },
        { term: "19 layouts and 19 block types", body: "For the sections you write yourself." },
        { term: "One guide in two languages", body: "And the reader chooses." },
        {
          term: "Reads from the source",
          body: "Change a colour, and every page changes.",
        },
        {
          term: "Published as a fixed snapshot",
          body: "On your link or domain, or behind a password.",
          feature: "domains",
        },
        {
          term: "Section copy from Brand Brain",
          body: "Drafts for the sections you have not written.",
          feature: "ai-section-copy",
        },
      ],
      note: "Built from the Asset library and the strategy, and handed over to the client. Two looks free, all eight on paid plans.",
    },
    {
      kind: "cta",
      title: "A guide people open.",
      buttons: [CTA.firstGuide],
      links: [LINK.handoff],
    },
  ],
};

/* ── Handoff ────────────────────────────────────────────────────────────── */

const clientHandoff: PageDoc = {
  path: "/solutions/client-handoff",
  shortTitle: "Handoff",
  title: "Brand Handoff · A Live Hub Instead of a PDF · Markyos",
  description:
    "Hand your client a live brand hub they own, not a zip file. Keep your role, and earn 20% of their first year when they upgrade.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "Hand over a brand, not a folder.",
      lead: "Your client gets a hub with their name on it, opened by their team every day. You keep your role, and you earn as they grow.",
      buttons: [CTA.firstProject],
    },
    {
      kind: "steps",
      id: "how",
      title: "How it works",
      items: [
        { body: "Publish the hub, and press “Hand off”." },
        { body: "Your client claims it in their company workspace." },
        { body: "You keep your role, and the project slot frees up." },
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        { term: "A full ownership transfer", body: "Not a copy.", feature: "handoff" },
        {
          term: "Always free",
          body: "And the hub stays live on the client's free plan.",
        },
        { term: "The sign-off record", body: "It moves with it." },
        {
          term: "The client's first year, prepaid",
          body: "$190 instead of $228.",
        },
        {
          term: "Stay on as a collaborator",
          body: "Without using a slot.",
        },
      ],
    },
    {
      kind: "prose",
      id: "reward",
      eyebrow: "Partner reward",
      title: "You handed it over. The return keeps coming.",
      body: [
        "20% of what your client pays in their first year, as credit on your plan. 25% on the Agency plan. Five clients on the Brand plan cover your Pro plan.",
      ],
      emphasiseLast: true,
    },
    {
      kind: "cta",
      title: "Hand over a brand, not a folder.",
      buttons: [CTA.firstProject],
      links: [LINK.pricing],
    },
  ],
};

/* ── Asset library ──────────────────────────────────────────────────────── */

const brandHub: PageDoc = {
  path: "/solutions/brand-hub",
  shortTitle: "Brand hub",
  title: "Brand Asset Library · Markyos",
  description:
    "Drop in the identity folder, and Markyos sorts the logos, fonts and colours on its own. One right version of every file, for everyone.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "Change it once. It's right every time.",
      lead: "Drop in the identity folder, and Markyos sorts the logos, fonts and colours on its own. The right version always stays on top.",
      buttons: [CTA.setupBrand],
    },
    {
      kind: "prose",
      title: "What it is",
      body: [
        "The one home for every brand file. The guidelines never keep a copy of the logo; they point here.",
      ],
    },
    {
      kind: "steps",
      title: "How it works",
      items: [
        { body: "Drop in the folder or the zip file." },
        { body: "Check one screen: “6 logos, 2 font families, 9 colours”." },
        { body: "Confirm, and they become approved assets." },
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        {
          term: "Logos by type",
          body: "With slots for Arabic, Latin and the symbol.",
          feature: "visual-identity",
        },
        { term: "Fonts in families", body: "With Arabic support detected." },
        {
          term: "Colours",
          body: "From your files or the logo, with contrast checks.",
          feature: "colour-checks",
        },
        {
          term: "Font licences",
          body: "Unconfirmed fonts display but don't download.",
        },
        { term: "Nothing uploads until you confirm", body: "You see the list first." },
        {
          term: "Reading an old PDF guide",
          body: "And Figma sync.",
          feature: "pdf-import",
        },
      ],
      note: "The guidelines build from it, everyone downloads from it, and it hands over whole. Storage from 2 GB free.",
    },
    {
      kind: "cta",
      title: "Change it once. It's right every time.",
      buttons: [CTA.setupBrand],
      links: [LINK.guidelineSites],
    },
  ],
};

/* ── Brand voice and term base ──────────────────────────────────────────── */

const brandVoice: PageDoc = {
  path: "/solutions/brand-voice",
  shortTitle: "Brand voice",
  title: "Brand Voice and Term Base, in Two Languages · Markyos",
  description:
    "Write down how your brand speaks once: voice traits with examples, language register per channel, and an approved translation for every key term.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "Two languages. One voice.",
      lead: "Write down how your brand speaks once, and Arabic and English say the same thing everywhere.",
      buttons: [CTA.setupVoice],
    },
    {
      kind: "prose",
      title: "What it is",
      body: [
        "A written description of how your brand speaks, and a list of the words it uses and avoids. Together they're what the tone checker checks against.",
      ],
    },
    {
      kind: "steps",
      title: "How it works",
      items: [
        { body: "Write the traits, and add examples." },
        { body: "Set the language register for each channel." },
        { body: "Build your term base, or import it." },
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        { term: "Voice traits", body: "“Warm, not stiff”.", feature: "voice-profile" },
        { term: "Examples", body: "That sound like you, and some that don't." },
        { term: "Arabic register", body: "Standard or dialect, per channel." },
        { term: "English", body: "British or American, and whether mixing is allowed." },
        {
          term: "Term base",
          body: "Preferred, banned, never translated, and approved translations.",
          feature: "voice-profile",
        },
        { term: "CSV import", body: "Bring the list you already keep." },
        {
          term: "A voice for each team",
          body: "From the same voice.",
          feature: "department-playbooks",
        },
      ],
      note: "Starts from the strategy, powers the tone checker, and guides every translation. On every plan. Voice per channel and team from the Team plan.",
    },
    {
      kind: "cta",
      title: "Two languages. One voice.",
      buttons: [CTA.setupVoice],
      links: [LINK.toneChecker],
    },
  ],
};

/* ── Tone checker ───────────────────────────────────────────────────────── */

const toneChecker: PageDoc = {
  path: "/solutions/tone-checker",
  shortTitle: "Tone checker",
  title: "Bilingual Brand Tone Checker · Markyos",
  description:
    "Paste any text and know in seconds if it sounds like your brand, and why: a score, a note for each voice trait, wrong terms and register. In English and Arabic.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "Your brand, word for word.",
      lead: "Paste any text, and know in seconds if it sounds like your brand, and why.",
      buttons: [CTA.firstCheck],
    },
    {
      kind: "steps",
      title: "How it works",
      items: [
        { body: "Paste the text, and pick the channel." },
        { body: "Get the score, and the reason for each note." },
        { body: "Rewrite it, or translate it, in your voice." },
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        {
          term: "A score out of 100, and a word",
          body: "On brand, close, or off.",
          feature: "tone-checker",
        },
        { term: "A score for each voice trait", body: "With the reason." },
        { term: "Banned words and wrong terms", body: "Caught against your term base." },
        { term: "Arabic register", body: "When it doesn't fit the channel." },
        { term: "Deep check, rewrite and translate", body: "4 credits each." },
        {
          term: "Your text isn't kept",
          body: "Unless you save it, and then for 30 days.",
        },
        {
          term: "Word and PDF files",
          body: "And a Chrome extension.",
          feature: "document-checks",
        },
      ],
      note: "Checks against the brand voice and term base, and viewers use it free. 25 quick checks a month free · 1,000 on Brand · 3,000 on Team.",
    },
    {
      kind: "cta",
      title: "Your brand, word for word.",
      buttons: [CTA.firstCheck],
      links: [LINK.brandVoice],
    },
  ],
};

/* ── Leadership alignment ───────────────────────────────────────────────── */

const leadershipAlignment: PageDoc = {
  path: "/solutions/leadership-alignment",
  shortTitle: "Leadership alignment",
  title: "Leadership Questionnaire and Brand Alignment Report · Markyos",
  description:
    "The same brand questions for every leader, and a report showing where they agree, where they don't, and what nobody knows. The first report is free.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "Many views. One brand.",
      lead: "The same questions for every leader, and a report that shows where they agree, where they don't, and what nobody knows. The first report is free.",
      buttons: [CTA.firstWorkshop],
      feature: "stakeholder-workshop",
    },
    {
      kind: "steps",
      title: "How it works",
      items: [
        { body: "Choose the brand-foundation questions." },
        { body: "Send each leader their own link." },
        { body: "Request the alignment report." },
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        { term: "Where leaders agree", body: "Stated plainly, in one place." },
        {
          term: "Where they don't",
          body: "“Premium” from the CEO, “affordable” from sales.",
        },
        { term: "What nobody could answer", body: "The questions the brand has not settled." },
        { term: "Possible directions", body: "Which become strategy drafts." },
        { term: "Everyone answers alone", body: "No one sees another leader's answers." },
      ],
      note: "Runs on the discovery form engine, and writes into the strategy. The first report per brand is free. A re-run uses 20 credits.",
    },
    {
      kind: "cta",
      title: "Many views. One brand.",
      buttons: [CTA.firstWorkshop],
      links: [LINK.brandVoice],
    },
  ],
};

/* ── Viewers and sharing ────────────────────────────────────────────────── */

const companyRollout: PageDoc = {
  path: "/solutions/company-rollout",
  shortTitle: "The whole company",
  title: "Bring Your Whole Company Into the Brand Hub · Markyos",
  description:
    "Unlimited free viewers on paid plans: everyone browses, downloads and checks their writing, and you pay only for the people who edit.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "A few change it. Everyone uses it.",
      lead: "On paid plans, viewers are unlimited and free. The whole company comes in, and you pay only for the people who edit.",
      buttons: [CTA.setupBrand],
    },
    {
      kind: "table",
      title: "Editors and viewers",
      head: [{ text: "" }, { text: "Editors" }, { text: "Viewers" }],
      rows: [
        [
          { text: "They" },
          { text: "Change the brand" },
          { text: "Browse, download, and check their writing" },
        ],
        [
          { text: "How many" },
          { text: "2 · 5 · 15" },
          { text: "25 free, unlimited on paid plans" },
        ],
        [{ text: "Cost" }, { text: "In the plan" }, { text: "Free", strong: true }],
      ],
    },
    {
      kind: "terms",
      title: "What's inside",
      cols: 2,
      items: [
        {
          term: "Partner links",
          body: "For an agency or printer, expiring when you choose.",
        },
        { term: "Invite your studio", body: "Without it counting as an editor." },
        {
          term: "Permissions on the server",
          body: "A viewer can't change anything.",
        },
        {
          term: "Bilingual email signatures",
          body: "For everyone in the company.",
          feature: "email-signatures",
        },
        {
          term: "Ask the Brand",
          body: "Templates, reviews, and the AI Connector.",
          feature: "ask-the-brand",
        },
      ],
    },
    {
      kind: "cta",
      title: "Bring everyone in. Pay for five.",
      buttons: [CTA.setupBrand],
      links: [LINK.pricing],
    },
  ],
};

export const solutionPages: PageDoc[] = [
  clientProjects,
  discovery,
  guidelineSites,
  clientHandoff,
  brandHub,
  brandVoice,
  toneChecker,
  leadershipAlignment,
  companyRollout,
];
