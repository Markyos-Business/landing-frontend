import type { PageDoc } from "../types";
import { CTA, HOME, LINK, SOLUTION_TRAIL } from "./_shared";

/*
 * Solutions — the hub and the three audience pages.
 *
 * Transcribed from Site Copy v3 (English), Part B, pages 1 to 4.
 *
 * ── Shorter than the Arabic, on purpose ──────────────────────────────────
 *
 * The Arabic editions of these four pages came from the v2 copy documents
 * and carry more: a web diagram, a nine-item explorer, a longer feature
 * table. v3 cut all of that — "shortest it can be, one idea each" — and the
 * English set is written against v3, so the two editions differ in length
 * here. That is the deck's decision, not a gap in the translation, and the
 * Arabic will shorten when it moves to v3.
 *
 * ── The feature links ────────────────────────────────────────────────────
 *
 * v3's tables point at `/platform/<feature>`, a fifteen-page information
 * architecture that does not exist on this site yet. The pages those links
 * are *about* do exist, under /solutions, so each one is pointed there:
 * studio board → /solutions/client-projects, brief analysis →
 * /solutions/discovery, and so on. A link to a page that would 404 is worse
 * than a link to the page that covers the same ground.
 *
 * Part B's rule, kept: the slogan does not appear on these pages, and
 * nothing on the companies page suggests a studio is needed.
 */

/* ── Page 1 · Solutions hub ─────────────────────────────────────────────── */

const hub: PageDoc = {
  path: "/solutions",
  shortTitle: "Solutions",
  title: "Solutions · Markyos",
  description:
    "For everyone who makes or runs a brand: studios, freelancers and companies.",
  breadcrumbs: [HOME],
  priority: 0.9,
  blocks: [
    {
      kind: "hero",
      title: "Choose your way in.",
      lead: "One Markyos, three ways in. Pick the one that sounds like you, and we'll show you what matters to you first.",
    },
    {
      kind: "cards",
      eyebrow: "Start here",
      title: "Pick the one that sounds like you.",
      cols: 3,
      items: [
        {
          title: "Studios and agencies",
          icon: "layers",
          body: "From the first question to the final handoff.",
          cta: { label: "For studios", href: "/solutions/studios" },
        },
        {
          title: "Freelance designers",
          icon: "user",
          body: "Work alone. Show up as a team.",
          cta: { label: "For freelancers", href: "/solutions/freelancers" },
        },
        {
          title: "Companies",
          icon: "building",
          body: "On brand. On time. In both languages.",
          cta: { label: "For companies", href: "/solutions/companies" },
        },
      ],
    },
    {
      kind: "prose",
      title: "Your brand, or your client's?",
      body: [
        "If it's your client's, you're a studio. If it's your company's, you're a company. One account can hold both.",
      ],
      links: [LINK.platform],
    },
  ],
};

/* ── Page 2 · Studios and agencies ──────────────────────────────────────── */

