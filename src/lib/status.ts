import { isBeta } from "./launch";

/*
 * The honesty layer.
 *
 * Copy doc §3 lists every feature the site names, with its real build status,
 * so "the chips are right on launch day and can be updated as phases ship".
 * That table is the source of truth and this file is it, in code — because a
 * table in a document and a chip in a component drift the moment one of them
 * is edited, and the direction they drift is always the same: the page keeps
 * promising something that slipped.
 *
 * A section never writes a chip label. It names a feature id and asks for the
 * chip, so moving a feature from "coming" to "current" is one edit here and
 * every mention of it across the site updates at once. Same principle as the
 * platform's token contract: one emitter, many consumers.
 */

/** Where a feature stands today, per roadmap Rev 3.2. */
export type BuildStatus =
  /** Built and in the prototype — no chip, ever. */
  | "current"
  /** Real by public launch (15 Feb 2027) — no chip once launched. */
  | "mvp"
  /** After launch. Always chipped, and the chip never names a date. */
  | "coming";

/**
 * Chip labels are keys, not strings.
 *
 * The site is bilingual, so the label has to come out of the copy dictionary
 * for the locale being rendered. Resolving a key keeps the Arabic chip from
 * being an English string with Arabic around it.
 *
 * ── Why neither key names a date (7 Nov 2026) ─────────────────────────────
 *
 * There used to be three, and all three were dates: `comingSpring2027`,
 * `coming2027`, `arrivingFeb2027`. A chip that names a quarter is a promise
 * with a deadline on it, and the one thing certain about a roadmap is that
 * some of it slips — at which point every chip on the site is wrong at once
 * and the honesty layer is doing the opposite of its job. "Coming soon"
 * cannot go stale.
 *
 * The real dates did not disappear; they were never only in the chip. Each
 * feature's `shipsIn` still carries its release, the roadmap section still
 * names its three phases in order, and the roadmap page still dates them.
 * A visitor who wants to know when still finds out — on the page that exists
 * to tell them, not in a pill beside a feature name.
 */
export type ChipKey = "comingSoon" | "arrivingSoon";

export type Feature = {
  /** Stable id used by section components. Never renamed. */
  id: string;
  /** What §3 calls it, for traceability back to the doc. */
  label: string;
  status: BuildStatus;
  /**
   * The release that carries it, for the roadmap page and our own reference.
   *
   * This is where the dates live now. It is not rendered as a chip — see
   * ChipKey — so it can stay as precise as we actually are.
   */
  shipsIn: string;
};

