import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { contentApiUrl } from "@/lib/content/djangoClient";
import { upstreamHeaders } from "@/lib/content/helpSearch";
import { LOCALES } from "@/lib/i18n/locales";

/*
 * "Was this article helpful?" (C6): the browser's vote, passed to the
 * platform signed with the site key.
 *
 * One vote per visitor per article. The visitor is a random id in the
 * `mk_help` cookie, set here the first time and only ever sent to this route
 * (path-scoped, httpOnly): no profile, no tracking, just "this browser
 * already answered". The platform stores it only as a keyed hash, and also
 * allows one vote per article per anonymous daily hash, so a script that
 * drops the cookie still gets one vote.
 *
 * `website` is a honeypot: a field people never see. When it's filled the
 * answer is thanked and thrown away.
 */
export const runtime = "nodejs";

const COOKIE = "mk_help";
const Body = z.object({
  articleId: z.string().uuid(),
  locale: z.enum(LOCALES),
  helpful: z.boolean(),
  reasons: z.array(z.enum(["outdated", "unclear", "missing_steps", "not_solved"])).max(4).optional(),
  comment: z.string().max(1000).optional(),
  website: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ code: "bad_vote" }, { status: 400 });
  const { articleId, website, ...vote } = parsed.data;
  if (website) return NextResponse.json({ helpful: vote.helpful }, { status: 201 });

  const root = contentApiUrl();
  if (!root) return NextResponse.json({ code: "unavailable" }, { status: 503 });

  const known = request.headers.get("cookie")?.match(/(?:^|;\s*)mk_help=([\w-]{16,64})/)?.[1];
  const voter = known ?? randomUUID();

  let status = 502;
  let body: unknown = { code: "unavailable" };
  try {
    const upstream = await fetch(`${root}/help/public/articles/${articleId}/feedback/`, {
      method: "POST",
      headers: { ...upstreamHeaders(request), "X-Voter": voter },
      body: JSON.stringify(vote),
      signal: AbortSignal.timeout(5000),
    });
    status = upstream.status;
    body = await upstream.json().catch(() => ({}));
  } catch {
    // Answered below with 502.
  }

  const response = NextResponse.json(body, { status });
  if (!known) {
    response.cookies.set(COOKIE, voter, {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/api/help/feedback",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}
