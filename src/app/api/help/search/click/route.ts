import { NextResponse } from "next/server";
import { z } from "zod";
import { contentApiUrl } from "@/lib/content/djangoClient";
import { LOCALES } from "@/lib/i18n/locales";
import { optOut, upstreamHeaders } from "@/lib/content/helpSearch";

/* Which search result was opened (C5): the click half of the query log. */
export const runtime = "nodejs";

const Body = z.object({
  articleId: z.string().uuid(),
  queryId: z.number().int().positive().optional(),
  q: z.string().max(200).optional(),
  locale: z.enum(LOCALES).optional(),
  resultCount: z.number().int().min(0).max(10000).optional(),
});

export async function POST(request: Request) {
  const done = new NextResponse(null, { status: 204 });
  const root = contentApiUrl();
  if (!root || optOut(request)) return done;
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return done;
  try {
    await fetch(`${root}/help/public/search/click/`, {
      method: "POST",
      headers: upstreamHeaders(request),
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // A lost click is a smaller problem than a slow page.
  }
  return done;
}
