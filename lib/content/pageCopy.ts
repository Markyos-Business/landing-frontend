import "server-only";
import type { DeepPartial, SiteCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";
import { getCopyFor } from "@/lib/i18n/dictionary";
import { deepMerge } from "@/lib/i18n/merge";
import { payloadClient, safeRead } from "./payloadClient";

/*
 * Page copy, with CMS overrides on top.
 *
 * ── The layering ────────────────────────────────────────────────────────────
 *
 *   content/en/index.ts        approved copy, in git, complete
 *          ↓  (Arabic overrides from content/ar/overrides.ts)
 *   the locale dictionary      complete in both languages, English fallback
 *          ↓  (this file: CMS overrides from the `homepage` global)
 *   what the page renders
 *
 * Each layer only *overrides*. Nothing is ever replaced wholesale, so an
 * empty CMS is invisible and a half-filled one is partially applied. That is
 * what makes the homepage safe to put behind an editor: there is no state of
 * the database that produces a blank page.
 *
 * ── Why the shapes have to be translated ────────────────────────────────────
 *
 * Payload stores arrays as rows of objects with their own ids, and a field
 * left empty comes back as `null` or `""` rather than absent. `deepMerge`
 * treats `undefined` as "not provided" but would happily write an empty
 * string over good copy — so `clean()` strips the empties before merging.
 * Without it, opening the homepage global in the admin and saving it without
 * typing anything would blank the hero.
 */

type Dict = Record<string, unknown>;

const isObject = (v: unknown): v is Dict =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/*
 * Payload generates precise interfaces for every global and collection, which
 * is exactly what you want at a call site that names fields — and exactly what
 * gets in the way here, where the whole job is to walk an unknown shape and
 * keep only what an editor filled in. Going through `unknown` is the honest
 * way to say "treat this as data"; `as Dict` alone is a cast TypeScript is
 * right to reject.
 */
const asDict = (v: unknown): Dict => (v ?? {}) as Dict;

/**
 * Drop everything the editor has not actually filled in.
 *
 * Removes `null`, `undefined`, empty strings, empty arrays, Payload's row
 * `id`/`blockType` bookkeeping, and any object left empty afterwards — so what
 * survives is only what somebody typed.
 */
function clean(value: unknown): unknown {
  if (Array.isArray(value)) {
    const rows = value.map(clean).filter((v) => v !== undefined);
    return rows.length > 0 ? rows : undefined;
  }
  if (isObject(value)) {
    const out: Dict = {};
    for (const [key, raw] of Object.entries(value)) {
      if (key === "id" || key === "blockType" || key === "blockName") continue;
      const cleaned = clean(raw);
      if (cleaned !== undefined) out[key] = cleaned;
    }
    return Object.keys(out).length > 0 ? out : undefined;
  }
  if (typeof value === "string") return value.trim() === "" ? undefined : value;
  if (value === null) return undefined;
  return value;
}

/** Unwrap Payload's `[{ text: "..." }]` rows into `["..."]`. */
const unwrap = (rows: unknown, key: string): string[] | undefined => {
  if (!Array.isArray(rows)) return undefined;
  const out = rows
    .map((row) => (isObject(row) ? row[key] : undefined))
    .filter((v): v is string => typeof v === "string" && v.trim() !== "");
  return out.length > 0 ? out : undefined;
};

/**
 * Map the CMS global onto the copy contract.
 *
 * Explicit rather than clever. The admin's field names are chosen for the
 * person editing ("Pain cards"), the code's are chosen for the person
 * reading the template (`problem.cards`), and a generic deep-merge of the two
 * would couple them — renaming a field for clarity in the admin would quietly
 * stop it reaching the page.
 */
function toOverrides(g: Dict): DeepPartial<SiteCopy> {
  const home: Dict = {};
  const pick = (k: string) => clean(g[k]) as Dict | undefined;

  const hero = pick("hero");
  const heroCtas = pick("heroCtas") as
    | { studioLabel?: string; companyLabel?: string; microcopy?: string }
    | undefined;
  if (hero || heroCtas) {
    home.hero = {
      ...hero,
      ...(heroCtas?.studioLabel ? { studioCta: { label: heroCtas.studioLabel } } : {}),
      ...(heroCtas?.companyLabel ? { companyCta: { label: heroCtas.companyLabel } } : {}),
      ...(heroCtas?.microcopy ? { microcopy: heroCtas.microcopy } : {}),
    };
  }

  const facts = unwrap(g.proofStrip, "fact");
  if (facts) home.proofStrip = { facts };

  const glimpse = pick("productGlimpse");
  if (glimpse) {
    home.productGlimpse = { ...glimpse, body: unwrap(glimpse.body, "text") };
  }

  const problem = pick("problem");
  const problemCards = clean(g.problemCards);
  const transition = clean(g.problemTransition);
  if (problem || problemCards || transition) {
    home.problem = {
      ...problem,
      ...(problem?.body ? { body: unwrap(problem.body, "text") } : {}),
      ...(problemCards ? { cards: problemCards } : {}),
      ...(transition ? { transition } : {}),
    };
  }

  const shift = pick("shift");
  if (shift) home.shift = { ...shift, body: unwrap(shift.body, "text") };

  const choosePath = pick("choosePath");
  if (choosePath) home.choosePath = choosePath;

  const studioPath = pick("studioPath");
  const studioSteps = clean(g.studioSteps);
  if (studioPath || studioSteps) {
    home.studioPath = { ...studioPath, ...(studioSteps ? { steps: studioSteps } : {}) };
  }

  const handoff = pick("handoffLoop");
  if (handoff) home.handoffLoop = { ...handoff, body: unwrap(handoff.body, "text") };

  const company = pick("company");
  if (company) home.company = company;

  const tone = pick("toneChecker");
  const toneBody = clean(g.toneCheckerBody);
  const toneOutputs = clean(g.toneCheckerOutputs);
  const tonePrivacy = clean(g.toneCheckerPrivacy);
  if (tone || toneBody || toneOutputs || tonePrivacy) {
    home.toneChecker = {
      ...tone,
      ...(toneBody ? { body: toneBody } : {}),
      ...(toneOutputs ? { outputs: toneOutputs } : {}),
      ...(tonePrivacy ? { privacy: tonePrivacy } : {}),
    };
  }

  const pillars = pick("pillars");
  const pillarsBody = clean(g.pillarsBody);
  const pillarItems = clean(g.pillarItems);
  if (pillars || pillarsBody || pillarItems) {
    home.pillars = {
      ...pillars,
      ...(pillarsBody ? { body: pillarsBody } : {}),
      ...(pillarItems ? { pillars: pillarItems } : {}),
    };
  }

  const bilingual = pick("bilingual");
  const bilingualBody = clean(g.bilingualBody);
  const bilingualPoints = clean(g.bilingualPoints);
  if (bilingual || bilingualBody || bilingualPoints) {
    home.bilingual = {
      ...bilingual,
      ...(bilingualBody ? { body: bilingualBody } : {}),
      ...(bilingualPoints ? { points: bilingualPoints } : {}),
    };
  }

  const ai = pick("aiRules");
  const aiBody = clean(g.aiRulesBody);
  const aiPromises = clean(g.aiPromises);
  if (ai || aiBody || aiPromises) {
    home.aiRules = {
      ...ai,
      ...(aiBody ? { body: aiBody } : {}),
      ...(aiPromises ? { promises: aiPromises } : {}),
    };
  }

  const stack = pick("replaceStack");
  const stackRows = clean(g.replaceStackRows);
  const stackLine = clean(g.replaceStackLine);
  if (stack || stackRows || stackLine) {
    home.replaceStack = {
      ...stack,
      ...(stackRows ? { rows: stackRows } : {}),
      ...(stackLine ? { line: stackLine } : {}),
    };
  }

  const coming = pick("comingNext");
  const phasesRaw = clean(g.roadmapPhases);
  const phases = Array.isArray(phasesRaw)
    ? phasesRaw.map((p) =>
        isObject(p) ? { ...p, items: unwrap(p.items, "text") ?? [] } : p,
      )
    : undefined;
  if (coming || phases) {
    home.comingNext = { ...coming, ...(phases ? { phases } : {}) };
  }

  const pricing = pick("pricingTeaser");
  const pricingNotes = pick("pricingNotes");
  if (pricing || pricingNotes) {
    home.pricingTeaser = { ...pricing, ...pricingNotes };
  }

  const founder = pick("founderNote");
  const signature = clean(g.founderSignature);
  if (founder || signature) {
    home.founderNote = {
      ...founder,
      ...(founder?.body ? { body: unwrap(founder.body, "text") } : {}),
      ...(signature ? { signature } : {}),
    };
  }

  const faq = pick("faq");
  const faqItems = clean(g.faqItems);
  if (faq || faqItems) {
    home.faq = { ...faq, ...(faqItems ? { items: faqItems } : {}) };
  }

  const finalCta = pick("finalCta");
  const finalButtons = pick("finalCtaButtons") as
    | { studioLabel?: string; companyLabel?: string; microcopy?: string }
    | undefined;
  if (finalCta || finalButtons) {
    home.finalCta = {
      ...finalCta,
      ...(finalButtons?.studioLabel ? { studioCta: { label: finalButtons.studioLabel } } : {}),
      ...(finalButtons?.companyLabel ? { companyCta: { label: finalButtons.companyLabel } } : {}),
      ...(finalButtons?.microcopy ? { microcopy: finalButtons.microcopy } : {}),
    };
  }

  return (Object.keys(home).length > 0 ? { home } : {}) as DeepPartial<SiteCopy>;
}

/** Nav and announcement overrides, which live in their own globals. */
function chromeOverrides(nav: Dict | null, ann: Dict | null): DeepPartial<SiteCopy> {
  const out: Dict = {};

  const header = clean(nav?.header);
  const footerColumns = clean(nav?.footerColumns);
  const footerLine = clean(nav?.footerLine);

  if (header) out.nav = { items: header };
  if (footerColumns || footerLine) {
    out.footer = {
      ...(footerColumns ? { columns: footerColumns } : {}),
      ...(footerLine ? { line: footerLine } : {}),
    };
  }

  const mapBar = (group: unknown) => {
    const g = clean(group) as
      | { text?: string; ctaLabel?: string; ctaHref?: string }
      | undefined;
    if (!g) return undefined;
    return {
      ...(g.text ? { text: g.text } : {}),
      ...(g.ctaLabel || g.ctaHref
        ? { cta: { ...(g.ctaLabel ? { label: g.ctaLabel } : {}), ...(g.ctaHref ? { href: g.ctaHref } : {}) } }
        : {}),
    };
  };

  const beta = mapBar(ann?.beta);
  const live = mapBar(ann?.live);
  if (beta || live) {
    out.announcement = { ...(beta ? { beta } : {}), ...(live ? { live } : {}) };
  }

  return out as DeepPartial<SiteCopy>;
}

/**
 * The copy a page should render: git copy, with CMS overrides applied.
 *
 * This is what pages call instead of `getCopyFor`.
 */
export async function getSiteCopy(locale: Locale): Promise<SiteCopy> {
  const base = await getCopyFor(locale);

  return safeRead(
    `page copy (${locale})`,
    async () => {
      const payload = await payloadClient();

      /*
       * `fallbackLocale: false` is the important argument here, and it is the
       * opposite of what the CMS does everywhere else.
       *
       * Payload is configured with `fallback: true`, so an empty Arabic field
       * returns the English one. For an article that is right — an
       * untranslated post should read in English rather than be blank.
       *
       * For page copy it is actively wrong. The Arabic homepage already has
       * approved transcreations in `content/ar/overrides.ts`, and those are
       * *better* than the English. With fallback on, editing the English
       * headline in the admin silently replaced the Arabic transcreation on
       * the Arabic page — an English line, in Latin script, on the page whose
       * entire argument is that Arabic is not an afterthought.
       *
       * Turning it off makes the layering mean what it should:
       *
       *     CMS Arabic  →  git Arabic  →  git English
       *
       * An Arabic field edited in the admin wins. One left empty falls
       * through to the approved transcreation, and only then to English.
       */
      const localeOpts = { locale, fallbackLocale: false as const, depth: 1 };

      const [homepage, navigation, announcement] = await Promise.all([
        payload.findGlobal({ slug: "homepage", ...localeOpts }),
        payload.findGlobal({ slug: "navigation", ...localeOpts }),
        payload.findGlobal({ slug: "announcement", ...localeOpts }),
      ]);

      const announcementEnabled = !announcement || asDict(announcement).enabled !== false;

      let merged = deepMerge(base, toOverrides(asDict(homepage)));
      merged = deepMerge(
        merged,
        chromeOverrides(
          navigation ? asDict(navigation) : null,
          announcementEnabled && announcement ? asDict(announcement) : null,
        ),
      );

      return merged;
    },
    base,
  );
}
