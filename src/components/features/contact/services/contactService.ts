import type { ContactRequest } from "@/lib/contact";
import type { ContactOutcome } from "../types";

/*
 * Post a message to `/api/contact`.
 *
 * Every status the route can answer is mapped to something the form can say.
 * The default case is `failed` rather than `sent`, which is the whole point:
 * an unrecognised status is a message that may not have arrived, and this
 * form never claims delivery it cannot account for.
 *
 * A 202 is `response.ok` and lands in `sent` — that is the honeypot being
 * discarded, and a bot is told it worked.
 */
export async function sendMessage(request: ContactRequest): Promise<ContactOutcome> {
  let response: Response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    // The request never left, or never came back. Nothing arrived.
    return { result: "failed" };
  }

  if (response.ok) return { result: "sent" };

  /*
   * The address to write to instead, when the route sends one. Read before
   * the switch because both undelivered statuses carry it.
   */
  const body: unknown = await response.json().catch(() => null);
  const inbox =
    body && typeof body === "object" && typeof (body as { inbox?: unknown }).inbox === "string"
      ? (body as { inbox: string }).inbox
      : undefined;

  switch (response.status) {
    case 422:
      return { result: "invalid" };
    case 429:
      return { result: "limited" };
    case 502:
    case 503:
      return { result: "undelivered", inbox };
    default:
      return { result: "failed" };
  }
}
