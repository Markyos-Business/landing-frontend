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
    "What's built, what's next and what's after: the seasons Markyos ships in, and the four things it will never build.",
  breadcrumbs: [HOME],
  priority: 0.6,
  blocks: [
    {
      kind: "hero",
      title: "What's built. What's next. What's after.",
      lead: "We write seasons, not dates, because we'd rather be honest than promise.",
    },
    {
      kind: "steps",
      eyebrow: "The seasons",
      title: "What ships when.",
      items: [
        {
          title: "Live · launch, February 2027",
          body: "For studios: forms and AI analysis · Strategy hub · moodboards · Asset library · guideline sites in 8 looks · handoff and partner reward · studio board. For companies: brand voice and tone checker · leadership alignment · viewers and partner links · invite your studio.",
        },
        {
          title: "Spring 2027 · Explore together",
          body: "A live board with your client · live brand elements · art direction · department playbooks · campaigns · email signatures.",
        },
        {
          title: "Mid 2027 · Think, ask, present",
          body: "Ask the Brand · strategy assistant and brainstorm · the AI Connector · Word and PDF checks · converting an old PDF guide · section copy · templates.",
        },
        {
          title: "Later in 2027 · Run a whole brand team",
          body: "Reviews and approvals · brand health · Chrome extension · design checks · sub-brands · Figma · webhooks · API · Agency, Business and Enterprise plans · SSO.",
        },
      ],
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