const studios: PageDoc = {
  path: "/solutions/studios",
  shortTitle: "For studios",
  title: "Markyos for Studios · From the First Question to the Final Handoff",
  description:
    "Bilingual briefs, an AI read of every brief, guideline sites that build themselves, and a handoff that pays you back. Start free.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.9,
  blocks: [
    {
      kind: "hero",
      title: "From the first question to the final handoff.",
      lead: "Every project, from the client's brief to a live hub they own. And every project on one board.",
      buttons: [CTA.firstProject],
    },
    {
      kind: "prose",
      title: "More tools. Less time.",
      body: [
        "The brief lives in one tool, the references in another, the guide in a third, and the handoff is a zip file. The real time goes in moving between them.",
      ],
    },
    {
      kind: "numbered",
      eyebrow: "In order",
      title: "What matters to a studio, in order.",
      items: [
        {
          title: "Studio board",
          body: ["Every project, every stage, at a glance."],
          cta: LINK.projects,
          feature: "studio-board",
        },
        {
          title: "Brief and analysis",
          body: ["Find the contradictions before you design. The first analysis is free."],
          cta: LINK.analysis,
          feature: "brief-analysis",
        },
        {
          title: "Guideline site",
          body: ["Days of layout, in a few clicks."],
          cta: LINK.guidelineSites,
          feature: "auto-compose",
        },
        {
          title: "Handoff",
          body: ["Your client owns the brand. You earn as they grow."],
          cta: LINK.handoff,
          feature: "handoff",
        },
        {
          title: "Team and sign-off",
          body: ["Roles for your team. Sign-off from your client."],
          cta: LINK.projects,
          feature: "roles-approvals",
        },
        {
          title: "Moodboards",
          body: ["References that turn into colours. And a live board with your client."],
          feature: "whiteboard",
        },
        {
          title: "Both languages",
          body: ["One guide in two languages, not two guides."],
          cta: LINK.arabic,
        },
        {
          title: "The client's voice",
          body: [
            "Set up their voice and terms before handoff, and sell it as a service.",
          ],
          cta: LINK.brandVoice,
          feature: "voice-profile",
        },
      ],
    },
    {
      kind: "prose",
      title: "Hand over a brand, not a folder.",
      body: [
        "Your client gets a hub with their name on it, and you keep the role you agreed. When they upgrade, you get 20% of what they pay in their first year, as credit on your plan.",
      ],
      links: [LINK.handoff],
    },
    {
      kind: "table",
      numeric: true,
      head: [{ text: "Clients on the Brand plan" }, { text: "You earn a month" }],
      rows: [
        [{ text: "5" }, { text: "$24, your whole Pro plan" }],
        [{ text: "12" }, { text: "$57.60" }],
      ],
    },
    {
      kind: "table",
      title: "One project free. Three on Pro. Ten with a team.",
      numeric: true,
      head: [{ text: "" }, { text: "Free" }, { text: "Pro" }, { text: "Studio" }],
      rows: [
        [{ text: "Price" }, { text: "$0" }, { text: "$24/mo" }, { text: "$59/mo" }],
        [{ text: "Active projects" }, { text: "1" }, { text: "3" }, { text: "10" }],
        [{ text: "Seats" }, { text: "1" }, { text: "1" }, { text: "5" }],
      ],
      note: "Handed-off projects don't count. An Agency plan with 30 projects is coming.",
    },
    {
      kind: "faq",
      title: "Questions",
      items: [
        {
          q: "Does it replace our CRM?",
          a: "No. Proposals and invoices stay in your tools.",
        },
        {
          q: "What if the identity is already done?",
          a: "Start at file intake.",
        },
        {
          q: "Does my client see the references?",
          a: "Only what you share.",
        },
      ],
    },
    {
      kind: "cta",
      title: "Leave your mark. Make it last.",
      buttons: [CTA.firstProject],
      links: [LINK.pricing],
    },
  ],
};

/* ── Page 3 · Freelance designers ───────────────────────────────────────── */

const freelancers: PageDoc = {
  path: "/solutions/freelancers",
  shortTitle: "For freelancers",
  title: "Markyos for Freelance Designers · Work Alone, Show Up as a Team",
  description:
    "A strategist's read on every client, guidelines without the layout work, and a handoff that matches your work. Your first project is free.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.9,
  blocks: [
    {
      kind: "hero",
      title: "Work alone. Show up as a team.",
      lead: "Markyos gives you what studios have: a strategist's read on every client, a guide without hours of layout, and a handoff your client talks about.",
      buttons: [CTA.firstProject],
    },
    {
      kind: "prose",
      title: "Five jobs. One person.",
      body: [
        "You're the strategist, the designer, the layout artist, the project manager and the account manager. The hours nobody pays for eat more than the identity does.",
      ],
    },
    {
      kind: "numbered",
      eyebrow: "When it's just you",
      title: "What makes the difference when it's just you.",
      items: [
        {
          title: "AI brief analysis",
          body: ["A strategist beside you on every project. The first one is free."],
          cta: LINK.analysis,
          feature: "brief-analysis",
        },
        {
          title: "Guideline site",
          body: ["The unpaid hours, gone."],
          cta: LINK.guidelineSites,
          feature: "auto-compose",
        },
        {
          title: "Handoff",
          body: ["The moment your client remembers, and refers you from."],
          cta: LINK.handoff,
          feature: "handoff",
        },
        {
          title: "Discovery forms",
          body: ["A first impression with your logo on it, not a generic form."],
          cta: LINK.discovery,
          feature: "discovery-forms",
        },
        {
          title: "Project Pass",
          body: ["One more project for $19, when it comes in."],
          cta: LINK.seePricing,
        },
        {
          title: "Partner reward",
          body: ["Five clients cover your plan."],
          cta: LINK.handoff,
          feature: "partner-reward",
        },
        {
          title: "Both languages",
          body: ["A polished Arabic guide, where others stumble."],
          cta: LINK.arabic,
        },
      ],
    },
    {
      kind: "table",
      title: "Pay when the work comes.",
      numeric: true,
      head: [{ text: "" }, { text: "Free" }, { text: "Project Pass" }, { text: "Pro" }],
      rows: [
        [{ text: "Price" }, { text: "$0" }, { text: "$19 once" }, { text: "$24/mo" }],
        [
          { text: "Fits" },
          { text: "Your first project" },
          { text: "One extra project" },
          { text: "Three clients at once" },
        ],
      ],
    },
    {
      kind: "faq",
      title: "Questions",
      items: [
        {
          q: "A full project free, really?",
          a: "Yes, from brief to handoff, with a small badge on the hub.",
        },
        {
          q: "Does my client need an account?",
          a: "Only when they take over the hub.",
        },
        {
          q: "And if I grow into a team?",
          a: "Move to the Studio plan. Your projects come with you.",
        },
      ],
    },
    {
      kind: "cta",
      title: "Your next project, at studio level.",
      buttons: [CTA.firstProject],
      links: [LINK.pricing],
    },
  ],
};

