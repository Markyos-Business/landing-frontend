import { NextResponse } from "next/server";
import { ContactSchema, CONTACT_INBOX, type ContactMessage } from "@/lib/contact";
import { sendEmail } from "@/lib/email";

/*
 * The contact endpoint — a message from the website into an inbox.
 *
 * ── What this does differently from /api/waitlist ──────────────────────────
 *
 * The waitlist route next door returns 501 and says so loudly, because where
 * a mailing list lives is an open decision. This one has no such excuse: a
 * message has a destination the moment somebody names an inbox, and one was
 * named. So it sends, and the one rule it inherits is the one that matters —
 * **never answer 200 for a message that did not arrive.** Every failure below
 * gets its own status and its own sentence in the form, because a form that
 * reports success for a dropped message is worse than no form: the visitor
 * stops waiting for a reply that is never coming.
 *
 * Statuses, and what the form says for each:
 *
 *   200  sent              — it is in the inbox.
 *   202  accepted, dropped — the honeypot was filled. Bots only.
 *   400  invalid_json
 *   422  invalid_input     — per-field messages, never the submitted values.
 *   429  rate_limited
 *   503  not_configured    — no API key. Shows the direct address instead.
 *   502  send_failed       — the provider refused or never answered. Same.
 *
 * Nothing is logged but the failure reason. An address and a message body in
 * a log is a second copy of somebody's private note, in the one place nobody
 * is watching.
 *
 * ── Why the inbox address is in the 502/503 body ───────────────────────────
 *
 * When a send fails, the only useful thing the form can offer is the address
 * to write to by hand, so the response carries it. It is deliberately *not* a
 * prop on the page: passing it down would put markyos.web@gmail.com into the
 * HTML of /contact in both editions, where an address harvester reads it on
 * the first crawl. Here it is only ever handed to a browser that has already
 * posted a valid message and been told it did not arrive.
 */

/*
 * Best-effort burst control.
 *
 * This is per instance, in memory, and it is honest about being partial: a
 * serverless deployment runs many instances and a cold one starts with an
 * empty map, so a determined sender gets more than five. It is not the spam
 * defence — the honeypot and the message floor in `src/lib/contact.ts` are —
 * it is here so that one script cannot empty a send quota in a minute. A real
 * limiter needs shared state, which means the Postgres the CMS already has;
 * that is worth doing when there is evidence it is needed and not before.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  // The map is the only thing that grows here, so it is swept on the way past.
  if (hits.size > 500) {
    for (const [ip, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(ip);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

/*
 * The sender's address as the proxy saw it. Only ever used as a bucket key —
 * never stored, never logged, never put in the email.
 *
 * `x-forwarded-for` is client-supplied in general and would be spoofable, but
 * on Vercel the proxy overwrites it with the real connecting address before
 * the function sees it, so the first entry is trustworthy there. Locally it is
 * not, which is exactly what scripts/check-contact.mjs relies on to give each
 * of its cases its own bucket.
 */
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/*
 * The inbox's own view of a message.
 *
 * Plain text, not HTML: there is no formatting here worth the risk of pasting
 * somebody's typed text into markup. `reply_to` is the visitor, so answering
 * is one key in Gmail rather than a copy-paste of the address below.
 */
function compose(data: ContactMessage): { subject: string; text: string } {
  /*
   * CR and LF out of the subject. It travels as JSON over HTTPS so it is not
   * the classic header-injection path, but a subject is a header wherever it
   * ends up, and the cost of being sure is one regex.
   */
  const name = data.name.replace(/[\r\n]+/g, " ");
  const subject = `[markyos.com] ${data.topic} — ${name}`;

  const edition =
    data.locale === "ar" ? "Arabic (/)" : data.locale === "en" ? "English (/en)" : "unknown";
  const language =
    data.replyLanguage === "ar" ? "Arabic" : data.replyLanguage === "en" ? "English" : undefined;

  /*
   * The header block, in reading order, with the optional fields left out
   * when they were left blank rather than printed empty. Five of the nine
   * fields may be skipped, and a header of `Phone:` with nothing after it
   * tells the reader less than no line at all.
   *
   * The labels are English whatever edition the form was submitted from:
   * this is read in an inbox, by us, not by the person who wrote it. Their
   * own words come through verbatim below the rule.
   */
  const rows: [string, string | undefined][] = [
    ["Topic", data.topic],
    ["Name", name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company", data.company],
    ["Who", data.who],
    ["Country", data.country],
    ["Reply in", language],
    ["Edition", edition],
    ["Sent", new Date().toISOString()],
  ];
  const present = rows.filter((row): row is [string, string] => Boolean(row[1]));
  /* One column for the values, however many rows survived the filter. */
  const width = Math.max(...present.map(([label]) => label.length)) + 1;

  const text = [
    ...present.map(([label, value]) => `${`${label}:`.padEnd(width + 1)} ${value}`),
    "",
    "─".repeat(60),
    "",
    data.message,
  ].join("\n");

  return { subject, text };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_input",
        // Field names and messages only. The values are what the visitor
        // typed, and echoing them puts them into whatever logs the response.
        fields: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  if (parsed.data.company_url) {
    // Accept and discard. Telling a bot it was caught teaches the next one.
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const { subject, text } = compose(parsed.data);
  const result = await sendEmail({
    to: CONTACT_INBOX,
    subject,
    text,
    replyTo: parsed.data.email,
  });

  if (result.ok) return NextResponse.json({ ok: true }, { status: 200 });

  if (result.reason === "not_configured") {
    /*
     * 503, not 500. Nothing is broken — no mail provider has been connected
     * yet. The form reads this as "show them the address directly", so a
     * deploy without the key still gets the message to somebody, by hand.
     */
    console.error("[contact] no mail provider configured: set RESEND_API_KEY");
    return NextResponse.json(
      {
        ok: false,
        error: "not_configured",
        message: "No mail provider is configured. Set RESEND_API_KEY. See .env.example.",
        inbox: CONTACT_INBOX,
      },
      { status: 503 },
    );
  }

  console.error(`[contact] send failed (${result.reason}): ${result.detail ?? "no detail"}`);
  return NextResponse.json({ ok: false, error: "send_failed", inbox: CONTACT_INBOX }, { status: 502 });
}
