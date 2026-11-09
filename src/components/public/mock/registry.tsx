import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { BrandHub } from "./BrandHub";
import { DraftsPanel } from "./DraftsPanel";
import { GuidelinesBuilder } from "./GuidelinesBuilder";
import { HandoffCard } from "./HandoffCard";
import { LeadershipMock } from "./LeadershipMock";
import { ProjectBoard } from "./ProjectBoard";
import { SeatsPanel } from "./SeatsPanel";
import { ToneResult } from "./ToneResult";
import { VoiceMock } from "./VoiceMock";

/*
 * Every picture of the product, by name.
 *
 * ── Why a registry ───────────────────────────────────────────────────────
 *
 * The nine pages under /solutions are data, not components — see the note at
 * the top of `content/pages/types.ts` — and until now that meant they could
 * not show the product at all. Each of them argues for one feature for two
 * thousand words and never showed it once, while the homepage, which argues
 * for all nine in a paragraph each, showed six of them. The page that has
 * already convinced somebody to click "how does the tone checker work" is
 * the page that most needs to answer it with a picture.
 *
 * A content file cannot import a component, so it names one. This is the
 * same indirection `Icon.tsx` uses for glyphs and for the same reason: the
 * content layer stays serialisable and the component layer stays free to
 * change what the picture is made of.
 *
 * ── Why they are not screenshots ─────────────────────────────────────────
 *
 * The reason BrandHub.tsx gives, now nine times over: a screenshot of an
 * Arabic interface is an image of text — unsearchable, unselectable, shaped
 * by whatever font the designer had, and stale the day the product moves a
 * button. These are markup, so the Arabic is real Arabic with `lang` on it,
 * they weigh nothing, and they re-theme with the rest of the site.
 *
 * ── The three new ones ───────────────────────────────────────────────────
 *
 * Six of these already existed and were only ever used on the homepage.
 * `projects`, `handoff` and `seats` are new, built for the three solution
 * pages that had no picture to point at. They follow the same rules as the
 * six: the product's own direction inside, no mirroring of window furniture,
 * nothing below 12px, and every word of interface in `content/mocks.ts`.
 */
export type MockName =
  /** The brand hub, in Arabic — assets, guideline, strategy in one place. */
  | "brandHub"
  /** The guideline site building itself from the project's own content. */
  | "guidelines"
  /** What the AI brief analysis hands back. */
  | "drafts"
  /** Four leaders answered alone; two of them disagree. */
  | "leadership"
  /** A customer-service reply, graded. */
  | "tone"
  /** The voice profile: traits, register per channel, one approved term. */
  | "voice"
  /** The studio board: every client project by stage. */
  | "projects"
  /** The moment the client takes ownership and the studio keeps a role. */
  | "handoff"
  /** Who is paid for and who is free. */
  | "seats";

export const MOCKS: Record<MockName, (props: { locale: Locale }) => ReactNode> = {
  // Every mock takes the locale now. The two oldest — the hub and the
  // guidelines builder — were pinned to Arabic in both editions until
  // 8 Nov 2026, when copy v3 asked for the English window in English.
  brandHub: ({ locale }) => <BrandHub locale={locale} />,
  guidelines: ({ locale }) => <GuidelinesBuilder locale={locale} />,
  drafts: ({ locale }) => <DraftsPanel locale={locale} />,
  leadership: ({ locale }) => <LeadershipMock locale={locale} />,
  tone: ({ locale }) => <ToneResult locale={locale} />,
  voice: ({ locale }) => <VoiceMock locale={locale} />,
  projects: ({ locale }) => <ProjectBoard locale={locale} />,
  handoff: ({ locale }) => <HandoffCard locale={locale} />,
  seats: ({ locale }) => <SeatsPanel locale={locale} />,
};
