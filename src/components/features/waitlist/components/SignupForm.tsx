"use client";

import { useId } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { useWaitlistSignup } from "../hooks/useWaitlistSignup";

/*
 * Email capture — newsletter, beta waitlist, "tell me when it ships".
 *
 * The request and its deliberate 501 are in `services/waitlistService.ts`;
 * the state is `useWaitlistSignup`. The form is a client island rather than a
 * plain POST because a native submit would navigate to that JSON 501 body,
 * which is the worst version of this.
 */

export function SignupForm({
  placeholder,
  submit,
  note,
  topic,
  locale,
}: {
  placeholder: string;
  submit: string;
  note?: string;
  /** Which list this is, so one endpoint can serve several forms. */
  topic: string;
  locale: Locale;
}) {
  const { state, email, setEmail, message, label, onSubmit } = useWaitlistSignup(topic, locale);
  const fieldId = useId();
  const statusId = useId();

  return (
    <form noValidate onSubmit={onSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* A real label, visually hidden. A placeholder is not a label: it
            disappears the moment someone types and is never announced as the
            field's name. */}
        <label htmlFor={fieldId} className="mk-sr-only">
          {label}
        </label>
        <input
          id={fieldId}
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          dir="ltr"
          placeholder={placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={message ? statusId : undefined}
          // `dir="ltr"` and `text-start`: an email address is a Latin string
          // and reads left-to-right even on an Arabic page. Without it the
          // caret starts on the wrong side and "@gmail.com" ends up leading.
          className="min-w-0 flex-1 rounded-[var(--radius-widget)] border border-[var(--hairline-strong)] bg-[var(--canvas)] px-4 py-3 text-start text-[0.875rem] text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:border-[var(--accent-edge)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="mk-btn mk-solid shrink-0 disabled:opacity-60"
        >
          <span className="mk-bidi">{submit}</span>
        </button>
      </div>

      {/* `aria-live`: the result of a submit happens with no navigation, so
          nothing would otherwise tell a screen-reader user it worked. */}
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={`mk-bidi mt-3 text-[length:var(--fs-ui)] leading-[1.6] ${
          state === "sent" ? "text-[var(--accent-text)]" : "text-[var(--text-muted)]"
        }`}
      >
        {message || note || ""}
      </p>
    </form>
  );
}
