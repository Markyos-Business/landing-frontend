import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { ContactSchema, topicFromParam, type ContactTopic, type ContactWho } from "@/lib/contact";
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

/** The nine fields, the state machine, and the line the form reports back. */
export function useContactMessage(locale: Locale, initialTopic: ContactTopic) {
  const [state, setState] = useState<ContactState>("idle");
  const [inbox, setInbox] = useState<string>();
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state !== "invalid" || !invalidFields.length) return;
    const control = formRef.current?.elements.namedItem(invalidFields[0]);
    if (control instanceof HTMLElement) control.focus();
  }, [state, invalidFields]);

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
    const validation = ContactSchema.safeParse({
      name, email, topic, message, phone, company, country, who: who || undefined, replyLanguage, locale,
    });
    if (!validation.success) {
      const names = [...new Set(validation.error.issues.map(issue => String(issue.path[0])))];
      setInvalidFields(names);
      setState("invalid");
      setInbox(undefined);
      return;
    }
    setInvalidFields([]);

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

    if (outcome.result === "invalid") {
      const names = outcome.invalidFields ?? [];
      setInvalidFields(names);
    }
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
    formRef,
    invalidFields,
    inbox,
    copy,
    fields: { name, email, topic, message, phone, company, country, who, replyLanguage },
    set: {
      name: setName,
      email: setEmail,
      topic: setChosen,
      message: setMessage,
      phone: setPhone,
      company: setCompany,
      country: setCountry,
      who: setWho,
      replyLanguage: setReplyLanguage,
    },
    onSubmit,
  };
}
