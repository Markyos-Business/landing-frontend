import { NextResponse } from "next/server";
import { contentApiUrl } from "@/lib/content/djangoClient";
import { optOut, upstreamHeaders } from "@/lib/content/helpSearch";
import { isLocale } from "@/lib/i18n/locales";

/*
 * Help Center search, for the search page's instant results (C5).
 *
 * The browser asks this site, and this site asks the platform: no CORS to
 * open, and the platform limits each visitor by the same anonymous daily hash
 * page views use, signed with the shared site key, instead of seeing every
 * visitor as this server. The hash is not stored anywhere.
 *
 * `log=1` records the query (the term, its language and its result count;
 * nothing about the person). A browser that sends Do Not Track or Global
 * Privacy Control is never logged.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const root = contentApiUrl();
  if (!root) return NextResponse.json({ error: "Search is unavailable." }, { status: 503 });

  const incoming = new URL(request.url).searchParams;
  const locale = incoming.get("locale") ?? "";
  const params = new URLSearchParams({
    q: (incoming.get("q") ?? "").slice(0, 200),
    locale: isLocale(locale) ? locale : "ar",
  });
  for (const key of ["category", "type"]) {
    const value = incoming.get(key);
    if (value && /^[\w-]{1,32}$/.test(value)) params.set(key, value);
  }
  if (incoming.get("log") === "1" && !optOut(request)) params.set("log", "1");

  try {
    const upstream = await fetch(`${root}/help/public/search/?${params}`, {
      headers: upstreamHeaders(request),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Search is unavailable." }, { status: 502 });
  }
}
