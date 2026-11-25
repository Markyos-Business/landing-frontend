import { useState, useSyncExternalStore, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { topicFromParam, type ContactTopic, type ContactWho } from "@/lib/contact";
import { COPY } from "../copy";
import { sendMessage } from "../services/contactService";
import type { ContactState } from "../types";

/*
 * `?topic=` as an external value the component reads, rather than state it
 * copies. The URL cannot change under this form without a navigation, which
 * is why there is nothing to subscribe to and the subscribe function returns
 * an unsubscribe that does nothing.
 *
 * The three functions are module-level constants so their identity is stable
 * across renders; `useSyncExternalStore` resubscribes when `subscribe`
 * changes, and a fresh arrow on every render would resubscribe on every
 * render.
 */
const subscribeToNothing = () => () => {};
const topicInUrl = () => new URLSearchParams(window.location.search).get("topic") ?? "";
/** The server has no URL query to read, so it renders the page's own default. */
const noTopicOnTheServer = () => "";

/** The required fields, in the order they appear in the form. */
const REQUIRED = ["name", "email", "message"] as const;
type RequiredField = (typeof REQUIRED)[number];

/*
 * A shape check, not a verdict: something@something.tld, no spaces. The server
 * validates again with the schema in src/lib/contact.ts; this only catches the
 * typo before the round trip.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The nine fields, the state machine, and the line the form reports back. */
export function useContactMessage(locale: Locale, initialTopic: ContactTopic) {
  const [state, setState] = useState<ContactState>("idle");
  const [inbox, setInbox] = useState<string>();

  /* Required. */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  /* Optional — every one of these may be left exactly as it starts. */
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [who, setWho] = useState<ContactWho | "">("");
  /*
   * The reply language starts as the edition being read, which is right far
   * more often than not — somebody on the Arabic page usually wants Arabic
   * back. It is a question rather than an assumption because both editions
   * are real here, and a reply in the wrong one is a reply that has to be
   * translated before it can be read.
   */
  const [replyLanguage, setReplyLanguage] = useState<Locale>(locale);

  /*
   * What is wrong with each required field, if anything. Set on submit,
   * cleared field by field as somebody fixes it, so a corrected field stops
   * saying it is wrong the moment it is right.
   */
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});

  const copy = COPY[locale];

  /*
   * The topic: what the reader picked, else what the URL asked for, else the
   * page's own default.
   *
   * Six of the seven topics are already linked as `/contact?topic=…` from
   * elsewhere in the copy — the enterprise CTA, "report a vulnerability",
   * "suggest a feature" — and until now the parameter arrived at a form with
   * nowhere to put it.
   *
   * Read through `useSyncExternalStore` and layered under `chosen` rather
   * than copied into state in an effect. Copying it would mean a render with
   * the wrong value followed by a setState, which is the cascading render the
   * React Compiler's lint rule names; and seeding `useState` from
   * `location.search` directly would render `other` on the server and
   * `security` on the client, which is a hydration mismatch. This way the
   * server renders the default, hydration agrees with it, and the URL's topic
   * lands in the first client render after.
   */
  const urlTopic = topicFromParam(
    useSyncExternalStore(subscribeToNothing, topicInUrl, noTopicOnTheServer),
  );
  const [chosen, setChosen] = useState<ContactTopic>();
  const topic = chosen ?? (urlTopic === "other" ? initialTopic : urlTopic);

  /*
   * Why not `useSearchParams`: /contact is statically generated
   * (`dynamicParams = false` in the catch-all route), and that hook in a
   * client component on a static page either needs a Suspense boundary
   * around this form or opts the whole page out of static rendering. The page
   * stays a static file this way.
   */

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*
     * Check the required fields here, before anything is sent. The form is
     * `noValidate`, so the browser reports nothing on its own, and this used
     * to return silently on a blank field: the button did nothing and nobody
     * was told why. Now each problem is written under its field, the field is
     * marked invalid, and focus moves to the first one.
     */
    const found: Partial<Record<RequiredField, string>> = {};
    if (!name.trim()) found.name = copy.errors.name;
    if (!email.trim()) found.email = copy.errors.email;
    else if (!EMAIL.test(email.trim())) found.email = copy.errors.emailFormat;
    if (!message.trim()) found.message = copy.errors.message;
    setErrors(found);
    const first = REQUIRED.find((field) => found[field]);
    if (first) {
      setState("invalid");
      (event.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    /*
     * Read off the form synchronously, before the first await. `currentTarget`
     * is only valid while the event is being dispatched, and this function
     * suspends on the fetch a few lines down.
     */
    const honeypot =
      (event.currentTarget.elements.namedItem("company_url") as HTMLInputElement | null)?.value ||
      undefined;

    setState("sending");
    setInbox(undefined);

    /*
     * Blank optionals are sent as nothing at all.
     *
     * An untouched text input posts `""`, and the schema would accept it —
     * `""` is a valid string. The server strips them too (see `optionalText`
     * in src/lib/contact.ts), but doing it here as well keeps the request
     * body honest about what was actually filled in, which is what
     * `check:contact` asserts against.
     */
    const filled = (value: string) => value.trim() || undefined;

    const outcome = await sendMessage({
      name,
      email,
      topic,
      message,
      phone: filled(phone),
      company: filled(company),
      country: filled(country),
      who: who || undefined,
      replyLanguage,
      locale,
      // A real person's browser never puts anything in this. The field lives
      // in the form rather than here, so that a bot can find it.
      company_url: honeypot,
    });

    setState(outcome.result);
    setInbox(outcome.inbox);

    /*
     * The fields are cleared only on success. After a failure they still hold
     * what somebody wrote, which is what they need in order to try again or
     * to paste it into an email — clearing them would throw the message away
     * at the exact moment it has nowhere else to live.
     */
    if (outcome.result === "sent") {
      setName("");
      setEmail("");
      setMessage("");
      setPhone("");
      setCompany("");
      setCountry("");
      setWho("");
      setReplyLanguage(locale);
    }
  };

  return {
    state,
    inbox,
    copy,
    fields: { name, email, topic, message, phone, company, country, who, replyLanguage },
    errors,
    set: {
      name: (value: string) => {
        setName(value);
        if (errors.name && value.trim()) setErrors((now) => ({ ...now, name: undefined }));
      },
      email: (value: string) => {
        setEmail(value);
        if (errors.email && EMAIL.test(value.trim())) setErrors((now) => ({ ...now, email: undefined }));
      },
      topic: setChosen,
      message: (value: string) => {
        setMessage(value);
        if (errors.message && value.trim()) setErrors((now) => ({ ...now, message: undefined }));
      },
      phone: setPhone,
      company: setCompany,
      country: setCountry,
      who: setWho,
      replyLanguage: setReplyLanguage,
    },
    onSubmit,
  };
}
