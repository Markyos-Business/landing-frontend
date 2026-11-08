"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

/*
 * The transition between pages.
 *
 * React's `<ViewTransition>` over the browser's View Transitions API, which is
 * what `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`
 * prescribes for this version of Next and which needs no configuration in the
 * App Router. It is the reason react and react-dom moved from 19.2.8 to
 * 19.3.1: the component does not exist before 19.3, not even behind an
 * `unstable_` name, and nothing else in the bump is used here.
 *
 * Where the API is unsupported the navigation simply happens, instantly, the
 * way it did before — the same property the scroll reveals have, and the
 * reason neither of them needed a fallback written for it.
 *
 * ── Why this is a template and not nine wrappers ───────────────────────────
 *
 * The guide says to put the wrapper in each `page.tsx`, "not the layout",
 * because a layout persists across navigations and so its enter and exit
 * never fire. A template is the third thing: `template.md` in the same docs
 * says it is rendered between a layout and its children and is given its own
 * key, so unlike a layout it does not persist. The guide's reason to avoid a
 * layout is exactly the property a template does not have.
 *
 * What that buys is that there is one of these instead of nine — and more to
 * the point, that a page added next month is covered without anybody
 * remembering this file exists. The three `page.tsx` files with an early
 * `return <NotTranslated …/>` would each have needed the wrapper twice.
 *
 * ── Why the key is the pathname ────────────────────────────────────────────
 *
 * Nine of this site's destinations — /pricing, /platform, /about, every
 * /solutions page — are the *same* `app/[lang]/[...slug]/page.tsx` with
 * different params. React sees one component in one position with new props,
 * which is an update, and an update is not an exit followed by an enter: with
 * no key the most common navigation on the site would be the one that did not
 * animate. Keying on the pathname is what makes React treat the two as a
 * pair, and it is the guide's own answer for switching content inside one
 * route. It is also why this file is a Client Component — the pathname is not
 * knowable on the server — and that costs nothing: `children` is still
 * server-rendered and arrives here as a prop, so no page becomes a client
 * page.
 *
 * ── Why it crossfades upward instead of sliding sideways ───────────────────
 *
 * The guide's headline pattern is a directional slide: forward one way, back
 * the other, with `transitionTypes` on each `<Link>` saying which is which.
 * Two reasons that is the wrong pattern here.
 *
 * This site has no forward. The guide is careful that the type "is not
 * automatic — you decide which links are forward and which are back based on
 * your app's navigation hierarchy", and this hierarchy is flat: a header of
 * nine destinations, any of which reaches any other. There is no depth for a
 * direction to encode, so every slide would be a direction invented to have
 * something to animate.
 *
 * And a slide is physical. `::view-transition-old/new` are pseudo-elements on
 * the document root, outside the element tree, so they cannot be written with
 * a logical property and CSS has no logical translate to reach for — the site
 * would need the sign of its own slide flipped for Arabic, the pairing that
 * has already caused three bugs on the homepage (see `--mk-dir` in
 * globals.css). The block axis has no such problem: up is up in both locales.
 * So a page arrives the way everything on it now arrives, which also means
 * one motion idea on the site rather than two.
 *
 * `default="none"` keeps this from animating on transitions it is not the
 * subject of. The paint is `::view-transition-*(.mk-page-in|out)` in
 * globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="mk-page-in" exit="mk-page-out" default="none">
      {children}
    </ViewTransition>
  );
}