/* ── Page 4 · Companies ─────────────────────────────────────────────────── */

const companies: PageDoc = {
  path: "/solutions/companies",
  shortTitle: "For companies",
  title: "Markyos for Companies · On Brand, On Time, In Both Languages",
  description:
    "One hub for your brand's files, guidelines and voice, a tone checker that knows you, and unlimited viewers. Start free.",
  breadcrumbs: SOLUTION_TRAIL,
  priority: 0.9,
  blocks: [
    {
      kind: "hero",
      title: "On brand. On time. In both languages.",
      lead: "One hub for your brand's files, guidelines and voice, used by everyone in the company. So you stop being the person who gets asked everything.",
      buttons: [CTA.setupBrand],
    },
    {
      kind: "prose",
      title: "Every question lands on your desk.",
      body: [
        "“Where's the transparent logo?” “Does this sound like us?” “What's the product called in Arabic?” You answer them every week, and the content still comes out in different voices.",
      ],
    },
    {
      kind: "numbered",
      eyebrow: "What your company needs",
      title: "One company. One voice.",
      items: [
        {
          title: "Asset library",
          body: ["One right version of every file."],
          cta: LINK.brandHub,
          feature: "brand-kit-intake",
        },
        {
          title: "Tone checker",
          body: ["Know in seconds if it sounds like you."],
          cta: LINK.toneChecker,
          feature: "tone-checker",
        },
        {
          title: "Viewers and sharing",
          body: ["A few change it. Everyone uses it, free."],
          cta: LINK.rollout,
          feature: "company-free-plan",
        },
        {
          title: "Brand voice",
          body: ["Arabic and English say the same thing."],
          cta: LINK.brandVoice,
          feature: "voice-profile",
        },
        {
          title: "Leadership alignment",
          body: ["See where your leaders disagree, before the campaign."],
          cta: LINK.leadership,
          feature: "stakeholder-workshop",
        },
        {
          title: "Department playbooks",
          body: ["A voice for each team, from the same voice."],
          feature: "department-playbooks",
        },
        {
          title: "Ask the Brand",
          body: ["Your team asks the hub, not you."],
          feature: "ask-the-brand",
        },
        {
          title: "AI Connector",
          body: ["ChatGPT and Claude read your brand before they write."],
          feature: "ai-connector",
        },
      ],
    },
    {
      kind: "table",
      title: "Start where your brand is today.",
      head: [{ text: "If you have" }, { text: "Start here" }],
      rows: [
        [{ text: "Brand files" }, { text: "Drop them in, and the hub builds from them." }],
        [
          { text: "A logo and colours, nothing written" },
          { text: "Start with the leadership questionnaire." },
        ],
        [{ text: "A studio you work with" }, { text: "Invite them to set it up." }],
      ],
    },
    {
      kind: "table",
      title: "Pay for who edits it. Not who uses it.",
      numeric: true,
      head: [{ text: "" }, { text: "Free" }, { text: "Brand" }, { text: "Team" }],
      rows: [
        [{ text: "Price" }, { text: "$0" }, { text: "$24/mo" }, { text: "$59/mo" }],
        [{ text: "Editors" }, { text: "2" }, { text: "5" }, { text: "15" }],
        [{ text: "Viewers" }, { text: "25" }, { text: "Unlimited" }, { text: "Unlimited" }],
      ],
    },
    {
      kind: "faq",
      title: "Questions",
      items: [
        {
          q: "Do we pay for everyone?",
          a: "No. Viewers are free on paid plans.",
        },
        {
          q: "What happens to the text we check?",
          a: "It isn't kept, unless you choose to save it.",
        },
        {
          q: "We have more than one brand.",
          a: "The Team plan includes three.",
        },
      ],
    },
    {
      /*
       * The tagline closes this page instead of the slogan — Part B's rule
       * is that nothing here implies a studio is needed, and the slogan
       * ("Build the brand. Hand it over.") implies exactly that.
       */
      kind: "cta",
      title: "At home in both languages.",
      buttons: [CTA.setupBrand],
      links: [LINK.pricing],
    },
  ],
};

export const audiencePages: PageDoc[] = [hub, studios, freelancers, companies];
