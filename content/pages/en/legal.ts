import type { PageDoc } from "../types";
import { HOME, LINK } from "./_shared";

/*
 * Privacy, Terms and Cookies.
 *
 * Site Copy v3 (English), Part E pages 8 to 10. Frames only: a lawyer
 * writes and reviews the full text before launch, and the deck writes only
 * the summary boxes. Every one of these is `noindex` for exactly that
 * reason — a legal page that ranks and then has nothing under the summary
 * is worse than one nobody finds.
 *
 * Part E's note, kept: the site's style does not apply to legal pages. The
 * summaries are plain, short and literal, with no sound play and no
 * rhythm — a reader here wants the fact, not the voice.
 */

const privacy: PageDoc = {
  path: "/privacy",
  shortTitle: "Privacy",
  title: "Privacy policy · Markyos",
  description: "What we collect, what we never do with it, and how to take your data out.",
  breadcrumbs: [HOME],
  noindex: true,
  priority: 0.3,
  blocks: [
    {
      kind: "hero",
      title: "Privacy policy",
      lead: "The short version is below. The full text is being written and reviewed before launch.",
    },
    {
      kind: "terms",
      title: "The short version",
      cols: 1,
      items: [
        {
          term: "We collect only what we need",
          body: "To run your account and your brand.",
        },
        {
          term: "Your files and brand content are yours",
          body: "We don't sell them or use them for ads.",
        },
        {
          term: "Text you check isn't kept",
          body: "Unless you save it, and then for 30 days.",
        },
        {
          term: "Nothing goes to the AI provider",
          body: "Unless you run an AI action yourself.",
        },
        {
          term: "You can leave with your data",
          body: "Export it or delete your account at any time.",
        },
      ],
      note: "This summary doesn't replace the full text.",
    },
    { kind: "cta", title: "Questions about your data?", links: [LINK.contact, LINK.security] },
  ],
};

const terms: PageDoc = {
  path: "/terms",
  shortTitle: "Terms",
  title: "Terms of service · Markyos",
  description: "Who owns what, what the AI is responsible for, and how subscriptions work.",
  breadcrumbs: [HOME],
  noindex: true,
  priority: 0.3,
  blocks: [
    {
      kind: "hero",
      title: "Terms of service",
      lead: "The short version is below. The full text is being written and reviewed before launch.",
    },
    {
      kind: "terms",
      title: "The short version",
      cols: 1,
      items: [
        {
          term: "Your brand and files are yours",
          body: "We host them so you can work on them.",
        },
        {
          term: "Handoff moves ownership",
          body: "When a studio hands off a hub, it becomes the client's.",
        },
        {
          term: "What the AI writes is a suggestion",
          body: "The decision, and responsibility for what you publish, are yours.",
        },
        {
          term: "Upload only what you may",
          body: "Especially fonts and images.",
        },
        {
          term: "Subscriptions renew automatically",
          body: "And you can cancel any time.",
        },
      ],
      note: "This summary doesn't replace the full text.",
    },
    { kind: "cta", title: "Questions about the terms?", links: [LINK.contact, LINK.privacy] },
  ],
};

const cookies: PageDoc = {
  path: "/cookies",
  shortTitle: "Cookies",
  title: "Cookies · Markyos",
  description: "The one cookie this site sets, and how visits are counted without cookies.",
  breadcrumbs: [HOME],
  noindex: true,
  priority: 0.3,
  blocks: [
    {
      kind: "hero",
      title: "Cookies",
      lead: "This site sets one cookie, and only if you rate a help article. Signing in happens in the app, and your language is part of the address.",
    },
    {
      kind: "terms",
      title: "The categories",
      cols: 2,
      items: [
        {
          term: "Help Center feedback",
          body: "An anonymous ID, set when you rate an article, so your vote counts once. Kept for a year.",
        },
        {
          term: "Visit counts",
          body: "Pages viewed, counted without cookies. Your IP address isn't stored, and nothing is counted when your browser sends Do Not Track or Global Privacy Control.",
        },
        { term: "Preferences", body: "None. Your language is in the address: / for Arabic, /en for English." },
        { term: "Marketing", body: "None." },
      ],
      note: "The app at app.markyos.com sets its own cookies to keep you signed in.",
    },
    { kind: "cta", title: "Questions about cookies?", links: [LINK.contact, LINK.privacy] },
  ],
};

export const legalPages: PageDoc[] = [privacy, terms, cookies];
