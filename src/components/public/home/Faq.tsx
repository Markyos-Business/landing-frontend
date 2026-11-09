import type { Locale } from "@/lib/i18n/locales";
import { Words, Chip, Icon } from "@/components/ui";
import type { FaqCopy, SiteCopy } from "@/content/types";
import { Band, Display, INK, PANEL, TextLink } from "./landing";

/*
 * The FAQ.
 *
 * ── Still details/summary ────────────────────────────────────────────────
 *
 * The design file builds this as nine buttons driving a `grid-template-rows`
 * transition, which needs JavaScript. Native `<details>` keeps every answer
 * open to a crawler, findable with the browser's own find, and expandable
 * before any script loads — an FAQ built from useState is invisible to the
 * search engine it exists to feed. So the look is traced and the mechanism
 * is not: the 32px round toggle, the rotating plus and the 68px row are the
 * design file's; the disclosure is the platform's.
 *
 * The plus rotates to an x rather than swapping for a minus, which is one
 * glyph instead of two and cannot land a frame where neither is painted.
 * `group-open` drives it off the element's own state, so it stays correct if
 * a browser opens a `<details>` without a click — which find-in-page does.
 *
 * On a narrow measure, which is right: this is the only part of the page
 * somebody reads line by line looking for one answer, and a 1100px-wide
 * question is hard to scan down.
 *
 * An answer may mention something that has not shipped. When it does it names
 * the feature and gets the same chip the rest of the page uses, so the FAQ
 * cannot quietly become the one place on the site that over-promises.
 */

export function Faq({ copy, chips, locale }: {
  locale: Locale; copy: FaqCopy; chips: SiteCopy["chips"] }) {
  return (
    <Band id="faq" labelledBy="faq-heading" white width={860}>
      <Display id="faq-heading" size="h3" style={{ marginBlockEnd: 48 }}>
        <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
      </Display>

      <div className="mk-still mk-seq" style={{ display: "flex", flexDirection: "column" }}>
        {copy.items.map((item) => (
          <details
            key={item.question}
            className="group"
            style={{ boxShadow: "0 -1px 0 rgba(11,11,15,.08)" }}
          >
            <summary
              className="mk-faq-summary flex cursor-pointer list-none items-center gap-4"
              style={{ minBlockSize: 68, padding: "16px 0" }}
            >
              <span
                className="mk-bidi"
                style={{ flex: 1, fontSize: 17, fontWeight: 500, color: INK }}
              >
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="flex-none grid place-items-center rounded-full transition-colors group-open:bg-[rgba(0,153,255,.1)]"
                style={{ inlineSize: 32, blockSize: 32, background: PANEL }}
              >
                <Icon
                  name="plus"
                  size={16}
                  className="transition-[transform,color] duration-300 group-hover:text-[#0055FF] group-open:rotate-45 group-open:text-[#0055FF]"
                />
              </span>
            </summary>
            <p
              className="mk-bidi"
              style={{
                margin: 0,
                padding: "0 0 22px",
                paddingInlineEnd: 48,
                fontSize: 16,
                lineHeight: 1.9,
                color: "rgba(11,11,15,.66)",
              }}
            >
              {item.coming ? (
                <>
                  <Chip feature={item.coming} chips={chips} />{" "}
                </>
              ) : null}
              {item.answer}
            </p>
          </details>
        ))}
      </div>

      {/* v3 §2.9 keeps three questions here and sends the rest to the
          pricing page, where the deck answers all fourteen. Without this
          link the nine that left the homepage have no route at all. */}
      {copy.link ? (
        <p style={{ margin: "32px 0 0" }}>
          <span className="mk-atomic">
            <TextLink locale={locale} href={copy.link.href}>{copy.link.label}</TextLink>
          </span>
        </p>
      ) : null}
    </Band>
  );
}
