import type { Cta } from "../../types";
import type { Breadcrumb } from "../types";

/*
 * Shared pieces of the Arabic page set.
 *
 * Breadcrumb roots and the button library from the Arabic copy document §6.1.
 * Written once because these strings appear on twenty-odd pages: a CTA label
 * that is five words on one page and six on another is the kind of drift
 * nobody notices and everybody feels, and the labels have to match the
 * sign-up fork word for word (§6.2) or the click feels like it went somewhere
 * else.
 */

export const HOME: Breadcrumb = { label: "الرئيسية", href: "/" };
export const SOLUTIONS: Breadcrumb = { label: "الحلول", href: "/solutions" };
export const RESOURCES: Breadcrumb = { label: "الموارد", href: "/resources" };
export const COMPARE: Breadcrumb = { label: "المقارنات", href: "/compare" };
export const PLATFORM: Breadcrumb = { label: "المنصة", href: "/platform" };

/** The trail every page under الحلول carries, per Part 1 §0. */
export const SOLUTION_TRAIL: Breadcrumb[] = [HOME, SOLUTIONS];

export const CTA = {
  /** The hero fork. These two are always equal weight and always together. */
  studio: { label: "أصمّم هويات لعملائي", href: "/start?type=studio" } satisfies Cta,
  company: { label: "أدير علامة شركتي", href: "/start?type=company" } satisfies Cta,

  startFree: { label: "ابدأ مجاناً", href: "/start" } satisfies Cta,
  firstProject: { label: "ابدأ مشروعك الأول مجاناً", href: "/start?type=studio" } satisfies Cta,
  setupBrand: { label: "جهّز علامتك مجاناً", href: "/start?type=company" } satisfies Cta,
  setupVoice: { label: "جهّز صوت علامتك مجاناً", href: "/start?type=company" } satisfies Cta,
  firstCheck: { label: "جرّب أول مراجعة مجاناً", href: "/start?type=company" } satisfies Cta,
  firstBrief: { label: "أرسل أول استبيان مجاناً", href: "/start?type=studio" } satisfies Cta,
  firstGuide: { label: "ابنِ أول دليل مجاناً", href: "/start?type=studio" } satisfies Cta,
  firstWorkshop: { label: "ابدأ استبيان القيادة مجاناً", href: "/start?type=company" } satisfies Cta,
  fullProject: { label: "جرّب مشروعاً كاملاً مجاناً", href: "/start?type=studio" } satisfies Cta,
  convertPdf: { label: "حوّل دليلك إلى موقع حيّ مجاناً", href: "/start" } satisfies Cta,
  enterprise: { label: "تواصل معنا", href: "/contact?topic=sales" } satisfies Cta,
  suggestFeature: { label: "اقترح ميزة", href: "/contact?topic=feature" } satisfies Cta,
  support: { label: "راسل فريق الدعم", href: "/contact?topic=support" } satisfies Cta,
  security: { label: "تواصل بشأن الأمان", href: "/contact?topic=security" } satisfies Cta,
} as const;

/** Cross-links between pages, so a renamed route is one edit. */
export const LINK = {
  pricing: { label: "قارن كل الخطط", href: "/pricing" } satisfies Cta,
  seePricing: { label: "شاهد الأسعار", href: "/pricing" } satisfies Cta,
  arabic: { label: "بُنيت بالعربية", href: "/platform/arabic" } satisfies Cta,
  security: { label: "الأمان", href: "/security" } satisfies Cta,
  privacy: { label: "سياسة الخصوصية", href: "/privacy" } satisfies Cta,
  terms: { label: "الشروط", href: "/terms" } satisfies Cta,
  roadmap: { label: "خريطة الطريق", href: "/roadmap" } satisfies Cta,
  whatsNew: { label: "ما الجديد", href: "/whats-new" } satisfies Cta,
  help: { label: "مركز المساعدة", href: "/help" } satisfies Cta,
  about: { label: "من نحن", href: "/about" } satisfies Cta,
  contact: { label: "تواصل معنا", href: "/contact" } satisfies Cta,

  projects: { label: "كل مشروع في مكان واحد", href: "/solutions/client-projects" } satisfies Cta,
  discovery: { label: "الاستبيان والتحليل الذكي", href: "/solutions/discovery" } satisfies Cta,
  analysis: { label: "التحليل الذكي", href: "/solutions/discovery#analysis" } satisfies Cta,
  guidelineSites: {
    label: "مواقع دليل تبني نفسها",
    href: "/solutions/guideline-sites",
  } satisfies Cta,
  handoff: { label: "التسليم ومكافأة الشريك", href: "/solutions/client-handoff" } satisfies Cta,
  brandHub: { label: "بيت واحد لعلامتك", href: "/solutions/brand-hub" } satisfies Cta,
  toneChecker: { label: "مدقّق النبرة", href: "/solutions/tone-checker" } satisfies Cta,
  rollout: { label: "الشركة كلها، مجاناً", href: "/solutions/company-rollout" } satisfies Cta,
  leadership: {
    label: "وحّد رؤية القيادة",
    href: "/solutions/leadership-alignment",
  } satisfies Cta,
  brandVoice: { label: "صوت واحد باللغتين", href: "/solutions/brand-voice" } satisfies Cta,
  studios: { label: "حلول الاستوديوهات", href: "/solutions/studios" } satisfies Cta,
  freelancers: { label: "حلول المستقلين", href: "/solutions/freelancers" } satisfies Cta,
  companies: { label: "حلول الشركات", href: "/solutions/companies" } satisfies Cta,
} as const;

/**
 * The two-button fork, which closes most pages.
 *
 * §6.1: the identity-based labels belong in the hero and the final CTA
 * because they match the sign-up fork word for word.
 */
export const FORK: Cta[] = [CTA.studio, CTA.company];
