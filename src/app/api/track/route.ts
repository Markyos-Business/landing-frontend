import { NextResponse } from "next/server";
import { z } from "zod";
import { contentApiUrl, contentSiteKey } from "@/lib/content/djangoClient";
import { LOCALES } from "@/lib/i18n/locales";
import { visitorHash } from "@/lib/visitor";

/*
 * The tracking endpoint.
 *
 * Takes a page view from the browser and writes one row. Deliberately small:
 * no cookie is set, no IP address is stored, and the full referrer is reduced
 * to a hostname before it is written — a complete referrer can carry somebody's
 * search terms or the title of a private document they linked from.
 *
 * Always answers 204, including when it decides not to record. The browser has
 * nothing useful to do with a failure here, and an analytics call that reports
 * errors into someone's console is an analytics call that gets blocked.
 */

export const runtime = "nodejs";

const BodySchema = z.object({
  path: z.string().max(512),
  locale: z.enum(LOCALES).optional(),
  referrer: z.string().max(2048).optional(),
});


/** Coarse device class from the user agent. Three buckets is all a marketing dashboard needs. */
function deviceOf(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)) return "mobile";
  return "desktop";
}

/** Hostname only, and never our own — a visit from one of our pages is not a referral. */
function referrerHost(referrer: string | undefined, selfHost: string | null): string | undefined {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (!host || (selfHost && host === selfHost.replace(/^www\./, ""))) return undefined;
    return host.slice(0, 120);
  } catch {
    return undefined;
  }
}

/** Obvious crawlers. Not exhaustive — it does not need to be, it needs to be cheap. */
const BOT = /bot|crawler|spider|crawling|headless|lighthouse|preview|monitor|curl|wget|python-requests/i;

export async function POST(request: Request) {
  // 204 regardless of outcome. See the note at the top.
  const ok = new NextResponse(null, { status: 204 });

  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (!userAgent || BOT.test(userAgent)) return ok;

    // Honour the browser's own request not to be tracked. It costs us a
    // rounding error in the numbers and it is the whole reason the header
    // exists.
    if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return ok;

    const parsed = BodySchema.safeParse(await request.json());
    if (!parsed.success) return ok;

    const { path, locale, referrer } = parsed.data;

    // Only record real site paths. Never the admin, never the API.
    if (!path.startsWith("/") || /^\/(admin|api)\b/.test(path)) return ok;

    const forwarded = request.headers.get("x-forwarded-for") ?? "";
    const ip = forwarded.split(",")[0]?.trim() || "0.0.0.0";

    const view = {
      path: path.slice(0, 512),
      locale,
      device: deviceOf(userAgent),
      referrerHost: referrerHost(referrer, request.headers.get("host")),
      visitor: visitorHash(ip, userAgent),
      // Set by Vercel and Cloudflare. Absent elsewhere, which is fine.
      country:
        request.headers.get("x-vercel-ip-country") ??
        request.headers.get("cf-ipcountry") ??
        undefined,
    };

    // With the platform as the content source, views are counted there
    // (its CMS shows them under Website traffic). The call is signed with
    // the shared key; the hash and the trimming above stay on this side, so
    // the platform never sees an IP address or a full referrer either.
    const api = contentApiUrl();
    if (!contentSiteKey()) return ok; // Analytics is opt-in via a shared server key.
    const response = await fetch(`${api}/content/public/pageviews/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Content-Key": contentSiteKey() },
      body: JSON.stringify(Object.fromEntries(Object.entries(view).filter(([, v]) => v !== undefined))),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error(`platform answered ${response.status}`);

    return ok;
  } catch (error) {
    // A failure to count a view must never surface to a reader, and must
    // never take a page down. Logged so it is findable.
    console.error("[track] failed to record a page view:", error);
    return ok;
  }
}
