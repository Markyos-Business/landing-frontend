import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { COPY } from "../copy";
import { joinWaitlist } from "../services/waitlistService";
import type { SignupTopic } from "@/lib/waitlist";
import type { SignupState } from "../types";

/** The signup form's address, its submit, and the line it reports back. */
export function useWaitlistSignup(topic: SignupTopic, locale: Locale) {
  const [state, setState] = useState<SignupState>("idle");
  const [email, setEmail] = useState("");
  const copy = COPY[locale];

  const message =
    state === "sent"
      ? topic === "newsletter" ? copy.subscribed : copy.sent
      : state === "failed"
        ? copy.failed
        : state === "invalid"
          ? copy.invalid
          : "";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The same rule the server applies (src/lib/waitlist.ts), said in the
    // page's language instead of the browser's.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("invalid");
      return;
    }
    setState("sending");
    setState(await joinWaitlist({ email, topic, locale }));
  };

  return { state, email, setEmail, message, label: copy.label, onSubmit };
}
