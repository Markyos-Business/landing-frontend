"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { HELP_COPY } from "./copy";

/*
 * «هل كانت هذه المقالة مفيدة؟» (C6), at the end of an article.
 *
 * Yes sends at once. No opens optional reasons and an optional comment
 * (read only by the team), then sends. Answering again changes the answer;
 * the platform keeps one per visitor per article. This browser remembers
 * that it answered (localStorage, for the "thanks" on a return visit; the
 * vote itself is the server's), and offers "Change answer".
 */

type Reason = "outdated" | "unclear" | "missing_steps" | "not_solved";
const REASONS: Reason[] = ["outdated", "unclear", "missing_steps", "not_solved"];
type Step = "ask" | "why" | "done";

const memoryKey = (id: string) => `mk-help-vote:${id}`;

function remembered(id: string): "yes" | "no" | null {
  try {
    const value = window.localStorage.getItem(memoryKey(id));
    return value === "yes" || value === "no" ? value : null;
  } catch {
    return null;
  }
}

export function HelpFeedback({ locale, articleId }: { locale: Locale; articleId: string }) {
  const c = HELP_COPY[locale].feedback;
  const ids = useId();
  const [step, setStep] = useState<Step>("ask");
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  // A return visit: say thanks again instead of asking. Read after mount,
  // so the server-rendered question and the first client render agree.
  useEffect(() => {
    const before = remembered(articleId);
    if (!before) return;
    const id = window.setTimeout(() => {
      setAnswer(before);
      setStep("done");
    }, 0);
    return () => window.clearTimeout(id);
  }, [articleId]);

  const send = async (helpful: boolean, why: { reasons: Reason[]; comment: string } = { reasons: [], comment: "" }) => {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/help/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          locale,
          helpful,
          ...(helpful ? {} : { reasons: why.reasons, comment: why.comment.trim() }),
          website: honeypot.current?.value || undefined,
        }),
      });
      if (response.status === 409) {
        // Already answered from this browser today, under another id: say
        // so in the heading; there is nothing to change from here.
        setAnswer(null);
        setStep("done");
        heading.current?.focus();
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      const value = helpful ? "yes" : "no";
      try {
        window.localStorage.setItem(memoryKey(articleId), value);
      } catch {
        // Private mode: the thanks just won't come back next visit.
      }
      setAnswer(value);
      setStep("done");
      heading.current?.focus();
    } catch {
      setMessage(c.error);
    } finally {
      setBusy(false);
    }
  };

  const toggle = (reason: Reason) =>
    setReasons((r) => (r.includes(reason) ? r.filter((x) => x !== reason) : [...r, reason]));

  return (
    <section aria-labelledby={`${ids}-q`} className="mk-help-feedback mk-no-print">
      <h2 id={`${ids}-q`} ref={heading} tabIndex={-1} className="mk-bidi text-[length:var(--fs-h3)] font-medium text-[var(--text)]">
        {step === "done" ? (answer === "yes" ? c.thanksYes : answer === "no" ? c.thanksNo : c.already) : c.question}
      </h2>

      {step === "ask" ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="mk-btn mk-outline mk-btn-sm" disabled={busy} onClick={() => void send(true)}>
            {c.yes}
          </button>
          <button
            type="button"
            className="mk-btn mk-outline mk-btn-sm"
            disabled={busy}
            onClick={() => setStep("why")}
          >
            {c.no}
          </button>
        </div>
      ) : null}

      {step === "why" ? (
        <form
          className="mt-4 grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            void send(false, { reasons, comment });
          }}
        >
          <fieldset>
            <legend className="mk-bidi text-[length:var(--fs-ui)] font-medium text-[var(--text)]">{c.reasonsLabel}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {REASONS.map((reason) => (
                <label key={reason} className="mk-help-check mk-bidi">
                  <input type="checkbox" checked={reasons.includes(reason)} onChange={() => toggle(reason)} />
                  <span>{c.reasons[reason]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-2">
            <label htmlFor={`${ids}-c`} className="mk-bidi text-[length:var(--fs-ui)] font-medium text-[var(--text)]">
              {c.commentLabel}
            </label>
            <textarea
              id={`${ids}-c`}
              rows={3}
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              aria-describedby={`${ids}-h`}
              className="mk-help-textarea mk-bidi"
            />
            <p id={`${ids}-h`} className="mk-bidi text-[length:var(--fs-eyebrow)] text-[var(--text-muted)]">
              {c.commentHint}
            </p>
          </div>
          {/* The honeypot: off screen, out of the tab order, unlabelled for
              people (its label says to leave it empty, for screen readers). */}
          <div className="mk-honeypot" aria-hidden="true">
            <label htmlFor={`${ids}-w`}>{c.honeypot}</label>
            <input id={`${ids}-w`} ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="mk-btn mk-solid mk-btn-sm" disabled={busy}>
              {busy ? c.sending : c.send}
            </button>
            <button
              type="button"
              className="mk-btn mk-outline mk-btn-sm"
              disabled={busy}
              onClick={() => void send(false)}
            >
              {c.skip}
            </button>
          </div>
        </form>
      ) : null}

      {step === "done" && answer ? (
        <button
          type="button"
          className="mk-help-crumb mk-bidi mt-3 text-[length:var(--fs-ui)] text-[var(--text-muted)]"
          onClick={() => {
            setStep("ask");
            setAnswer(null);
            setMessage(null);
          }}
        >
          {c.change}
        </button>
      ) : null}

      <p aria-live="polite" className="mk-bidi mt-3 text-[length:var(--fs-ui)] text-[var(--text-muted)]">
        {message}
      </p>
    </section>
  );
}
