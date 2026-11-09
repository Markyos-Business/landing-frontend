import Image from "next/image";
import type { ArticleSummary } from "@/lib/content";
import type { Locale } from "@/lib/i18n/locales";
import { Eyebrow, Glow, Icon, Mark } from "@/components/ui";
import type { CollectionCopy } from "./copy";

export function formatDate(value: string, locale: Locale): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/*
 * Which of the four cover grounds a piece gets.
 *
 * Hashed from the category rather than from the slug, so every piece in a
 * category shares a ground and the index reads as sections of a magazine
 * instead of a bag of colours. Deterministic, so it does not change between
 * the server render and the client, and stable across a rebuild.
 */
export function tone(key: string | undefined): number {
  if (!key) return 0;
  let sum = 0;
  for (let i = 0; i < key.length; i += 1) sum = (sum + key.charCodeAt(i)) % 1024;
  return sum % 4;
}

/*
 * A cover.
 *
 * `heroImage` wins whenever a piece has one — the day editorial starts
 * shooting, nothing here changes. Without one it is typeset: the category on
 * a mixed-blue ground, with the mark in the corner. `aria-hidden` either way,
 * because the title it sits above already says what the piece is.
 */
export function Cover({
  post,
  word,
  size = "card",
}: {
  post: ArticleSummary;
  /*
   * What the cover says when the piece has no category.
   *
   * Not a hypothetical: the first post published through the CMS had none,
   * and the cover came out as an empty gradient with a mark in the corner.
   * The collection's own name is always true and always present, which is
   * the only kind of fallback worth having.
   */
  word?: string;
  size?: "feature" | "card" | "thumb";
}) {
  if (post.heroImage) {
    return (
      <Image
        src={post.heroImage}
        alt={post.heroImageAlt ?? ""}
        width={1600}
        height={900}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <span className="mk-cover" data-tone={tone(post.category)} data-size={size} aria-hidden="true">
      {size === "thumb" ? null : (
        <span className="mk-cover-word mk-bidi">{post.category ?? word ?? ""}</span>
      )}
      <span className="mk-cover-mark">
        <Mark size={size === "thumb" ? 18 : 26} />
      </span>
    </span>
  );
}

/**
 * A standing notice on anything from the seed source.
 *
 * `.mk-inset` is a panel recessed *into a card* and this one sits on the
 * page, so it is built the way everything else on this ground lifts off it:
 * white, a ring, and an accent edge marking it as an aside.
 */
export function ProvisionalNote({ text }: { text: string }) {
  return (
    <aside className="flex gap-3 rounded-[var(--radius-widget)] border-s-2 border-s-[var(--accent)] bg-[var(--surface-1)] p-4 shadow-[0_0_0_1px_var(--hairline)]">
      <Icon name="comments" size={18} className="mt-0.5 flex-none text-[var(--accent-text)]" />
      <p className="mk-bidi text-[length:var(--fs-ui)] leading-[1.6] text-[var(--text-muted)]">
        {text}
      </p>
    </aside>
  );
}

export function IndexHero({ copy }: { copy: CollectionCopy }) {
  return (
    <section
      aria-labelledby="coll-heading"
      className="relative overflow-clip pt-[clamp(3rem,7vw,5rem)] pb-[clamp(2.5rem,5vw,4rem)]"
    >
      <Glow className="mk-center-x -top-32 w-[min(54rem,110%)]" />
      {/* Centred, like every other hub on the site. The articles below stay
          on the start edge, where long-form belongs. */}
      <div className="mk-seq-load mk-container relative flex flex-col items-center text-center">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 id="coll-heading" className="mk-load-move mk-h2-lg mk-bidi mt-4 max-w-[46rem]">
          {copy.title}
        </h1>
        <p className="mk-load-move mk-lead mk-bidi mt-5 max-w-[40rem]">{copy.lead}</p>
      </div>
    </section>
  );
}

/*
 * The blog: one piece to read now, then the rest to browse.
 *
 * The newest piece takes the full height of the opening row with the four
 * after it listed beside it, which is the composition the reference uses and
 * the reason it works: a reader who came for "what's new" is answered by the
 * big one, and a reader who came back after a fortnight scans the four.
 * Everything from the sixth on is the grid below.
 */
