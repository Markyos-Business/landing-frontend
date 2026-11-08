import type { PageDoc } from "../types";
import { CTA, FORK, HOME, LINK } from "./_shared";

/*
 * Pricing, the roadmap, security and what's new.
 *
 * Site Copy v3 (English), Part D, pages 1 to 4.
 *
 * Every figure here is written, never computed, and every one of them is
 * the deck's. Where the deck marks a plan as not yet sold — Agency,
 * Business — the card carries a status chip instead of a button, so the
 * page cannot sell something that does not exist.
 */

/* ── Page 1 · Pricing ───────────────────────────────────────────────────── */

const pricing: PageDoc = {
  path: "/pricing",
  shortTitle: "Pricing",
  title: "Pricing · Markyos",
  description:
    "Start free. Studios pay by active project, companies by editor, and viewers are free.",
  breadcrumbs: [HOME],
  priority: 0.9,
  blocks: [
    {
      kind: "hero",
      title: "Start free. Pay as you grow.",
      lead: "Studios pay for the projects they're working on now. Companies pay for the people who edit the brand, not the people who use it.",
    },
    {
      kind: "audience",
      id: "plans",
      label: "Who are you",
      options: [
        {
          id: "studios",
          label: "For studios and freelancers",
          blocks: [
            {
              kind: "plans",
              title: "You pay for what you're working on now.",
              recommendedLabel: "Recommended",
              billing: { label: "Billing", monthly: "Monthly", annual: "Yearly" },
              plans: [
                {
                  name: "Free",
                  price: "$0",
                  who: "Your first project, in full",
                  rows: [
                    { label: "Active projects", value: "1" },
                    { label: "Seats", value: "1" },
                    { label: "Guideline looks", value: "2" },
                    { label: "Storage", value: "2 GB" },
                  ],
                  cta: { label: "Start free", href: "/start?type=studio" },
                },
                {
                  name: "Pro",
                  price: "$24",
                  period: "a month",
                  annual: { price: "$19", note: "billed yearly" },
                  who: "A freelancer with several clients",
                  recommended: true,
                  rows: [
                    { label: "Active projects", value: "3", strong: true },
                    { label: "Seats", value: "1" },
                    { label: "Monthly credits", value: "500" },
                    { label: "Guideline looks", value: "All 8" },
                  ],
                  cta: { label: "Start Pro", href: "/start?type=studio&plan=pro" },
                },
                {
                  name: "Studio",
                  price: "$59",
                  period: "a month",
                  annual: { price: "$49", note: "billed yearly" },
                  who: "A studio with a team",
                  rows: [
                    { label: "Active projects", value: "10", strong: true },
                    { label: "Seats", value: "5" },
                    { label: "Monthly credits", value: "1,500" },
                    { label: "Custom domain", value: "Yes" },
                  ],
                  cta: { label: "Start Studio", href: "/start?type=studio&plan=studio" },
                },
                {
                  name: "Agency",
                  price: "$149",
                  period: "a month",
                  annual: { price: "$119", note: "billed yearly" },
                  who: "For larger agencies",
                  feature: "agency-plan",
                  rows: [
                    { label: "Active projects", value: "30", strong: true },
                    { label: "Seats", value: "15" },
                    { label: "Monthly credits", value: "4,000" },
                    { label: "Partner reward", value: "25%" },
                  ],
                },
              ],
              note: "Handed-off projects don't count. The slot frees up the moment your client takes over the hub.",
            },
            {
              kind: "table",
              title: "The full comparison",
              numeric: true,
              head: [
                "",
                { text: "Free" },
                { text: "Pro" },
                { text: "Studio" },
                { text: "Agency" },
              ],
              rows: [
                ["New projects per 30 days", "3", "∞", "∞", "∞"],
                ["Seats", "1", "1", "5", "15"],
                ["Extra seat", "—", "—", "$8/mo", "$8/mo"],
                ["Client guests", "∞", "∞", "∞", "∞"],
                ["Forms and responses", "∞", "∞", "∞", "∞"],
                ["First analysis per project", "Free", "Free", "Free", "Free"],
                ["Monthly credits", "—", "500", "1,500", "4,000"],
                ["Quick tone checks, for client setup", "10", "100", "300", "1,000"],
                ["Boards per project", "3", "∞", "∞", "∞"],
                ["Guideline looks", "2", "8", "8", "8"],
                [
                  "Hub before handoff",
                  "Markyos link and badge",
                  "No badge, password",
                  "+ custom domain",
                  "+ white-label portal",
                ],
                ["Partner reward", "20%", "20%", "20%", "25%"],
                ["Storage", "2 GB", "50 GB", "250 GB", "500 GB"],
                ["Version history", "7 days", "90 days", "1 year", "1 year"],
                [
                  "Support",
                  "Help centre",
                  "Email",
                  "Priority email",
                  "Priority + onboarding call",
                ],
              ],
            },
          ],
        },
        {
          id: "companies",
          label: "For companies",
          blocks: [
            {
              kind: "plans",
              title: "You pay for who edits the brand.",
              recommendedLabel: "Recommended",
              billing: { label: "Billing", monthly: "Monthly", annual: "Yearly" },
              plans: [
                {
                  name: "Free",
                  price: "$0",
                  who: "Build your hub and try it",
                  rows: [
                    { label: "Editors", value: "2" },
                    { label: "Viewers", value: "25" },
                    { label: "Quick checks a month", value: "25" },
                    { label: "Storage", value: "2 GB" },
                  ],
                  cta: { label: "Start free", href: "/start?type=company" },
                },
                {
                  name: "Brand",
                  price: "$24",
                  period: "a month",
                  annual: { price: "$19", note: "billed yearly" },
                  who: "Your whole company on brand",
                  recommended: true,
                  rows: [
                    { label: "Editors", value: "5" },
                    { label: "Viewers", value: "Unlimited", strong: true },
                    { label: "Quick checks a month", value: "1,000" },
                    { label: "Custom domain", value: "Yes" },
                  ],
                  cta: { label: "Start Brand", href: "/start?type=company&plan=brand" },
                },
                {
                  name: "Team",
                  price: "$59",
                  period: "a month",
                  annual: { price: "$49", note: "billed yearly" },
                  who: "Several brands, bigger teams",
                  rows: [
                    { label: "Editors", value: "15" },
                    { label: "Viewers", value: "Unlimited" },
                    { label: "Brands", value: "3", strong: true },
                    { label: "Quick checks a month", value: "3,000" },
                  ],
                  cta: { label: "Start Team", href: "/start?type=company&plan=team" },
                },
                {
                  name: "Enterprise",
                  price: "From $299",
                  period: "a month",
                  who: "Large organisations",
                  rows: [
                    { label: "Editors", value: "Unlimited" },
                    { label: "Brands", value: "Unlimited" },
                    { label: "SSO and audit logs", value: "Yes" },
                    { label: "Support", value: "SLA" },
                  ],
                  cta: CTA.enterprise,
                },
              ],
              note: "Viewers are free on every paid plan.",
            },
            {
              kind: "table",
              title: "The full comparison",
              numeric: true,
              head: [
                "",
                { text: "Free" },
                { text: "Brand" },
                { text: "Team" },
                { text: "Business" },
                { text: "Enterprise" },
              ],
              rows: [
                ["Brands", "1", "1", "3", "10", "∞"],
                ["Editors", "2", "5", "15", "40", "∞"],
                ["Viewers", "25", "∞", "∞", "∞", "∞"],
                ["Extra editor", "—", "—", "$8/mo", "$8/mo", "Included"],
                ["Studio collaborators per brand", "1", "1", "3", "10", "∞"],
                [
                  "Voice and term base",
                  "✓",
                  "✓",
                  "+ per channel and team",
                  "+ per sub-brand",
                  "✓",
                ],
                ["Quick checks a month", "25", "1,000", "3,000", "6,000", "Custom"],
                ["Monthly credits", "—", "150", "500", "1,500", "Custom"],
                [
                  "First alignment report per brand",
                  "Free",
                  "Free",
                  "Free",
                  "Free",
                  "Free",
                ],
                ["Guideline looks", "2", "8", "8", "8", "8"],
                [
                  "Domain and badge",
                  "Markyos link and badge",
                  "Custom domain, no badge",
                  "3 domains",
                  "10 domains",
                  "∞",
                ],
                ["SSO and audit logs", "—", "—", "—", "—", "✓"],
                ["Storage", "2 GB", "25 GB", "100 GB", "500 GB", "Custom"],
                ["Version history", "7 days", "90 days", "1 year", "1 year", "∞"],
                [
                  "Support",
                  "Help centre",
                  "Email",
                  "Priority email",
                  "Priority + onboarding",
                  "SLA",
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      kind: "prose",
      title: "The studio builds. The client owns. The return keeps coming.",
      body: [
        "Handoff is free, and the hub stays live on the client's free plan. When the client upgrades, the studio gets 20% of their first year, as credit.",
      ],
      links: [LINK.handoff],
    },
    {
      kind: "table",
      title: "One-time purchases",
      head: [{ text: "" }, { text: "Price" }, { text: "What you get" }],
      rows: [
        [
          "Project Pass",
          "$19",
          "One extra active project with Pro features and 100 credits, until handoff or six months. Doesn't include the AI Connector.",
        ],
        ["Credit pack", "$15", "500 credits, valid for 12 months."],
        [
          "Client's first year",
          "$190",
          "A year of the Brand plan for your client, instead of $228.",
        ],
        ["Extra editor or seat", "$8/mo", "On Studio, Agency, Team and Business."],
      ],
    },
    {
      kind: "table",
      title: "Credits you can see. No surprise bills.",
      numeric: true,
      head: [{ text: "Example" }, { text: "Credits" }],
      rows: [
        ["First analysis per project", "Free"],
        ["Analysis re-run", "15"],
        ["Deep check, rewrite or translate", "4"],
        ["Alignment report re-run", "20"],
      ],
      note: "If credits run out, the action stops and offers a pack. Monthly credits renew and don't roll over.",
    },
    {
      kind: "faq",
      id: "faq",
      title: "Questions. Short answers.",
      items: [
        {
          q: "What's an active project?",
          a: "One you can still edit. Hand it off or archive it, and it stops counting.",
        },
        {
          q: "Editor or viewer?",
          a: "Editors change the brand. Viewers browse, download and check their writing.",
        },
        {
          q: "A studio and a company workspace together?",
          a: "Yes, on one account. Everyone gets one free workspace of each type.",
        },
        {
          q: "What if my client never pays?",
          a: "The hub stays live and editable on the free plan.",
        },
        {
          q: "And if I cancel?",
          a: "Nothing is deleted. You go back to Free, and anything over the limit becomes read-only.",
        },
        {
          q: "Is Markyos a design tool?",
          a: "No. Design in Figma or Illustrator.",
        },
        { q: "Do I need a studio?", a: "No. A company can start on its own." },
        {
          q: "Does the AI design logos?",
          a: "Never. It reads and drafts words.",
        },
        {
          q: "Can I connect ChatGPT or Claude?",
          a: "Yes, on paid plans. It only reads, and uses no credits.",
          feature: "ai-connector",
        },
        {
          q: "Is the dashboard in English and Arabic?",
          a: "Yes. You pick your interface language; the brand has its own.",
        },
        {
          q: "Is my content safe?",
          a: "Nothing goes public until you publish it. There is more on the security page.",
        },
        {
          q: "How do I pay?",
          a: "By card through Stripe, in US dollars. Mada-only cards aren't supported yet.",
        },
        {
          q: "And beta pricing?",
          a: "Locked for 12 months after launch.",
        },
      ],
    },
    {
      kind: "cta",
      title: "Start free. Pay as you grow.",
      buttons: FORK,
      links: [LINK.security],
    },
  ],
};

/* ── Page 2 · Roadmap ───────────────────────────────────────────────────── */

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
