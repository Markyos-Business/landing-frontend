import type { PageDoc } from "../types";
import { CTA, HOME, LINK } from "./_shared";

/*
 * Resources, About and Contact.
 *
 * Site Copy v3 (English), Part E page 1 and Part D pages 5 and 6.
 *
 * The three compare pages the Arabic set carries as hand-written page copy
 * are not here: /compare is a CMS section now, with ten written
 * comparisons behind it in both languages. See docs/DESIGN.md, "The written
 * resources arrived".
 */

/* ── Resources ──────────────────────────────────────────────────────────── */

const resources: PageDoc = {
  path: "/resources",
  shortTitle: "Resources",
  title: "Resources · Markyos",
  description:
    "Practical writing on building bilingual brands, free templates, a help centre, and honest comparisons.",
  breadcrumbs: [HOME],
  priority: 0.7,
  blocks: [
    {
      kind: "hero",
      title: "How brands are built. And how they last.",
      lead: "Articles, guides and free templates. In English and Arabic.",
    },
    {
      kind: "cards",
      eyebrow: "Where to go",
      title: "Five places to start.",
      cols: 3,
      items: [
        {
          title: "Blog",
          icon: "penSquare",
          body: "Ideas on strategy, identity and voice.",
          cta: { label: "Read the blog", href: "/blog" },
        },
        {
          title: "Guides and templates",
          icon: "form",
          body: "Take it today. Use it on your next project.",
          cta: { label: "Browse the guides", href: "/guides" },
        },
        {
          title: "Help centre",
          icon: "comments",
          body: "Every step in Markyos, explained.",
          cta: { label: "Open the help centre", href: "/help" },
        },
        {
          title: "Compare",
          icon: "grid",
          body: "Markyos next to what you use today, honestly.",
          cta: { label: "See the comparisons", href: "/compare" },
        },
        {
          title: "What's new",
          icon: "rocket",
          body: "What we added, and why.",
          cta: { label: "Read what's new", href: "/whats-new" },
        },
      ],
    },
    {
      kind: "callout",
      title: "Your brand strategy on one page.",
      body: ["A free template, with an example for every field."],
      cta: { label: "Read the guide", href: "/guides/brand-strategy-one-page" },
    },
    {
      kind: "signup",
      title: "One email a month. One idea worth it.",
      placeholder: "Your email",
      submit: "Subscribe",
      note: "No noise. Unsubscribe any time.",
      topic: "newsletter",
    },
  ],
};

/* ── About ──────────────────────────────────────────────────────────────── */

const about: PageDoc = {
  path: "/about",
  shortTitle: "About",
  title: "About · Markyos",
  description:
    "Markyos didn't start as a startup idea. It started with a problem that came back on every project.",
  breadcrumbs: [HOME],
  priority: 0.6,
  blocks: [
    {
      kind: "hero",
      title: "Built from inside the problem.",
      lead: "Markyos didn't start as a startup idea. It started with a problem that came back on every project.",
    },
    {
      /*
       * [CONFIRM] in the deck: Abdullah to rewrite in his own voice, first
       * person, short. Kept as drafted so the page is whole, and carried
       * into docs/copy/RESOURCES-TODO.md so it is not published as ours.
       */
      kind: "prose",
      eyebrow: "The story",
      body: [
        "I've designed brands and built their strategies since 2019. Every time, the brand went out as a file, then drifted within a year. Arabic was always the weakest part, because every tool was built for English first. So I built the place I'd wanted on every project.",
        "— Abdullah Saeedan, Founder and CEO",
      ],
    },
    {
      kind: "terms",
      title: "Five beliefs. One brand.",
      cols: 2,
      items: [
        { term: "A brand is a place", body: "Not a file." },
        { term: "Arabic is a first language", body: "Not a translation." },
        { term: "The AI suggests", body: "People decide." },
        { term: "When the client wins", body: "The studio wins." },
        { term: "We say what we've built", body: "And what we won't." },
      ],
    },
    {
      kind: "terms",
      title: "The team",
      cols: 2,
      items: [
        {
          term: "Abdullah Saeedan",
          body: "Founder and CEO. Product, experience, design and front end.",
        },
        {
          term: "Engineering and platform",
          body: "A partner, joining before launch.",
        },
      ],
    },
    {
      kind: "cta",
      title: "Leave your mark. Make it last.",
      buttons: [CTA.startFree],
      links: [LINK.contact],
    },
  ],
};

/* ── Contact ────────────────────────────────────────────────────────────── */

const contact: PageDoc = {
  path: "/contact",
  shortTitle: "Contact",
  title: "Contact · Markyos",
  description: "A small team that reads every message. Sales, support, press and security.",
  breadcrumbs: [HOME],
  priority: 0.5,
  blocks: [
    {
      kind: "hero",
      title: "Talk to us.",
      lead: "A small team that reads every message.",
    },
    {
      kind: "terms",
      title: "What's it about?",
      cols: 2,
      items: [
        {
          term: "Sales and Enterprise",
          body: "For plans, contracts and larger organisations.",
          cta: CTA.enterprise,
        },
        {
          term: "Support",
          body: "Try the help centre first — most answers are there.",
          cta: LINK.help,
        },
        {
          term: "Studio partnerships",
          body: "For studios that want to work closely with us.",
          cta: { label: "Talk partnerships", href: "/contact?topic=studios" },
        },
        {
          term: "Press",
          body: "For journalists and media.",
          cta: { label: "Press enquiries", href: "/contact?topic=press" },
        },
        {
          term: "Security",
          body: "To report a vulnerability.",
          cta: CTA.security,
        },
        {
          term: "Suggest a feature",
          body: "We read every one.",
          cta: CTA.suggestFeature,
        },
      ],
    },
    {
      kind: "signup",
      title: "Send us a message.",
      lead: "Tell us what you need and we'll come back to you.",
      placeholder: "Work email",
      submit: "Send",
      note: "We reply to every message.",
      topic: "contact",
    },
  ],
};

export const resourcePages: PageDoc[] = [resources, about, contact];
