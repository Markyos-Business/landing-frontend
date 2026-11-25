import { NextResponse } from "next/server";
import { WaitlistSchema } from "@/lib/waitlist";

import { contentApiUrl } from "@/lib/content/connection";
import { siteHeaders } from "@/lib/visitor";

/** Validate locally; report success only after the shared backend accepts it. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_input",
        // Field names and messages only — never the submitted values, which
        // would put an email address into whatever logs the response.
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

  try {
    const response = await fetch(`${contentApiUrl()}/content/public/signups/`, {
      method: "POST", headers: siteHeaders(request),
      body: JSON.stringify(parsed.data), cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    if (response.status === 429) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, {
        status: 429, headers: { "Retry-After": response.headers.get("Retry-After") ?? "60" },
      });
    }
    const accepted = response.status === 202 && (await response.json().catch(() => null))?.ok === true;
    if (!accepted) return NextResponse.json({ ok: false, error: "storage_unavailable" }, { status: 503 });
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false, error: "storage_unavailable" }, { status: 503 });
  }
}
