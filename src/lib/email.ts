/*
 * Outbound transactional email.
 *
 * ── Why Resend over HTTP, and not SMTP ────────────────────────────────────
 *
 * This site deploys to Vercel (see `VERCEL_ENV` in next.config.ts), so every
 * route handler is a short-lived serverless function. SMTP is a stateful,
 * multi-round-trip conversation over a long-lived socket, which is the one
 * shape that environment is worst at: the connection, the TLS upgrade and the
 * handshake all happen inside the request, on a cold start, against a function
 * that may be frozen mid-dialogue. An HTTP POST is one round trip and needs no
 * dependency at all, which is why there is no mail library in package.json.
 *
 * ── Why a result object and not a thrown error ─────────────────────────────
 *
 * The caller's job is to tell a person whether their message arrived, and the
 * three failures below need three different things said. A thrown `Error`
 * flattens them into "something went wrong", which is how a form ends up
 * claiming to have sent a message it dropped.
 *
 * Nothing here logs an address or a message body. The reasoning is the same
 * as the waitlist route's: a log line is a copy of the data in a place nobody
 * audits.
 */

export type SendFailure =
  /** No `RESEND_API_KEY`. Not an outage — nothing was ever wired up. */
  | "not_configured"
  /** The provider answered and said no: unverified domain, bad key, quota. */
  | "rejected"
  /** It never got an answer: DNS, TLS, or the 10s budget below. */
  | "network";

export type SendResult = { ok: true; id?: string } | { ok: false; reason: SendFailure; detail?: string };

/** Who the site sends as. Must be on a domain verified with the provider. */
const FROM = process.env.CONTACT_FROM ?? "Markyos website <website@markyos.com>";

/*
 * A send has to finish well inside the function's own budget, because the
 * visitor is watching a spinner. Ten seconds is long enough for a slow
 * provider and short enough that a hung socket still returns a page.
 */
const TIMEOUT_MS = 10_000;

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  /** The visitor's address, so hitting reply in the inbox answers them. */
  replyTo?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: "not_configured" };

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    return { ok: false, reason: "network", detail: error instanceof Error ? error.name : "unknown" };
  }

  if (!response.ok) {
    /*
     * The provider's own message, not the response body wholesale: the body
     * echoes back what was submitted, and this string ends up in a server
     * log. `message` is a description of the refusal ("The domain is not
     * verified"), which is the half worth keeping.
     */
    let detail = `HTTP ${response.status}`;
    try {
      const body: unknown = await response.json();
      if (body && typeof body === "object" && typeof (body as { message?: unknown }).message === "string") {
        detail = (body as { message: string }).message;
      }
    } catch {
      /* A non-JSON error body tells us nothing the status has not. */
    }
    return { ok: false, reason: "rejected", detail };
  }

  const body: unknown = await response.json().catch(() => null);
  const id = body && typeof body === "object" ? (body as { id?: string }).id : undefined;
  return { ok: true, id };
}

/** Whether a send can even be attempted, for the form's own benefit. */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