export const FEATURES = [
  // ── Current: built today ────────────────────────────────────────────────
  { id: "bilingual-rtl", label: "Native Arabic/English, RTL", status: "current", shipsIn: "Prototype" },
  { id: "guideline-templates", label: "Guideline templates (6 templates, 8 looks)", status: "current", shipsIn: "Prototype" },
  { id: "auto-sections", label: "16 sections that build themselves, 19 layouts, builder", status: "current", shipsIn: "Prototype" },
  { id: "strategy-hub", label: "Strategy Hub", status: "current", shipsIn: "Prototype" },
  { id: "visual-identity", label: "Visual identity: Arabic and Latin logo slots, palette, Type Lab", status: "current", shipsIn: "Prototype" },
  { id: "moodboard", label: "Moodboard with colour extraction from real pixels", status: "current", shipsIn: "Prototype" },
  { id: "discovery-forms", label: "Discovery forms (Brief): 3 templates, client link, no account", status: "current", shipsIn: "Prototype" },
  { id: "department-pages", label: "Department pages (publishable, import from .docx/PDF)", status: "current", shipsIn: "Prototype" },
  { id: "drafts-queue", label: "Drafts queue with provenance", status: "current", shipsIn: "Prototype" },
  { id: "roles-approvals", label: "Roles, approval requests, sign-off pins", status: "current", shipsIn: "Prototype, server in v1.0" },
  { id: "domains", label: "Password protection, custom subdomain and domain", status: "current", shipsIn: "Prototype, server in v1.0" },
  { id: "studio-board", label: "Studio board (all projects by stage)", status: "current", shipsIn: "Prototype" },
  { id: "colour-checks", label: "Colour checks and copy linter", status: "current", shipsIn: "Prototype (partial)" },

  // ── MVP: real by public launch. Chipped only while in beta. ─────────────
  { id: "publishing", label: "Hubs open on any device, publishing, share links", status: "mvp", shipsIn: "MVP (Nov 2026)" },
  { id: "workspaces", label: "Studio and Company workspaces, sign-up fork", status: "mvp", shipsIn: "v1.0 (Dec 2026)" },
  { id: "brand-kit-intake", label: "Brand Kit Intake (drop a zip, files sorted)", status: "mvp", shipsIn: "v1.0" },
  { id: "auto-compose", label: "Auto-compose (pick a template, site assembles)", status: "mvp", shipsIn: "v1.0" },
  { id: "handoff", label: "Handoff (client owns the hub, studio keeps a role)", status: "mvp", shipsIn: "v1.0" },
  { id: "company-free-plan", label: "Company Free plan, editors and free viewers", status: "mvp", shipsIn: "v1.0" },
  { id: "invite-studio", label: "Invite your studio, partner links", status: "mvp", shipsIn: "v1.0" },
  { id: "partner-reward", label: "Partner reward (20% back as credit)", status: "mvp", shipsIn: "v1.0 to v2.0" },
  { id: "question-library", label: "Discovery forms: question library, 4 new types, show/hide logic", status: "mvp", shipsIn: "v2.0 (Feb 2027)" },
  { id: "call-notes", label: "Call notes", status: "mvp", shipsIn: "v2.0" },
  { id: "brief-analysis", label: "AI Brief Analysis (first one free per project)", status: "mvp", shipsIn: "v2.0" },
  { id: "voice-profile", label: "Voice profile and bilingual term base", status: "mvp", shipsIn: "v2.0" },
  { id: "tone-checker", label: "Tone checker: quick, deep, rewrite, translate in brand voice", status: "mvp", shipsIn: "v2.0" },
  // Before-you-publish item 7: if this slips past launch, move it to
  // "coming" and it chips itself. Confirm at launch.
  { id: "stakeholder-workshop", label: "Stakeholder workshop and alignment report", status: "mvp", shipsIn: "v2.0, or first 2 weeks after launch" },

  // ── Coming: always chipped, and the chip never names a date ────────────
  { id: "whiteboard", label: "Real-time whiteboard, client guest links", status: "coming", shipsIn: "v3.0 (Feb to May 2027)" },
  { id: "board-shapes", label: "Brand-aware board shapes, AI art direction", status: "coming", shipsIn: "v3.0" },
  { id: "department-playbooks", label: "Department playbooks (voice dial, key messages)", status: "coming", shipsIn: "v3.0" },
  { id: "initiatives", label: "Initiatives (campaigns, launches inside a brand)", status: "coming", shipsIn: "v3.0" },
  { id: "email-signatures", label: "Email signature generator", status: "coming", shipsIn: "v3.0" },
  { id: "strategy-ai", label: "Strategy AI assistant, Brainstorm", status: "coming", shipsIn: "v4.0 (May to Aug 2027)" },
  { id: "ask-the-brand", label: "Ask the Brand", status: "coming", shipsIn: "v4.0" },
  { id: "document-checks", label: "Document tone checks, PDF guideline import with AI", status: "coming", shipsIn: "v4.0" },
  { id: "ai-connector", label: "AI connector: point ChatGPT or Claude at the real brand, read-only", status: "coming", shipsIn: "v4.0" },
  { id: "templates-kit", label: "Brand templates kit and mockups", status: "coming", shipsIn: "v4.0" },
  { id: "brand-health", label: "Review requests, brand health dashboard", status: "coming", shipsIn: "v5.0 (Aug to Oct 2027)" },
  { id: "integrations", label: "Chrome extension, brand architecture, Figma sync, API, SSO", status: "coming", shipsIn: "v5.0" },

  /*
   * Named separately from the buckets above because the subpages cite them
   * one at a time.
   *
   * `integrations` is a v5.0 shopping list, which was fine while only the
   * homepage's roadmap section named it. The solution, platform and pricing
   * pages each point at a single item of it — the Agency plan's button, the
   * download audit on a partner link, SSO in the enterprise row — and a chip
   * has to be able to disappear when *that* item ships, not when the last
   * thing in a bucket of eleven does.
   */
  { id: "pdf-import", label: "Read an existing PDF guideline and draft sections from it", status: "coming", shipsIn: "v4.0" },
  { id: "ai-section-copy", label: "AI drafts for guideline section copy", status: "coming", shipsIn: "v4.0" },
  { id: "webhooks", label: "Studio board webhooks", status: "coming", shipsIn: "v5.0" },
  { id: "chrome-extension", label: "Chrome extension: review content anywhere", status: "coming", shipsIn: "v5.0" },
  { id: "figma-sync", label: "Figma sync, then Canva and Framer", status: "coming", shipsIn: "v5.0" },
  { id: "sub-brands", label: "Sub-brands that inherit from a parent brand", status: "coming", shipsIn: "v5.0" },
  { id: "download-audit", label: "Partner links: who downloaded what", status: "coming", shipsIn: "v5.0" },
  { id: "sso", label: "SSO, SAML, SCIM, audit logs, compliance export", status: "coming", shipsIn: "v5.0" },
  { id: "agency-plan", label: "Agency plan: 30 active projects, studio-branded portal", status: "coming", shipsIn: "v5.0" },
  { id: "business-plan", label: "Business plan", status: "coming", shipsIn: "v5.0" },
  { id: "api", label: "Public API", status: "coming", shipsIn: "v5.0" },
] as const satisfies readonly Feature[];

export type FeatureId = (typeof FEATURES)[number]["id"];

const BY_ID = new Map<string, Feature>(FEATURES.map((f) => [f.id, f as Feature]));

export function feature(id: FeatureId): Feature {
  const found = BY_ID.get(id);
  // A section naming a feature that is not in §3 is the exact failure the
  // honesty layer exists to prevent, so it fails loudly at render rather than
  // quietly rendering an unchipped promise.
  if (!found) {
    throw new Error(`Unknown feature id "${id}" — add it to FEATURES in src/lib/status.ts`);
  }
  return found;
}

/**
 * Which chip (if any) a feature carries right now.
 *
 * - `current` never carries one.
 * - `coming` always carries one.
 * - `mvp` carries one only before launch, because until then it genuinely is
 *   not there yet.
 */
export function chipFor(id: FeatureId): ChipKey | null {
  const f = feature(id);
  if (f.status === "coming") return "comingSoon";
  if (f.status === "mvp" && isBeta) return "arrivingSoon";
  return null;
}
