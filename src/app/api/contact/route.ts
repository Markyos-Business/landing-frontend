import { NextResponse } from "next/server";
import { ContactSchema, CONTACT_INBOX } from "@/lib/contact";
import { contentApiUrl } from "@/lib/content/djangoClient";
import { siteHeaders } from "@/lib/visitor";

/*
 * The contact endpoint — a message from the website into the platform.
 *
 * The platform (`POST {CONTENT_API_URL}/content/public/contact/`) stores the
 * message first and then emails it to the team, so a message is never lost to
 * a mail outage: it is in the CMS under Messages either way. The request is
 * signed with the site key, and names the visitor by today's anonymous hash,
 * which is what the platform rate-limits on (per visitor, not per server).
 *
 * Statuses, and what the form says for each:
 *
 *   202  accepted          — stored (and emailed, or queued for a person).
 *                            Also the honeypot's answer. Bots only.
 *   400  invalid_json
 *   422  invalid_input     — per-field paths, never the submitted values.
 *   429  rate_limited
 *   503  unavailable       — the platform did not take it. Shows the address.
 *
 * Nothing is logged but the failure status. An address and a message body in
 * a log is a second copy of somebody's private note.
 *
 * The inbox address goes only into the 503 body, handed to a browser that has
 * just been told its message did not arrive, never into the page's HTML where
 * a harvester reads it on the first crawl.
 */

export const runtime = "nodejs";

/** The platform's field names are the form's, so its 400 maps straight back. */
function fieldsOf(body: unknown): { path: string }[] {
  if (!body || typeof body !== "object") return [];
  return Object.keys(body).filter((key) => key !== "detail" && key !== "code").map((path) => ({ path }));
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
        fields: parsed.error.issues.map((issue) => ({ path: issue.path.join(".") })),
      },
      { status: 422 },
    );
  }

  if (parsed.data.company_url) {
    // Accept and discard. Telling a bot it was caught teaches the next one.
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const unavailable = () =>
    NextResponse.json({ ok: false, error: "unavailable", inbox: CONTACT_INBOX }, { status: 503 });

  try {
    const { company_url: _honeypot, ...message } = parsed.data;
    void _honeypot;
    const upstream = await fetch(`${contentApiUrl()}/content/public/contact/`, {
      method: "POST",
      headers: siteHeaders(request),
      body: JSON.stringify(message),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (upstream.status === 202) return NextResponse.json({ ok: true }, { status: 202 });
    if (upstream.status === 429) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, {
        status: 429,
        headers: { "Retry-After": upstream.headers.get("Retry-After") ?? "3600" },
      });
    }
    if (upstream.status === 400) {
      const fields = fieldsOf(await upstream.json().catch(() => null));
      return NextResponse.json({ ok: false, error: "invalid_input", fields }, { status: 422 });
    }
    console.error(`[contact] platform answered ${upstream.status}`);
    return unavailable();
  } catch {
    console.error("[contact] platform unreachable");
    return unavailable();
  }
}
