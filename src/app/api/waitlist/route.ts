import { NextResponse } from "next/server";
import { WaitlistSchema } from "@/lib/waitlist";

/*
 * The beta waitlist endpoint.
 *
 * ── Status: validates and does not store ────────────────────────────────────
 *
 * This route is complete except for the one line that writes the signup
 * somewhere, and that line is left out on purpose rather than guessed at.
 * Where a beta applicant's email goes is a decision with consequences — a
 * table in the Postgres the platform already uses, an email tool, or a sheet —
 * and it is one of the open decisions in docs/OPEN-DECISIONS.md.
 *
 * What is here is the part that is the same whichever way that goes: the
 * schema, the validation, the honeypot, and a response shape the form can
 * already be built against. It returns 501 so that nothing can ship believing
 * it is collecting signups when it is not. A silent 200 that drops the email
 * is the one failure mode worth engineering against: the form would look like
 * it worked, and the 25 studio spots would fill with people nobody can reach.
 */

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

  return NextResponse.json(
    {
      ok: false,
      error: "not_implemented",
      message:
        "Waitlist storage is not wired up yet. See docs/OPEN-DECISIONS.md before building the form against this.",
    },
    { status: 501 },
  );
}
