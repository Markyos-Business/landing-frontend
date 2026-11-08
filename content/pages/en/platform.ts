import type { PageDoc } from "../types";
import { CTA, FORK, HOME, LINK, PLATFORM } from "./_shared";

/*
 * Platform — the hub, and the Arabic page.
 *
 * Site Copy v3 (English), Part C, pages 1 and 3.
 *
 * Part C describes fifteen feature pages. Nine of them exist on this site
 * under /solutions with their own pages, and the hub's tables point there.
 * The six that have no page of their own — Brand Brain, the strategy hub,
 * moodboards, discovery forms as a page of its own, and so on — are named
 * here without a link rather than linked to a 404.
 */

/* ── Page 1 · Platform hub ──────────────────────────────────────────────── */

const hub: PageDoc = {
  path: "/platform",
  shortTitle: "Platform",
  title: "Platform · Every Markyos Feature",
  description:
    "Forms, strategy, boards, files, guidelines, handoff, voice, and an AI that knows your brand. One platform, two languages.",
  breadcrumbs: [HOME],
  priority: 0.9,
  blocks: [
    {
      kind: "hero",
      eyebrow: "Every asset. Every instruction. Both directions.",
      title: "Create. Deliver. Run.",
      lead: "Everything a brand needs, in one platform, and every part feeds the next.",
    },
    {
      kind: "terms",
      eyebrow: "Create",
      title: "Discover the brand. Build its guide.",
      cols: 2,
      items: [
        { term: "Discovery forms", body: "Better questions, from one link." },
        { term: "AI brief analysis", body: "What your client said, and didn't." },
        { term: "Strategy hub", body: "Strategy you use, not file." },
        { term: "Moodboards", body: "From reference to decision." },
        { term: "Asset library", body: "One right version of every file." },
        { term: "Guideline site", body: "A guide people actually open." },
      ],
    },
    {
      kind: "terms",
      eyebrow: "Deliver",
      title: "It moves, whole, to its owner.",
      cols: 2,
      items: [
        { term: "Studio board", body: "Every project, at a glance." },
        { term: "Handoff", body: "A living brand, for its owner." },
      ],
    },
    {
      kind: "terms",
      eyebrow: "Run",
      title: "It lives in everything the company writes.",
      cols: 2,
      items: [
        { term: "Brand voice", body: "Two languages. One voice." },
        { term: "Tone checker", body: "Your brand, word for word." },
        { term: "Leadership alignment", body: "Many views. One brand." },
        { term: "Viewers and sharing", body: "A few change it. Everyone uses it." },
      ],
    },
    {
      kind: "cards",
      eyebrow: "Where to start",
      title: "Nine of them have a page of their own.",
      cols: 3,
      items: [
        {
          title: "Every project in one place",
          icon: "layers",
          body: "The project path, and a board by stage.",
          cta: LINK.projects,
        },
        {
          title: "The brief, and a read of it",
          icon: "form",
          body: "Bilingual questions, and the contradictions in the answers.",
          cta: LINK.discovery,
        },
        {
          title: "A guide that builds itself",
          icon: "fileAlt",
          body: "Sixteen sections, from the project's own files.",
          cta: LINK.guidelineSites,
        },
        {
          title: "Handoff",
          icon: "key",
          body: "Your client owns the hub. You keep your role.",
          cta: LINK.handoff,
        },
        {
          title: "The brand's home",
          icon: "building",
          body: "Files, guidelines and voice, in one place.",
          cta: LINK.brandHub,
        },
        {
          title: "Brand voice and terms",
          icon: "comments",
          body: "One voice, and an approved word for each key term.",
          cta: LINK.brandVoice,
        },
        {
          title: "The tone checker",
          icon: "check",
          body: "Know in seconds if it sounds like you.",
          cta: LINK.toneChecker,
        },
        {
          title: "Leadership alignment",
          icon: "users",
          body: "See where your leaders disagree, before the campaign.",
          cta: LINK.leadership,
        },
        {
          title: "The whole company",
          icon: "user",
          body: "A few edit it. Everyone else uses it, free.",
          cta: LINK.rollout,
        },
      ],
    },
    {
      kind: "callout",
      title: "It reads before it writes.",
      body: ["Brand Brain is the AI inside Markyos, and it sees your whole brand."],
    },
    {
      kind: "terms",
      title: "Four principles. No exceptions.",
      cols: 2,
      items: [
        {
          term: "Arabic isn't a translation",
          body: "The platform was built on both languages together.",
        },
        {
          term: "The AI suggests. People decide",
          body: "And it never draws a logo.",
        },
        {
          term: "One version of everything",
          body: "Pages point to files; they never copy them.",
        },
        {
          term: "What you see is what's enforced",
          body: "Permissions live on the server, not only on screen.",
        },
      ],
    },
    {
      kind: "terms",
      title: "What we don't do, plainly.",
      cols: 1,
      items: [
        { term: "Not a design tool", body: "Design where you like." },
        { term: "Not a CRM", body: "Proposals and invoices stay in your tools." },
        {
          term: "Not a general writing tool",
          body: "It checks against your brand's voice.",
        },
      ],
    },
    {
      kind: "cta",
      title: "Create. Deliver. Run.",
      buttons: FORK,
      links: [LINK.pricing],
    },
  ],
};

/* ── Page 3 · Built in Arabic ───────────────────────────────────────────── */

const arabic: PageDoc = {
  path: "/platform/arabic",
  shortTitle: "Built in Arabic",
  title: "An Arabic-First Brand Platform · Markyos",
  description:
    "An interface that fully mirrors, logos and type in both scripts, and a voice that understands Arabic register.",
  breadcrumbs: [HOME, PLATFORM],
  priority: 0.8,
  blocks: [
    {
      kind: "hero",
      title: "Both directions. One brand.",
      lead: "Markyos didn't learn Arabic later. It was built on it, alongside English, as equals.",
    },
    {
      kind: "terms",
      title: "Six proofs. Not one promise.",
      cols: 2,
      items: [
        {
          term: "The whole interface mirrors",
          body: "Menus, arrows, layouts and the project path.",
        },
        {
          term: "An Arabic logo and a Latin one",
          body: "Each with its own slot and clear space.",
        },
        {
          term: "Type in both scripts",
          body: "Side by side, with Arabic support checked at intake.",
        },
        {
          term: "Written, not translated",
          body: "Brief questions and guideline copy were written in both languages.",
        },
        {
          term: "Arabic, by register",
          body: "Standard Arabic and dialects, set per channel.",
        },
        {
          term: "Terms that stay put",
          body: "An approved translation for every key word.",
        },
      ],
    },
    {
      /*
       * Part C's note on this block: many English readers are in Southeast
       * Asia, or pick up Gulf clients later. It tells them the Arabic
       * strength costs them nothing today, which is the objection that
       * otherwise closes the page.
       */
      kind: "prose",
      title: "English today. Arabic when you're ready.",
      body: [
        "Markyos works in English alone. And the day your brand needs Arabic, nothing has to be rebuilt: the slots, the type pairs and the term base are already there.",
      ],
      emphasiseLast: true,
    },
    {
      kind: "cta",
      title: "Finally, a platform that doesn't treat Arabic as a guest.",
      buttons: [CTA.startFree],
      links: [LINK.platform],
    },
  ],
};

export const platformPages: PageDoc[] = [hub, arabic];
