"use client";

import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { CONTACT_TOPICS, CONTACT_WHO, type ContactTopic, type ContactWho } from "@/lib/contact";
import { Icon } from "@/components/ui";
import { useContactMessage } from "../hooks/useContactMessage";

/*
 * The contact form — nine fields, four of them required.
 *
 * ── Why a client island and not a plain POST ───────────────────────────────
 *
 * A native form submit navigates to whatever the endpoint returns, which here
 * is a JSON body. Somebody who mistyped their address would land on a page of
 * `{"ok":false,"error":"invalid_input"}` with their message gone. So the
 * submit is intercepted, the page never moves, and a failed send leaves every
 * field exactly as it was typed.
 *
 * ── Why the labels are visible ─────────────────────────────────────────────
 *
 * The newsletter field next door hides its label, and that is right for one
 * field whose placeholder reads "Work email". Nine fields is a different
 * object: a placeholder is not a label, it disappears the moment somebody
 * types, and a half-filled form with no labels gives a reader no way to check
 * what they have written. Each label is a real `<label>` wrapping its control,
 * so the whole thing is one hit target and there is no id to get wrong.
 *
 * ── Why "optional" is written out ──────────────────────────────────────────
 *
 * Five of the nine may be skipped, so the optional ones are marked rather
 * than the required ones. An asterisk is a convention a reader has to already
 * know, some screen readers read it as "star", and on a form that is mostly
 * optional it would end up marking everything that matters and nothing that
 * does not.
 */

/** A label and its control. `hint` is the "optional" marker, when there is one. */
function Field({
  label,
  hint,
  error,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  /** What is wrong with the field, shown under it. Its control points here. */
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <label className="mk-field">
      <span className="mk-bidi">
        {label}
        {hint ? <em className="mk-field-hint">{hint}</em> : null}
      </span>
      {children}
      {error ? (
        <span id={errorId} className="mk-field-error mk-bidi">
          {error}
        </span>
      ) : null}
    </label>
  );
}

/**
 * A select and the site's own chevron.
 *
 * The wrapper exists only to be the chevron's positioning context — the
 * browser's native arrow is turned off in `tailwind/components/forms.js`, and
 * the reason why is written there.
 */
function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="mk-select">
      <select {...props}>{children}</select>
      <Icon name="chevron" size={16} className="mk-select-arrow" />
    </span>
  );
}

