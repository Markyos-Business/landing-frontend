import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/launch";
import { SITE_URL } from "@/lib/seo";

/*
 * robots.txt
 *
 * During the private beta the site is a waitlist page, and a waitlist page
 * indexed under the terms the real site wants to rank for is a page that has
 * to be de-indexed later. So the beta is closed to crawlers outright, and
 * opening the site to them is part of flipping NEXT_PUBLIC_LAUNCH_PHASE —
 * one switch, not a thing to remember.
 *
 * Worth being deliberate about: this means the beta site earns no SEO. That is
 * the right trade. A thin page ranking for "bilingual brand guidelines" for
 * four months trains the index on the wrong content for the one term the
 * product most needs.
 */

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The product app's hand-off routes are redirects, not pages.
        disallow: ["/api/", "/start", "/login"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
