import { z } from "zod";
import { LOCALES } from "./i18n/locales";

/*
 * The contact form's contract.
 *
 * ── Why this is not another `topic` on the waitlist ────────────────────────
 *
 * `src/lib/waitlist.ts` already has a `"contact"` topic, and /contact already
 * used it: one email field, posted to `/api/waitlist`, which answers 501 on
 * purpose because nobody has decided where a mailing list lives. That is the
 * right answer for a mailing list and the wrong one for a message. An address
 * with no message attached is a lead to be stored and followed up; a message
 * is something a person wrote and expects an answer to, and it has somewhere
 * to go today — an inbox.
 *
 * So they stay separate contracts. The newsletter capture on /resources is
 * still the waitlist's, still honestly 501, and unaffected by this file.
 */

/**
 * What a message can be about.
 *
 * These are not invented here. Six of the seven are already in the site's
 * copy as `/contact?topic=…` links — `content/pages/{ar,en}/_shared.ts` and
 * the enterprise CTA in `content/current-pricing.ts` — and those links have
 * been landing on a form that had no topic field to receive them. `other` is
 * the seventh, for somebody who arrived at /contact by themselves.
 */
export const CONTACT_TOPICS = [
  "sales",
  "support",
  "studios",
  "press",
  "security",
  "feature",
  "other",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/** `?topic=` from the URL, or `other` when it is absent or not one of ours. */
export function topicFromParam(value: string | null | undefined): ContactTopic {
  return CONTACT_TOPICS.includes(value as ContactTopic) ? (value as ContactTopic) : "other";
}

/**
 * Who is writing.
 *
 * The same three the rest of the site is built around — the pricing plans,
 * the studio/company fork, the audience pages — plus `other`, because a
 * journalist is none of them and a form that forces them to claim to be a
 * studio has collected a wrong answer rather than no answer.
 *
 * Deliberately *not* imported from `content/current-pricing.ts`, which is the
 * one file `check:pricing` guards against the platform's billing contracts. A
 * contact form has no business widening that type's blast radius; if a fourth
 * plan ever appears, this list should be reconsidered on its own terms rather
 * than silently gaining an option.
 */
export const CONTACT_WHO = ["freelancer", "studio", "company", "other"] as const;

export type ContactWho = (typeof CONTACT_WHO)[number];

/*
 * An optional free-text field.
 *
 * The transform is what makes it genuinely optional. A browser form posts an
 * untouched input as `""`, not as nothing, so without this every message
 * would arrive with `Phone:` and `Country:` lines that say nothing — and
 * `.optional()` alone would not strip them, because `""` is a perfectly valid
 * string. Blank in, absent out, so `compose()` can simply skip what is not
 * there.
 */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

/*
 * The field limits are deliberate and they are the spam defence, together
 * with the honeypot:
 *
 *   - `message` has a **floor**. "hi" is not a message anybody can answer,
 *     and a floor costs a bot more than it costs a person.
 *   - `message` has a ceiling, because this posts into an email body and an
 *     unbounded one is a way to make a 10MB send.
 *   - `name` is required. Not for the data — for the one-line cost.
 *
 * ── Four required, five optional ──────────────────────────────────────────
 *
 * Only a name, an address, a topic and a message are required, and that is
 * the whole design of the longer form: every field added below can be left
 * alone without blocking anybody. A contact form that demands a phone number
 * and a company before it will carry a sentence is a form that collects
 * fewer sentences — and the four required fields are already everything
 * needed to read a message and answer it.
 */
export const ContactSchema = z.object({
  /* Required. */
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  topic: z.enum(CONTACT_TOPICS),
  message: z.string().trim().min(10).max(4000),

  /* Optional — everything here may be left blank. */
  phone: optionalText(32),
  company: optionalText(120),
  country: optionalText(60),
  who: z.enum(CONTACT_WHO).optional(),
  /**
   * Which language to answer in.
   *
   * Worth asking on this site specifically, and on few others: both editions
   * are real, somebody reading the Arabic page may want an English reply, and
   * guessing from the page they happened to land on is how a reply arrives in
   * a language the reader has to translate. Defaults to the edition they are
   * reading, which is right far more often than not.
   */
  replyLanguage: z.enum(LOCALES).optional(),

  /** Which edition the form was submitted from. Set by the form, not asked. */
  locale: z.enum(LOCALES).optional(),

  /*
   * The honeypot, named and behaved exactly as the waitlist's: a field no
   * person sees, accepted with a 202 and discarded. Same name on purpose —
   * a bot that has learned to leave `company_url` alone on one form has
   * learned it for both, and that is the direction we want the learning to
   * go.
   *
   * It stays `company_url` now that a real `company` field sits beside it,
   * and the distinction matters: browser autofill fills `organization`, not a
   * URL field marked `autocomplete="off"`. If a real person's entry ever did
   * land here their message would be discarded silently, which is why the
   * form also carries the password-manager opt-outs — see ContactForm.
   */
  company_url: z.string().max(2048).optional(),
});

export type ContactRequest = z.input<typeof ContactSchema>;
export type ContactMessage = z.output<typeof ContactSchema>;

/**
 * Where messages go.
 *
 * Not a secret — it is a published destination, and writing it here means a
 * deploy cannot quietly lose it to an unset variable. `CONTACT_INBOX`
 * overrides it so staging can send somewhere else without a code change.
 */
export const CONTACT_INBOX = process.env.CONTACT_INBOX ?? "markyos.web@gmail.com";
