import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { COPY } from "../copy";
import { joinWaitlist } from "../services/waitlistService";
import type { SignupState } from "../types";

/** The signup form's address, its submit, and the line it reports back. */
export function useWaitlistSignup(topic: string, locale: Locale) {
  const [state, setState] = useState<SignupState>("idle");
  const [email, setEmail] = useState("");
  const copy = COPY[locale];

  const message =
    state === "sent" ? copy.sent : state === "pending" ? copy.pending : state === "failed" ? copy.failed : "";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setState(await joinWaitlist({ email, topic }));
  };

  return { state, email, setEmail, message, label: copy.label, onSubmit };
}
