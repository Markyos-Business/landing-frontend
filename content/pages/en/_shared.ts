import type { Cta } from "../../types";
import type { Breadcrumb } from "../types";

/*
 * Shared pieces of the English page set.
 *
 * The English counterpart of `../ar/_shared.ts`, and deliberately the same
 * shape: the same breadcrumb roots, the same button keys, the same link
 * keys. A page that reads `CTA.firstProject` should not have to know which
 * language it is in.
 *
 * The labels come from Site Copy v3 (English), 8 Nov 2026. They are written
 * for English readers, not translated from the Arabic line by line — the
 * Arabic «ابدأ مشروعك الأول مجاناً» and "Start your first project free" are
 * the same promise in each language's own rhythm.
 *
 * The hrefs are identical to the Arabic set on purpose. `/start` belongs to
 * the product app and is locale-switched there; a second set of English
 * hrefs here would be two lists to keep in step, and the one that drifts is
 * always the one nobody is looking at.
 */

export const HOME: Breadcrumb = { label: "Home", href: "/" };
export const SOLUTIONS: Breadcrumb = { label: "Solutions", href: "/solutions" };
export const RESOURCES: Breadcrumb = { label: "Resources", href: "/resources" };
export const COMPARE: Breadcrumb = { label: "Compare", href: "/compare" };
export const PLATFORM: Breadcrumb = { label: "Platform", href: "/platform" };

/** The trail every page under Solutions carries. */
export const SOLUTION_TRAIL: Breadcrumb[] = [HOME, SOLUTIONS];

export const CTA = {
  /** The hero fork. These two are always equal weight and always together. */
  studio: { label: "I make brands for clients", href: "/start?type=studio" } satisfies Cta,
  company: { label: "I run my company's brand", href: "/start?type=company" } satisfies Cta,

  startFree: { label: "Start free", href: "/start" } satisfies Cta,
  firstProject: { label: "Start your first project free", href: "/start?type=studio" } satisfies Cta,
  setupBrand: { label: "Set up your brand free", href: "/start?type=company" } satisfies Cta,
  setupVoice: { label: "Set up your brand voice free", href: "/start?type=company" } satisfies Cta,
  firstCheck: { label: "Try your first check free", href: "/start?type=company" } satisfies Cta,
  firstBrief: { label: "Send your first brief free", href: "/start?type=studio" } satisfies Cta,
  firstGuide: { label: "Build your first guide free", href: "/start?type=studio" } satisfies Cta,
  firstWorkshop: {
    label: "Start the leadership questionnaire free",
    href: "/start?type=company",
  } satisfies Cta,
  fullProject: { label: "Try a full project free", href: "/start?type=studio" } satisfies Cta,
  convertPdf: { label: "Turn your guide into a live hub, free", href: "/start" } satisfies Cta,
  enterprise: { label: "Talk to us", href: "/contact?topic=sales" } satisfies Cta,
  suggestFeature: { label: "Suggest a feature", href: "/contact?topic=feature" } satisfies Cta,
  support: { label: "Message support", href: "/contact?topic=support" } satisfies Cta,
  security: { label: "Ask about security", href: "/contact?topic=security" } satisfies Cta,
} as const;

/*
 * Cross-links between pages, so a renamed route is one edit.
 *
 * Each one is an action — verb first, two or three words — and different
 * from any heading it sits under. The reasoning is in the Arabic file and
 * applies here unchanged: a link that repeats the heading above it adds
 * nothing but a colour. The names that are genuinely destinations — the
 * help centre, the legal pages, "About" — stay names, because naming the
 * place *is* the useful thing there.
 */
export const LINK = {
  pricing: { label: "Compare all plans", href: "/pricing" } satisfies Cta,
  seePricing: { label: "See pricing", href: "/pricing" } satisfies Cta,
  arabic: { label: "Built in Arabic", href: "/platform/arabic" } satisfies Cta,
  security: { label: "Read about security", href: "/security" } satisfies Cta,
  privacy: { label: "Privacy policy", href: "/privacy" } satisfies Cta,
  terms: { label: "Terms", href: "/terms" } satisfies Cta,
  roadmap: { label: "See the roadmap", href: "/roadmap" } satisfies Cta,
  whatsNew: { label: "Read what's new", href: "/whats-new" } satisfies Cta,
  help: { label: "Help centre", href: "/help" } satisfies Cta,
  about: { label: "About us", href: "/about" } satisfies Cta,
  contact: { label: "Contact us", href: "/contact" } satisfies Cta,
  platform: { label: "Browse every feature", href: "/platform" } satisfies Cta,

  projects: { label: "Organise your client work", href: "/solutions/client-projects" } satisfies Cta,
  discovery: { label: "Try the smart brief", href: "/solutions/discovery" } satisfies Cta,
  analysis: { label: "See the AI analysis", href: "/solutions/discovery#analysis" } satisfies Cta,
  guidelineSites: {
    label: "Build a living guide",
    href: "/solutions/guideline-sites",
  } satisfies Cta,
  handoff: { label: "Hand the brand over", href: "/solutions/client-handoff" } satisfies Cta,
  brandHub: { label: "Build your brand's home", href: "/solutions/brand-hub" } satisfies Cta,
  toneChecker: { label: "Try the tone checker", href: "/solutions/tone-checker" } satisfies Cta,
  rollout: { label: "Bring the whole company in", href: "/solutions/company-rollout" } satisfies Cta,
  leadership: {
    label: "Compare your leaders' answers",
    href: "/solutions/leadership-alignment",
  } satisfies Cta,
  brandVoice: { label: "Settle your brand voice", href: "/solutions/brand-voice" } satisfies Cta,
  studios: { label: "For studios", href: "/solutions/studios" } satisfies Cta,
  freelancers: { label: "For freelancers", href: "/solutions/freelancers" } satisfies Cta,
  companies: { label: "For companies", href: "/solutions/companies" } satisfies Cta,
} as const;

/**
 * The two-button fork, which closes most pages.
 *
 * The identity-based labels belong in the hero and the final CTA because
 * they match the sign-up fork word for word.
 */
export const FORK: Cta[] = [CTA.studio, CTA.company];
