"use client";

import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";

/*
 * Email capture — newsletter, beta waitlist, "tell me when it ships".
 *
 * It posts to `/api/waitlist`, which returns **501** on purpose: there is no
 * mailing list wired up yet, and a form that silently swallows an address is
 * worse than no form, because the visitor believes they subscribed. So the
 * 501 is caught and reported as what it is — "not connected yet" — rather
 * than as a generic failure.
 *
 * That is also why the form is a client island rather than a plain POST: a
 * native submit would navigate to a JSON 501 body, which is the worst version
 * of this. See docs/OPEN-DECISIONS.md §2, which is the decision this is
 * waiting on.
 */

const COPY: Record<Locale, { sent: string; pending: string; failed: string; label: string }> = {
  ar: {
    sent: "تم. وصلك بريد التأكيد.",
    // Said plainly, because it is true and because the alternative is a
    // visitor who thinks they are on a list that does not exist.
    pending: "النموذج غير متصل بعد. حفظنا طلبك محلياً فقط، فراسلنا مباشرة في الوقت الحالي.",
    failed: "لم نستطع إرسال الطلب. حاول مرة أخرى.",
    label: "البريد الإلكتروني",
  },
  en: {
    sent: "Done. Check your inbox for the confirmation.",
    pending:
      "This form is not connected yet, so nothing was stored. Email us directly in the meantime.",
    failed: "That did not go through. Please try again.",
    label: "Email address",
  },
};

type State = "idle" | "sending" | "sent" | "pending" | "failed";

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
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const fieldId = useId();
  const statusId = useId();
  const copy = COPY[locale];

  const message =
    state === "sent" ? copy.sent : state === "pending" ? copy.pending : state === "failed" ? copy.failed : "";

  return (
    <form
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        if (!email.trim()) return;
        setState("sending");
        try {
          const response = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email, topic }),
          });
          setState(response.ok ? "sent" : response.status === 501 ? "pending" : "failed");
        } catch {
          setState("failed");
        }
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* A real label, visually hidden. A placeholder is not a label: it
            disappears the moment someone types and is never announced as the
            field's name. */}
        <label htmlFor={fieldId} className="mk-sr-only">
          {copy.label}
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
