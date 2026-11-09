import type { Locale } from "@/lib/i18n/locales";
import { Words } from "@/components/ui";
import type { ChoosePathCopy, PathCardCopy } from "@/content/types";
import { TextLink, Band, Display, INK, INK_55, IconTile, RING } from "./landing";
import type { IconName } from "@/components/ui";

/*
 * Three kinds of people. One ecosystem.
 *
 * ── Why three and not the hero's two ─────────────────────────────────────
 *
 * The hero forks twice because sign-up does: you are either making a brand
 * for someone else or running your own. This section is not a fork, it is a
 * description, and a freelancer reading a page that offers only "studio" or
 * "company" has to pick a lie. So the copy deck lists three, and the type
 * makes the third optional so that a locale which has not written it yet
 * renders two rather than an empty card.
 *
 * The closing line is the one that matters most and the reason the section
 * is not just three cards: the studio builds it, the company runs it, and
 * the brand moves between them whole. That is the product's actual shape.
 */

const ICONS: Record<string, IconName> = {
  studio: "users",
  freelancer: "astronaut",
  company: "building",
};

export function ChoosePath({ copy, locale }: {
  locale: Locale; copy: ChoosePathCopy }) {
  const cards: { key: string; card: PathCardCopy }[] = [
    { key: "studio", card: copy.studio },
    ...(copy.freelancer ? [{ key: "freelancer", card: copy.freelancer }] : []),
    { key: "company", card: copy.company },
  ];

  return (
    <Band id="audiences" labelledBy="audiences-heading" white>
      <Display id="audiences-heading" style={{ textAlign: "center", marginBlockEnd: 64 }}>
        <span className="mk-bidi">
              <Words>{copy.headline}</Words>
            </span>
      </Display>

      <ul
        className="mk-still mk-seq-pop"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
          gap: 16,
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {cards.map(({ key, card }) => (
          <li
            key={key}
            /* The whole card leads one place — the link at its foot is the only
               thing in it — so the card is what answers the pointer rather
               than the eight words at the bottom of it. See `.mk-reach`. */
            className="mk-reach"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 28,
              borderRadius: 26,
              background: "#F7F8FA",
              boxShadow: "0 0 0 1px rgba(11,11,15,.04)",
            }}
          >
            <IconTile name={ICONS[key]} size={46} tone="white" style={{ boxShadow: RING }} />
            <h3
              className="mk-bidi"
              style={{ margin: "18px 0 0", fontWeight: 500, fontSize: 22 }}
            >
              {card.label}
            </h3>
            <p
              className="mk-bidi"
              style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.8 }}
            >
              {card.headline}
            </p>
            {/* What they start with. The label is shared across the cards —
                one per card would make the label itself a difference between
                them, and the section depends on there being none. */}
            <p
              className="mk-bidi"
              style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.8, color: INK_55 }}
            >
              <span style={{ color: INK, fontWeight: 500 }}>{copy.youGetLabel}: </span>
              {card.youGet}
            </p>
            <div style={{ marginBlockStart: "auto", paddingBlockStart: 20 }}>
              <TextLink locale={locale} href={card.cta.href}>{card.cta.label}</TextLink>
            </div>
          </li>
        ))}
      </ul>

      {copy.closing ? (
        <p
          className="mk-bidi mk-rise"
          style={{
            margin: "52px auto 0",
            maxWidth: 680,
            textAlign: "center",
            fontSize: 17,
            lineHeight: 1.9,
            color: "rgba(11,11,15,.64)",
          }}
        >
          <Handover text={copy.closing} />
        </p>
      ) : null}
    </Band>
  );
}

/* The first sentence of the closing line is the claim, so it carries the ink. */
function Handover({ text }: { text: string }) {
  const at = text.indexOf(".");
  const stop = at === -1 ? text.indexOf("،") : at;
  if (stop === -1) return <>{text}</>;

  return (
    <>
      <b style={{ fontWeight: 500, color: INK }}>{text.slice(0, stop + 1)}</b>
      {text.slice(stop + 1)}
    </>
  );
}
