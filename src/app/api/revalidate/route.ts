import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { after, NextResponse } from "next/server";
import { z } from "zod";
import { CONTENT_TAG, contentSiteKey } from "@/lib/content/djangoClient";

/*
 * "Rebuild these pages": called by the platform when an article is
 * published, changed while live, or taken offline.
 *
 * The pages are static, so without this a publish shows only when the
 * hourly revalidation comes round. The platform sends the public paths it
 * affects (`/blog/x` for Arabic, `/en/blog/x` for English) signed with the
 * shared CONTENT_SITE_KEY; anything unsigned is answered as if this route
 * did not exist.
 *
 * The cached reads are cleared by tag first: a page rebuilt on top of a
 * cached fetch would rebuild into the same stale article.
 */

export const runtime = "nodejs";
// Room for the rebuild after the response; see `after` below.
export const maxDuration = 60;

const Body = z.object({
  paths: z
    .array(
      z
        .string()
        .max(300)
        .regex(/^\/(?!\/)[^\s?#]*$/),
    )
    .max(40),
});

const digest = (value: string) => createHash("sha256").update(value).digest();

function signed(request: Request): boolean {
  const key = contentSiteKey();
  if (!key) return false;
  // Hashed first so the comparison is constant-time whatever the lengths.
  return timingSafeEqual(digest(request.headers.get("x-content-key") ?? ""), digest(key));
}

/** A public path as the route that renders it: Arabic lives under /ar inside the app. */
const routeOf = (path: string): string => (path === "/en" || path.startsWith("/en/") ? path : `/ar${path === "/" ? "" : path}`);

export async function POST(request: Request) {
  if (!signed(request)) return new NextResponse(null, { status: 404 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Send { paths: string[] }." }, { status: 400 });

  // Gone now, not served stale once more: the editor is looking at the page.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  const routes = parsed.data.paths.map(routeOf);
  for (const route of routes) revalidatePath(route);
  // Lists every article, in the languages it is written in.
  revalidatePath("/sitemap.xml");

  /*
   * Rebuild the pages now, while the platform is certainly awake: it sent
   * this request. Left to the next visitor, the rebuild could meet a backend
   * that has gone back to sleep (Render's free tier) and fail with nothing
   * cached to fall back on, since the expiry above removed it.
   */
  const origin = new URL(request.url).origin;
  after(async () => {
    const pages = [...parsed.data.paths, "/sitemap.xml"];
    const results = await Promise.allSettled(
      pages.map((path) => fetch(new URL(path, origin), { cache: "no-store", signal: AbortSignal.timeout(30000) })),
    );
    const failed = pages.filter((_, i) => results[i].status === "rejected" || !(results[i] as PromiseFulfilledResult<Response>).value.ok);
    if (failed.length) console.warn(`[cms] rebuild after publish failed for ${failed.join(", ").slice(0, 300)}`);
  });

  return NextResponse.json({ revalidated: routes });
}
