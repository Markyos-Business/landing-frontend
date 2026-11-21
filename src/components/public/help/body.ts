import type { Locale } from "@/lib/i18n/locales";

/*
 * A help article's body, made ready for its page (C4), on the server.
 *
 * The platform cleans the HTML against an allowlist before it is stored and
 * again before it is served, so this works on known markup: no scripts, no
 * styles, no attributes beyond the allowlist. What it adds:
 *
 * - an id on every h2/h3, an anchor link beside it, and the table of contents
 *   built from them;
 * - `loading="lazy"` on images, an empty alt where one is missing (the
 *   platform refuses to publish an image without alt text; this is only a
 *   guard), and relative image URLs made absolute against the API;
 * - videos: the editor stores a link marked `video-embed`; a YouTube or Vimeo
 *   link becomes a lazy-loaded player (youtube-nocookie, so nothing is set
 *   before the reader presses play), with the link kept for print. Any other
 *   link stays a link;
 * - in Arabic, each run of Latin letters and digits (product names, URLs,
 *   PDF, DNS…) wrapped in <bdi>, so it can't reorder the sentence around it.
 *   Never inside <pre> or <code>, which are left exactly as written.
 */

export type TocItem = { id: string; text: string; level: 2 | 3 };

const TAG = /(<[^>]+>)/;
const LATIN_RUN = /[A-Za-z0-9](?:[A-Za-z0-9.,:/@_+&#%=?-]*[A-Za-z0-9/])?(?:\s+[A-Za-z0-9](?:[A-Za-z0-9.,:/@_+&#%=?-]*[A-Za-z0-9/])?)*/g;

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A heading's id: its words, joined by hyphens, in either script. */
function headingId(label: string, taken: Set<string>): string {
  const base =
    label
      .toLowerCase()
      .replace(/[ً-ْـ]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "section";
  let id = base;
  for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
  taken.add(id);
  return id;
}

/** The player URL for a YouTube or Vimeo link, or null. */
/** `lang` sets the player's own interface language (YouTube). */
export function videoSource(href: string, lang: Locale = "en"): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{6,})/)?.[1] ?? null;
  } else if (host === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0] || null;
  }
  if (id && /^[\w-]{6,}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}?hl=${lang}`;
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const vid = url.pathname.match(/(\d{5,})/)?.[1];
    if (vid) return `https://player.vimeo.com/video/${vid}?dnt=1`;
  }
  return null;
}

export function prepareHelpBody(
  html: string,
  {
    locale,
    origin,
    anchorLabel,
    videoTitle,
  }: {
    locale: Locale;
    /** The API's origin, for image URLs stored relative to it. */
    origin: string;
    /** The anchor link's accessible name, given the heading's text. */
    anchorLabel: (heading: string) => string;
    /** A video frame's title, given its position. */
    videoTitle: (n: number) => string;
  },
): { html: string; toc: TocItem[]; words: number } {
  const toc: TocItem[] = [];
  const taken = new Set<string>();
  let videos = 0;

  let out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level: string, inner: string) => {
    const label = text(inner);
    const id = headingId(label, taken);
    toc.push({ id, text: label, level: Number(level) as 2 | 3 });
    return (
      `<h${level} id="${id}">${inner}` +
      `<a class="mk-anchor" href="#${id}" aria-label="${escape(anchorLabel(label))}">` +
      `<i class="las la-link" aria-hidden="true"></i></a></h${level}>`
    );
  });

  out = out.replace(/<img\b([^>]*)>/g, (_, attrs: string) => {
    let a = attrs.replace(/\s*\/$/, "");
    a = a.replace(/\bsrc="(\/(?!\/)[^"]*)"/, (_m, src: string) => `src="${origin}${src}"`);
    if (!/\balt=/.test(a)) a += ' alt=""';
    return `<img${a} loading="lazy" decoding="async">`;
  });

  out = out.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g, (whole, attrs: string) => {
    if (!/class="[^"]*\bvideo-embed\b/.test(attrs)) return whole;
    const href = attrs.match(/\bhref="([^"]*)"/)?.[1]?.replace(/&amp;/g, "&") ?? "";
    const src = videoSource(href, locale);
    if (!src) return whole;
    videos += 1;
    return (
      `<span class="mk-video"><iframe src="${escape(src)}" title="${escape(videoTitle(videos))}" ` +
      `loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen ` +
      `referrerpolicy="strict-origin-when-cross-origin"></iframe></span>` +
      `<a class="mk-video-print" href="${escape(href)}">${escape(videoTitle(videos))}</a>`
    );
  });

  if (locale === "ar") out = isolateLatin(out);

  const words = text(html).split(/\s+/).filter(Boolean).length;
  return { html: out, toc, words };
}

/** Wraps Latin runs in text (outside tags, <pre>, <code>, <a> anchors) in <bdi>. */
function isolateLatin(html: string): string {
  let raw = 0;
  return html
    .split(TAG)
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<(pre|code|bdi|iframe)\b/i.test(part)) raw += 1;
        else if (/^<\/(pre|code|bdi|iframe)>/i.test(part)) raw = Math.max(0, raw - 1);
        return part;
      }
      if (raw > 0 || !/[A-Za-z0-9]/.test(part)) return part;
      // Entities (&amp; …) are left whole: a <bdi> inside one breaks it.
      return part
        .split(/(&[#A-Za-z0-9]+;)/)
        .map((piece) => (piece.startsWith("&") && piece.endsWith(";") ? piece : piece.replace(LATIN_RUN, (run) => `<bdi>${run}</bdi>`)))
        .join("");
    })
    .join("");
}

/** Minutes to read, at about 200 words a minute; at least one. */
export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200));
