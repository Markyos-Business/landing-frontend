import { currentPricingPage } from "../../current-pricing.ts";
import type { PageDoc } from "../types";
import { CTA, HOME, LINK } from "./_shared";

/** Prices and copy reflect the current per-brand checkout, shared with the homepage. */

const pricing = currentPricingPage("en");

const roadmap: PageDoc = {
  path: "/roadmap",
  shortTitle: "Roadmap",
  title: "Roadmap · Markyos",
  description:
    "What's built and what's next in Markyos, without dates, and the four things it will never build.",
  breadcrumbs: [HOME],
  priority: 0.6,
  blocks: [
    {
      kind: "hero",
      title: "What's built. What's next.",
      lead: "What we're building has no dates here, because we'd rather be honest than promise.",
    },
      /*
       * Two columns, not four seasons.
       *
       * Copy deck v4.1 Part D Page 2 replaced the season ladder with "what
       * is live at launch" and "what is coming soon", and dropped every
       * date from the second one. Two things forced it.
       *
       * The first is that the seasons had become a list of promises with
       * quarters attached, which is the one thing src/lib/status.ts exists
       * to keep off this site: a chip that names a quarter is wrong for the
       * whole site the moment one release slips. The roadmap was the last
       * page still naming them.
       *
       * The second is that a third of the entries no longer exist. v4.1
       * removed the live board, campaigns, email signatures, Word and PDF
       * checks, Figma sync, templates, sub-brands, webhooks, the API and
       * the Agency and Business plans from the product, so the ladder was
       * promising nine things nobody is building.
       *
       * The dates have not gone into hiding: each feature's `shipsIn` in
       * status.ts still carries its release for our own reference. They are
       * simply not said to a visitor as a commitment.
       */
    {
      kind: "steps",
      /* Not "what ships when" any more: the columns no longer answer
         "when", and a heading that asks the question the section has
         stopped answering is worse than no heading. */
      title: "Where things stand.",
      items: [
        {
          title: "Live at launch, February 2027",
          body: "Forms and AI analysis · strategy and the strategy assistant · asset library · guideline sites and section copy · mockup builder · handoff and partner reward · studio board · brand voice and tone checker · leadership alignment · Ask the Brand · the AI Connector · viewers and partner links.",
        },
        {
          title: "Coming soon",
          body: "Moodboards · art direction from Brand Brain · department playbooks · a Chrome extension · turning an old PDF guide into a hub · brand health · download tracking on partner links · reviews and approvals · design checks · the Enterprise plan.",
        },
      ],
      note: "No dates here. Each one arrives when it is real, and appears in What's new the day it does.",
    },
    {
      kind: "terms",
      title: "What we won't build, on purpose.",
      cols: 2,
      items: [
        { term: "A CRM", body: "Proposals and invoices stay in your tools." },
        { term: "A design tool", body: "Design where you like." },
        { term: "AI-drawn logos", body: "The design is yours." },
        { term: "A general form builder", body: "Ours asks brand questions." },
      ],
    },
    {
      kind: "cta",
      title: "Tell us what's missing.",
      buttons: [CTA.suggestFeature],
      links: [LINK.whatsNew],
    },
  ],
};

/* ── Page 3 · What's new ────────────────────────────────────────────────── */

const whatsNew: PageDoc = {
  path: "/whats-new",
  shortTitle: "What's new",
  title: "What's New in Markyos",
  description: "Every update in a line: what changed, and why it matters to you.",
  breadcrumbs: [HOME],
  priority: 0.6,
  blocks: [
    {
      kind: "hero",
      title: "What's new.",
      lead: "Every update in a line: what changed, and why it matters to you.",
    },
    {
      kind: "prose",
      body: [
        "Each entry publishes on the day its feature ships, not before. The roadmap is where the seasons are.",
      ],
      links: [LINK.roadmap],
    },
  ],
};

/* ── Page 4 · Security ──────────────────────────────────────────────────── */

const security: PageDoc = {
  path: "/security",
  shortTitle: "Security",
  title: "Security and Privacy · Markyos",
  description:
    "How we protect your files and your words, who can see what, and what the AI inside Markyos never does.",
  breadcrumbs: [HOME],
  priority: 0.6,
  blocks: [
    {
      kind: "hero",
      title: "Your brand is yours. So are your words.",
      lead: "How we protect your files and your words, and what we never do with them.",
    },
    {
      kind: "terms",
      title: "Files",
      cols: 2,
      items: [
        {
          term: "Nothing is public until you publish",
          body: "And what's published is a fixed snapshot.",
        },
        { term: "Links you can revoke", body: "On a date or with a click." },
        { term: "A password", body: "For the published hub, on paid plans." },
        { term: "Inspiration images stay private", body: "Always." },
        {
          term: "Stored on Cloudflare R2",
          body: "And a managed Postgres database.",
        },
      ],
    },
    {
      kind: "terms",
      title: "Who sees what",
      cols: 2,
      items: [
        {
          term: "Permissions on the server",
          body: "A viewer can't change anything, however they try.",
        },
        { term: "Clients are guests", body: "They see only what you share." },
        {
          term: "A collaborating studio",
          body: "Sees only the brand it was invited to, and loses access the moment the collaboration ends.",
        },
      ],
    },
    {
      kind: "terms",
      title: "Your words and AI",
      cols: 2,
      items: [
        {
          term: "The tone checker doesn't keep your text",
          body: "Unless you save it, and then for 30 days.",
        },
        { term: "The AI runs only when you ask", body: "Never on its own." },
        { term: "It can't act", body: "It doesn't publish, send or delete." },
        {
          term: "Form answers are read as text",
          body: "Not as instructions.",
        },
      ],
    },
    {
      kind: "callout",
      title: "Connected AI tools",
      body: [
        "They only read, and never change anything. They see what you see, in the brands you choose. The workspace owner decides who can connect, or turns it off. What your AI tool reads goes to its provider, under your own terms with them.",
      ],
      feature: "ai-connector",
    },
    {
      kind: "prose",
      title: "Account and payment",
      body: [
        "Payments go through Stripe, and we never see your card number. Passwords are hashed, and repeated sign-in attempts are limited.",
      ],
    },
    {
      kind: "cta",
      title: "Found something? Tell us.",
      lead: "Write to us and we'll reply.",
      buttons: [CTA.security],
      links: [LINK.privacy],
    },
  ],
};

export const pricingPages: PageDoc[] = [pricing, roadmap, whatsNew, security];
