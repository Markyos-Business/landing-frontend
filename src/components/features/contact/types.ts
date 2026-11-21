export type { ContactRequest, ContactTopic } from "@/lib/contact";

/**
 * How a submit ended.
 *
 * `undelivered` is the one that earns its place. It covers both a provider
 * that refused the send (502) and a deploy with no provider configured at all
 * (503), because the difference matters to us and not at all to the person
 * who just typed a message: either way it did not arrive, and either way the
 * only useful thing to show them is the address to write to instead. The two
 * are still distinct in the server log and in the response body.
 */
export type ContactResult = "sent" | "invalid" | "limited" | "undelivered" | "failed";

export type ContactState = "idle" | "sending" | ContactResult;

/** What the service hands back: how it went, and where to write if it didn't. */
export type ContactOutcome = { result: ContactResult; inbox?: string };
