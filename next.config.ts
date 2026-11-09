import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

/*
 * Every Vercel deploy that is not production — staging and each preview —
 * tells search engines not to index it. robots.txt alone only stops crawling;
 * a staging URL linked from anywhere could still be indexed without this
 * header. See `isIndexable` in src/lib/launch.ts, which closes robots.txt on
 * the same condition.
 */
const hiddenFromSearch = Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";

const nextConfig: NextConfig = {
  async headers() {
    return hiddenFromSearch
      ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]
      : [];
  },
  // The marketing site is almost entirely static. Keeping `trailingSlash` off
  // and the default output means one canonical URL per page, which is the
  // thing SEO cares about most here.
  async redirects() {
    return [
      // Every CTA on the site points at the sign-up fork, which lives in the
      // platform app — not here. Centralising the hop means a copywriter can
      // write /start without knowing where the product is deployed.
      {
        source: "/start",
        destination: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.markyos.com"}/start`,
        permanent: false,
      },
      {
        source: "/login",
        destination: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.markyos.com"}/login`,
        permanent: false,
      },

      /*
       * The audience pages moved under /solutions.
       *
       * `markyos_solutions_menu.md` §4: the header's "For studios" and "For
       * companies" became two of the three columns inside the Solutions
       * dropdown, and their pages moved with them. These were linked from
       * every page's header and footer for the whole of the site's life so
       * far, so they redirect permanently rather than 404.
       *
       * Written out per locale rather than as `/:lang(en|ar)/studios`,
       * because Arabic now has no locale segment — a parameterised source
       * cannot express "either /studios or /en/studios". `/ar/studios` is
       * listed too: proxy.ts would 301 it to `/studios` and this rule would
       * then fire, but naming it saves the reader a hop.
       *
       * Never relax these to `/:lang/studios`. Unconstrained, that also
       * matches `/solutions/studios` itself — lang binds to "solutions" — and
       * the page redirects to itself one level deeper, for ever.
       */
      { source: "/studios", destination: "/solutions/studios", statusCode: 301 },
      { source: "/companies", destination: "/solutions/companies", statusCode: 301 },
      { source: "/ar/studios", destination: "/solutions/studios", statusCode: 301 },
      { source: "/ar/companies", destination: "/solutions/companies", statusCode: 301 },
      { source: "/en/studios", destination: "/en/solutions/studios", statusCode: 301 },
      { source: "/en/companies", destination: "/en/solutions/companies", statusCode: 301 },

      /*
       * Editorial content moved off /resources.
       *
       * The page documents' §4 URL map puts the blog, the guides, the help
       * centre, the comparisons and the changelog at the top level, and
       * /resources keeps only the hub that routes to them. Shorter URLs are
       * easier to share and to say out loud, which for a help centre is the
       * whole job.
       *
       * These were in the header and the footer of every page, so they
       * redirect rather than 404. `/resources` itself still serves the hub.
       */
      { source: "/resources/blog", destination: "/blog", statusCode: 301 },
      { source: "/resources/blog/:slug", destination: "/blog/:slug", statusCode: 301 },
      { source: "/resources/guides", destination: "/guides", statusCode: 301 },
      { source: "/resources/guides/:slug", destination: "/guides/:slug", statusCode: 301 },
      { source: "/resources/help", destination: "/help", statusCode: 301 },
      { source: "/resources/help/:slug", destination: "/help/:slug", statusCode: 301 },
      { source: "/resources/compare", destination: "/compare", statusCode: 301 },
      { source: "/resources/changelog", destination: "/whats-new", statusCode: 301 },

      { source: "/en/resources/blog", destination: "/en/blog", statusCode: 301 },
      { source: "/en/resources/blog/:slug", destination: "/en/blog/:slug", statusCode: 301 },
      { source: "/en/resources/guides", destination: "/en/guides", statusCode: 301 },
      { source: "/en/resources/help", destination: "/en/help", statusCode: 301 },
      { source: "/en/resources/compare", destination: "/en/compare", statusCode: 301 },
      { source: "/en/resources/changelog", destination: "/en/whats-new", statusCode: 301 },

      /*
       * The feature pages, until Part 6 is written.
       *
       * v2.2 of the homepage copy gives every module its own page under
       * /platform/ and points the module cards, the new Platform menu and
       * the footer at them. The pages themselves are
       * `markyos_pages_ar_6_features.md`, which is not in this repo — so
       * nine links on the homepage, nine in the menu and one in the footer
       * would be eleven 404s the day the copy landed.
       *
       * Each one redirects to the page that covers that feature today. Two
       * of them, `/platform/brand-brain` and `/platform/bilingual`, were
       * *already* 404ing before this change: the brand brain's link was
       * written at copy v2.0 against a page that was never built, and the
       * bilingual section has pointed at `/platform/bilingual` since it was
       * written, where the page is `/platform/arabic`. Neither was caught,
       * because `check:nav` walks the header and the footer and these were
       * in section copy.
       *
       * `permanent: false`, and deliberately: these are placeholders, not
       * moves. A 308 is cached by the browser and by every intermediary, so
       * shipping one here would mean readers still being sent to /platform
       * weeks after the real page existed. Delete the entry when the page
       * lands; do not change it to permanent.
       */
      ...[
        ["/platform/discovery-forms", "/solutions/discovery"],
        ["/platform/strategy-hub", "/platform"],
        ["/platform/moodboards", "/platform"],
        ["/platform/asset-library", "/platform"],
        ["/platform/guideline-sites", "/solutions/guideline-sites"],
        ["/platform/studio-board", "/solutions/client-projects"],
        ["/platform/handoff", "/solutions/client-handoff"],
        ["/platform/brand-voice", "/solutions/brand-voice"],
        ["/platform/tone-checker", "/solutions/tone-checker"],
        ["/platform/team-and-sharing", "/solutions/company-rollout"],
        ["/platform/brand-brain", "/platform"],
        ["/platform/bilingual", "/platform/arabic"],
      ].flatMap(([from, to]) => [
        { source: from, destination: to, permanent: false },
        { source: `/en${from}`, destination: `/en${to}`, permanent: false },
      ]),
    ];
  },
};

/*
 * `withPayload` adds what the admin panel needs to build: the SCSS pipeline
 * for Payload's own stylesheets, and the server-only packages that must stay
 * out of the client bundle. The marketing site's config above is untouched by
 * it.
 */
export default withPayload(nextConfig);