export function ContactForm({
  locale,
  topic = "other",
  submitLabel,
}: {
  locale: Locale;
  /** The page's default topic. `?topic=` in the URL wins — see the hook. */
  topic?: ContactTopic;
  /** The content file's own word for the button, when it has one. */
  submitLabel?: string;
}) {
  const { state, inbox, copy, fields, errors, set, onSubmit } = useContactMessage(locale, topic);
  const statusId = useId();
  const errorId = useId();
  /** The attributes a required control takes when it has a problem. */
  const invalid = (field: "name" | "email" | "message") =>
    errors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `${errorId}-${field}` }
      : {};
  const sending = state === "sending";
  const optional = copy.optional;

  /* One sentence for the outcome. `undelivered` adds the address as a link. */
  const line =
    state === "sending"
      ? copy.sending
      : state === "sent"
        ? copy.states.sent
        : state === "invalid"
          ? copy.states.invalid
          : state === "limited"
            ? copy.states.limited
            : state === "undelivered"
              ? copy.states.undelivered
              : state === "failed"
                ? copy.states.failed
                : "";

  return (
    <form noValidate onSubmit={onSubmit} className="mk-form" aria-describedby={statusId}>
      {/* Who you are, and how to reach you. */}
      <div className="mk-form-row">
        <Field label={copy.fields.name} error={errors.name} errorId={`${errorId}-name`}>
          <input
            type="text"
            name="name"
            dir="auto"
          {...invalid("name")}
            required
            autoComplete="name"
            maxLength={80}
            placeholder={copy.placeholders.name}
            value={fields.name}
            onChange={(event) => set.name(event.target.value)}
            disabled={sending}
            /* `mk-bidi`: a name may be written in either script, and each
               should sit on its own reading edge inside the same field. */
            className="mk-bidi"
          />
        </Field>

        <Field label={copy.fields.email} error={errors.email} errorId={`${errorId}-email`}>
          <input
            type="email"
            name="email"
          {...invalid("email")}
            required
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            /* `dir="ltr"`: an email address is a Latin string and reads
               left-to-right even on an Arabic page. Without it the caret
               starts on the wrong side and "@gmail.com" ends up leading. */
            dir="ltr"
            placeholder={copy.placeholders.email}
            value={fields.email}
            onChange={(event) => set.email(event.target.value)}
            disabled={sending}
          />
        </Field>
      </div>

      <div className="mk-form-row">
        <Field label={copy.fields.phone} hint={optional}>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            maxLength={32}
            /* A phone number is digits and punctuation — all neutral
               characters — so plaintext would resolve it from the page and
               put a leading "+" on the wrong end on the Arabic edition. */
            dir="ltr"
            placeholder={copy.placeholders.phone}
            value={fields.phone}
            onChange={(event) => set.phone(event.target.value)}
            disabled={sending}
          />
        </Field>

        <Field label={copy.fields.company} hint={optional}>
          <input
            type="text"
            name="company"
            dir="auto"
            autoComplete="organization"
            maxLength={120}
            placeholder={copy.placeholders.company}
            value={fields.company}
            onChange={(event) => set.company(event.target.value)}
            disabled={sending}
            className="mk-bidi"
          />
        </Field>
      </div>

      <div className="mk-form-row">
        <Field label={copy.fields.who} hint={optional}>
          <Select
            name="who"
            value={fields.who}
            onChange={(event) => set.who(event.target.value as ContactWho | "")}
            disabled={sending}
            className="mk-bidi"
          >
            {/* The empty option is first and selected, so an untouched field
                stays genuinely unanswered rather than claiming the first
                option by default. */}
            <option value="">{copy.choose}</option>
            {CONTACT_WHO.map((value) => (
              <option key={value} value={value}>
                {copy.who[value]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={copy.fields.country} hint={optional}>
          <input
            type="text"
            name="country"
            dir="auto"
            autoComplete="country-name"
            maxLength={60}
            placeholder={copy.placeholders.country}
            value={fields.country}
            onChange={(event) => set.country(event.target.value)}
            disabled={sending}
            className="mk-bidi"
          />
        </Field>
      </div>

      <div className="mk-form-row">
        <Field label={copy.fields.topic}>
          <Select
            name="topic"
            value={fields.topic}
            onChange={(event) => set.topic(event.target.value as ContactTopic)}
            disabled={sending}
            className="mk-bidi"
          >
            {CONTACT_TOPICS.map((value) => (
              <option key={value} value={value}>
                {copy.topics[value]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={copy.fields.replyLanguage}>
          <Select
            name="replyLanguage"
            value={fields.replyLanguage}
            onChange={(event) => set.replyLanguage(event.target.value as Locale)}
            disabled={sending}
            className="mk-bidi"
          >
            {LOCALES.map((value) => (
              <option key={value} value={value}>
                {copy.languages[value]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {/* The message itself, across the full width of the form. */}
      <Field label={copy.fields.message} error={errors.message} errorId={`${errorId}-message`}>
        <textarea
          name="message"
          dir="auto"
          {...invalid("message")}
          required
          rows={6}
          minLength={10}
          maxLength={4000}
          placeholder={copy.placeholders.message}
          value={fields.message}
          onChange={(event) => set.message(event.target.value)}
          disabled={sending}
          className="mk-bidi"
        />
      </Field>

      {/*
        The honeypot. Off-screen rather than hidden, out of the tab order, and
        `aria-hidden` so it is never announced or focused. Its name matches the
        waitlist's on purpose — see `src/lib/contact.ts`.

        `data-1p-ignore` and `data-lpignore` matter now that a real `company`
        field sits two rows above it: a password manager that decided to fill
        this one would get a real person's message discarded as a bot's, with
        no way for them to know. Browser autofill targets `organization`, not
        a URL field marked `autocomplete="off"`, and these two attributes are
        what 1Password and LastPass read to stay out of it.
      */}
      <div className="mk-honeypot" aria-hidden="true">
        <label>
          {copy.honeypot}
          <input
            type="text"
            name="company_url"
            tabIndex={-1}
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            defaultValue=""
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={sending} className="mk-btn mk-solid disabled:opacity-60">
          <span className="mk-bidi">{sending ? copy.sending : submitLabel || copy.submit}</span>
        </button>
      </div>

      {/*
        `role="status"` with `aria-live="polite"`: the result of a submit
        happens with no navigation, so nothing would otherwise tell a
        screen-reader user whether their message went. The element is always
        in the DOM — a live region that appears at the same moment as its text
        is one the browser was not watching, and the announcement is lost.
      */}
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={`mk-form-status mk-bidi ${state === "sent" ? "text-[var(--text)]" : ""}`}
      >
        {line}
        {state === "undelivered" && inbox ? (
          <a href={`mailto:${inbox}`} dir="ltr">
            {inbox}
          </a>
        ) : null}
      </p>
    </form>
  );
}
