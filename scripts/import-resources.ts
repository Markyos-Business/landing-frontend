import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getPayload, type Payload, type RichTextField } from "payload";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import config from "../payload.config";

/*
 * Import the written resources into the CMS, in both languages.
 *
 *   npm run cms:import -- "A:/abdulla saeed/Markyos/System/Website/Resources"
 *
 * The source is a folder per piece holding a Markdown file, a Word copy of
 * the same text for review, and its images. Forty pieces across four
 * sections, each written twice — once in Arabic and once in English.
 *
 * ── Matched by folder, not by guesswork ───────────────────────────────────
 *
 * `Arabic Resources/Blog/01-brand-strategy` and
 * `English Resources/Blog/01-brand-strategy` are the two editions of one
 * document. Checked rather than assumed: all forty pairs exist on both
 * sides, and all forty declare the same slug.
 *
 * Each file opens with a metadata table whose labels are in its own
 * language. Rather than carry a map of Arabic labels — which would break on
 * a renamed row and is unreadable in a terminal — the two tables are zipped
 * together and read by the *English* label. Also checked: all forty pairs
 * have the same rows in the same order.
 *
 * ── What is dropped, and why ──────────────────────────────────────────────
 *
 * The files carry notes from the writer to the writer, in square brackets:
 * `[CONFIRM: check Endform's export options…]`, `[CHIP: Coming 2027]`,
 * `[Button: Download the template →]`. They are instructions about the
 * page, not text for the page, and they do not go into the CMS. Every one
 * removed is printed at the end with the piece it came from, so the list of
 * open questions survives the import instead of being deleted by it.
 *
 * `**[Link: Some label →]** ` + a backticked path is the writer's shorthand
 * for a link, and that one is kept — converted into an actual link, because
 * dropping it would lose a cross-reference the writing depends on.
 *
 * ── What is carried ───────────────────────────────────────────────────────
 *
 * Title, slug, excerpt (the meta description, which is written as a one or
 * two sentence summary and is exactly what the index card wants), SEO title,
 * category, cover image, body, and for the release notes their release date.
 *
 * Markdown becomes Lexical through Payload's own converter, using the
 * editor config off the collection's own `body` field — so tables, lists,
 * quotes and links come out in the shape the editor and the renderer
 * already agree on, rather than a hand-rolled approximation of it.
 *
 * ── Idempotent ────────────────────────────────────────────────────────────
 *
 * Matched on slug. A piece that is already there is left alone, including
 * its images, so a second run cannot overwrite an edit made in the panel.
 * Pass `--replace` to delete and re-import instead, which is what to use
 * after changing this script.
 */

type Section = {
  dir: string;
  collection: "posts" | "guides" | "comparisons" | "updates";
  /** The metadata row whose value becomes the category, if any. */
  categoryRow?: string;
  /** Folders to skip: a template is not a document. */
  skip?: string[];
};

const SECTIONS: Section[] = [
  { dir: "Blog", collection: "posts", categoryRow: "Category" },
  // Guides are filed by audience rather than subject — "Studios and
  // companies" — which is what the "For" row holds.
  { dir: "Guides", collection: "guides", categoryRow: "For" },
  { dir: "Compare", collection: "comparisons" },
  // `10-monthly-template` is the blank an update is written from. Its slug
  // is literally `/[year]-[month]`.
  { dir: "Whats-New", collection: "updates", skip: ["10-monthly-template"] },
];

const LOCALES = ["ar", "en"] as const;
type Loc = (typeof LOCALES)[number];
const SIDE: Record<Loc, string> = {
  ar: "Arabic Resources",
  en: "English Resources",
};

const log = (line = "") => process.stdout.write(`${line}\n`);

/* ── reading a source file ──────────────────────────────────────────────── */

type Parsed = {
  rows: [string, string][];
  title: string;
  body: string;
  /** Cover image filename, from the body's first image. */
  cover?: string;
  coverAlt?: string;
};

function parse(file: string): Parsed {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

  // Everything before the first H1 is the metadata table; everything after
  // it is the piece. The H1 is the title and does not repeat in the body,
  // because the page template renders it.
  const split = raw.indexOf("\n# ");
  if (split === -1) throw new Error(`No H1 in ${file}`);
  const head = raw.slice(0, split);
  const rest = raw.slice(split + 3);
  const title = rest.slice(0, rest.indexOf("\n")).trim();
  let body = rest.slice(rest.indexOf("\n") + 1);

  const rows: [string, string][] = [];
  for (const line of head.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    const cells = trimmed.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
    if (cells.length < 2) continue;
    // The `| :--- | :--- |` separator, in any of its spellings.
    if (/^:?-{3,}:?$/.test(cells[0])) continue;
    rows.push([cells[0], cells.slice(1).join("|")]);
  }
  rows.shift(); // the header row: "Field | Value"

  // The first image in the body is the cover, which becomes `heroImage`.
  // Left in place it would print twice on the article page.
  let cover: string | undefined;
  let coverAlt: string | undefined;
  const first = body.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (first && /-cover\.png$/i.test(first[2])) {
    cover = first[2];
    coverAlt = first[1];
    body = body.replace(first[0], "");
  }

  return { rows, title, body: body.trim(), cover, coverAlt };
}

/* ── the writer's notes ─────────────────────────────────────────────────── */

type Note = { piece: string; note: string };

/**
 * Strip the editorial scaffolding and keep a record of every piece of it.
 *
 * Order matters here. `[Link: …]` is rewritten into a real link *before* the
 * bracket sweep runs, or the sweep would eat it.
 */
function clean(markdown: string, piece: string, notes: Note[]): string {
  let out = markdown;

  /*
   * The markers are written in the language of the file, and only the
   * unresolved-fact one kept its English name on both sides.
   *
   *   Link   / رابط   a cross-reference, followed by a backticked path
   *   Button / زر     a download or CTA the design is meant to place
   *   CHIP   / شارة   a launch-status chip
   *   CONFIRM         a fact nobody has verified yet
   *
   * Everything else in square brackets stays, and that distinction is the
   * whole care in this function: the guides and the blog posts are full of
   * fill-in-the-blank templates — "For [audience] who [need], [brand] is
   * the [category]…", «لـ [الجمهور] الذين [الحاجة]…» — and those brackets
   * are the writing. Only the five keywords above are swept.
   */
  const LINK = String.raw`Link|رابط`;
  const DROP = String.raw`CONFIRM|CHIP|Button|PLACEHOLDER|TODO|NOTE|زر|شارة`;

  // **[Link: Label →]** `/some/path`  →  [Label](/some/path)
  out = out.replace(
    new RegExp(
      String.raw`\*{0,2}\[(?:${LINK}):\s*([^\]]+?)\s*\]\*{0,2}\s*` + "`(/[^`]+)`",
      "g",
    ),
    (_m, label: string, href: string) => `[${trimArrow(label)}](${href.trim()})`,
  );

  // A link marker with no path is a cross-reference the writer had not
  // resolved. Keep the label as text, record the gap.
  out = out.replace(
    new RegExp(String.raw`\*{0,2}\[(?:${LINK}):\s*([^\]]+?)\s*\]\*{0,2}`, "g"),
    (m, label: string) => {
      notes.push({ piece, note: m.trim() });
      return trimArrow(label);
    },
  );

  // The instruction markers. Recorded, then removed.
  out = out.replace(
    new RegExp(String.raw`\*{0,2}\[(?:${DROP})\b[^\]]*\]\*{0,2}`, "gi"),
    (m) => {
      notes.push({ piece, note: m.replace(/^\*+|\*+$/g, "").trim() });
      return "";
    },
  );

  // A whole bracketed line, which is how the fact-check notes on the
  // comparison pages are written.
  out = out.replace(/^\[[^\]\n]{20,}\]\s*$/gm, (m) => {
    notes.push({ piece, note: m.trim() });
    return "";
  });

  // Tidy what the removals left: a line that held only a marker, the stray
  // bold markers around it, and a path left stranded on its own line.
  return out
    .split("\n")
    .map((line) => (line.trim() === "**" ? "" : line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Drops the trailing arrow the markers are written with. */
const trimArrow = (label: string) => label.replace(/\s*[→←]\s*$/, "").trim();

/* ── images ─────────────────────────────────────────────────────────────── */

/**
 * Upload one PNG and return its Media id.
 *
 * The Arabic and English covers are *different files with the same name* —
 * the covers carry type, and the Arabic ones are typeset in Arabic. Uploaded
 * under their own names they would collide and Payload would rename the
 * second one, leaving two Media rows whose filenames no longer say which is
 * which. They are copied to a temporary name carrying the locale first.
 */
async function upload(
  payload: Payload,
  file: string,
  alt: string,
  locale: Loc,
  cache: Map<string, number | string>,
): Promise<number | string> {
  const key = `${locale}:${path.basename(file)}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  const named = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "mk-media-")),
    `${path.basename(file, ".png")}-${locale}.png`,
  );
  fs.copyFileSync(file, named);

  const doc = await payload.create({
    collection: "media",
    locale,
    data: { alt } as never,
    filePath: named,
  });
  cache.set(key, doc.id);
  return doc.id;
}

/* ── markdown → lexical, with the figures put back ──────────────────────── */

const MARKER = (i: number) => `MKFIGURE${i}MKFIGURE`;

type Figure = { file: string; alt: string };

function liftFigures(markdown: string): { text: string; figures: Figure[] } {
  const figures: Figure[] = [];
  const text = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt: string, file: string) => {
    figures.push({ file, alt });
    // On its own paragraph, so the converter makes it a paragraph node this
    // can find and swap whole, rather than a run of text inside one.
    return `\n\n${MARKER(figures.length - 1)}\n\n`;
  });
  return { text, figures };
}

type Lex = Record<string, unknown>;

function putFiguresBack(state: Lex, ids: (number | string)[]): Lex {
  const root = state.root as Lex;
  const children = (root.children as Lex[]) ?? [];

  root.children = children.map((node) => {
    const kids = (node.children as Lex[]) ?? [];
    if (node.type !== "paragraph" || kids.length !== 1) return node;
    const text = typeof kids[0]?.text === "string" ? (kids[0].text as string) : "";
    const match = text.trim().match(/^MKFIGURE(\d+)MKFIGURE$/);
    if (!match) return node;

    const id = ids[Number(match[1])];
    if (id === undefined) return node;

    return {
      type: "upload",
      // Every lexical node with sub-fields needs its own id, which is not
      // the id of the document it points at.
      id: randomUUID(),
      relationTo: "media",
      value: id,
      fields: {},
      format: "",
      version: 3,
    };
  });

  return state;
}

/* ── the import ─────────────────────────────────────────────────────────── */

function rowMap(en: [string, string][], side: [string, string][]): Map<string, string> {
  // Read by the English label, whichever language the values are in.
  const map = new Map<string, string>();
  en.forEach(([label], i) => map.set(label, side[i]?.[1] ?? ""));
  return map;
}

const unquote = (v: string) => v.replace(/^`|`$/g, "").trim();

/** `/en/blog/brand-strategy` and `/blog/brand-strategy` are both this slug. */
const slugOf = (url: string) => unquote(url).split("/").filter(Boolean).pop() ?? "";

/** The cover row also carries the alt text, after a middle dot. */
function altFrom(row: string): string {
  const m = row.match(/(?:alt text|النص البديل)\s*:\s*(.+)$/i);
  return m ? m[1].trim() : "";
}

/**
 * One category document, with a label in each language.
 *
 * Keyed on the English label, which is the stable identity: "Strategy" and
 * «الاستراتيجية» are one category written twice, not two categories. Keyed
 * per locale instead — the first version of this — it made thirty-four
 * category rows for seventeen categories, each holding one language and
 * showing as `<No Title>` in the other, which is exactly the "don't mix the
 * languages" failure one level down from the articles.
 */
async function categoryId(
  payload: Payload,
  labels: { ar: string; en: string },
  cache: Map<string, number | string>,
): Promise<number | string | undefined> {
  const ar = labels.ar.trim();
  const en = labels.en.trim();
  if (!ar && !en) return undefined;

  const key = en || ar;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  // Match on either side, so a category the panel already has is reused
  // rather than duplicated.
  const found = await payload.find({
    collection: "categories",
    limit: 1,
    where: { or: [{ label: { equals: ar } }, { label: { equals: en } }] },
  });

  let id = found.docs[0]?.id;
  if (id === undefined) {
    id = (
      await payload.create({
        collection: "categories",
        locale: "ar",
        data: { label: ar || en } as never,
      })
    ).id;
  }
  if (en) {
    await payload.update({
      collection: "categories",
      id,
      locale: "en",
      data: { label: en } as never,
    });
  }

  cache.set(key, id);
  return id;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const replace = args.includes("--replace");
  const source = args.find((a) => !a.startsWith("--"));
  if (!source) throw new Error("Pass the Resources folder as the first argument.");
  if (!fs.existsSync(source)) throw new Error(`No such folder: ${source}`);

  const payload = await getPayload({ config });

  const notes: Note[] = [];
  const media = new Map<string, number | string>();
  const categories = new Map<string, number | string>();
  let created = 0;
  let kept = 0;

  for (const section of SECTIONS) {
    // The editor config comes off the collection's own `body` field, so the
    // converter and the editor cannot disagree about which features exist.
    const bodyField = payload.collections[section.collection].config.fields.find(
      (f) => "name" in f && f.name === "body",
    ) as RichTextField;
    const editorConfig = editorConfigFactory.fromField({ field: bodyField });

    const arDir = path.join(source, SIDE.ar, section.dir);
    const items = fs
      .readdirSync(arDir)
      .filter((name) => fs.statSync(path.join(arDir, name)).isDirectory())
      .filter((name) => !section.skip?.includes(name))
      .sort();

    log(`\n${section.dir} → ${section.collection} (${items.length})`);

    for (const [index, item] of items.entries()) {
      const files: Record<Loc, { dir: string; parsed: Parsed }> = {} as never;
      let missing = false;
      for (const locale of LOCALES) {
        const dir = path.join(source, SIDE[locale], section.dir, item);
        const md = fs.existsSync(dir) && fs.readdirSync(dir).find((f) => f.endsWith(".md"));
        if (!md) {
          log(`  SKIP    ${item} — no ${locale} markdown`);
          missing = true;
          break;
        }
        files[locale] = { dir, parsed: parse(path.join(dir, md)) };
      }
      if (missing) continue;

      const enRows = files.en.parsed.rows;
      const slug = slugOf(rowMap(enRows, enRows).get("URL") ?? "");
      if (!slug) {
        log(`  SKIP    ${item} — no URL row`);
        continue;
      }

      const existing = await payload.find({
        collection: section.collection,
        limit: 1,
        draft: true,
        where: { slug: { equals: slug } },
      });
      if (existing.docs.length > 0) {
        if (!replace) {
          kept += 1;
          log(`  kept    ${slug}`);
          continue;
        }
        await payload.delete({ collection: section.collection, id: existing.docs[0].id });
      }

      let docId: number | string | undefined;

      for (const locale of LOCALES) {
        const { dir, parsed } = files[locale];
        const map = rowMap(enRows, parsed.rows);
        const piece = `${section.dir}/${item} (${locale})`;

        const cleaned = clean(parsed.body, piece, notes);
        const { text, figures } = liftFigures(cleaned);

        const ids: (number | string)[] = [];
        for (const figure of figures) {
          const file = path.join(dir, figure.file);
          if (!fs.existsSync(file)) {
            notes.push({ piece, note: `missing image: ${figure.file}` });
            ids.push(undefined as never);
            continue;
          }
          ids.push(await upload(payload, file, figure.alt || parsed.title, locale, media));
        }

        const body = putFiguresBack(
          convertMarkdownToLexical({ editorConfig, markdown: text }) as unknown as Lex,
          ids,
        );

        /*
         * The social card.
         *
         * Named only in the metadata table — it is never placed in the body
         * — so it is read from the row rather than lifted out of the text
         * like the cover. One per piece per language at 1200x630, which is
         * what `lib/seo.ts` wanted and did not have.
         */
        let ogImage: number | string | undefined;
        const ogName = (map.get("Social image") ?? "").match(/`([^`]+\.png)`/)?.[1];
        if (ogName) {
          const file = path.join(dir, ogName);
          if (fs.existsSync(file)) {
            ogImage = await upload(payload, file, parsed.title, locale, media);
          } else {
            notes.push({ piece, note: `missing social image: ${ogName}` });
          }
        }

        let heroImage: number | string | undefined;
        if (parsed.cover) {
          const file = path.join(dir, parsed.cover);
          if (fs.existsSync(file)) {
            heroImage = await upload(
              payload,
              file,
              parsed.coverAlt || altFrom(map.get("Cover image") ?? "") || parsed.title,
              locale,
              media,
            );
          } else {
            notes.push({ piece, note: `missing cover: ${parsed.cover}` });
          }
        }

        const data: Record<string, unknown> = {
          title: parsed.title,
          slug,
          excerpt: map.get("Meta description") ?? "",
          body,
          seoTitle: map.get("SEO title") ?? undefined,
          heroImage,
          ogImage,
          provisional: false,
          _status: "published",
        };

        if (section.categoryRow) {
          data.category = await categoryId(
            payload,
            {
              ar: rowMap(enRows, files.ar.parsed.rows).get(section.categoryRow) ?? "",
              en: rowMap(enRows, files.en.parsed.rows).get(section.categoryRow) ?? "",
            },
            categories,
          );
        }
        if (section.collection === "comparisons") {
          // The product name, for the admin list. Not localized, so it is
          // taken from the English title: "Markyos vs Endform" → "Endform".
          data.competitorName = files.en.parsed.title.replace(/^.*?\bvs\.?\s*/i, "").trim();
        }

        /*
         * The release date.
         *
         * Read off the *English* row even on the Arabic pass: the date is
         * one value for the document, not a translation of one, and only
         * one of the two is machine-readable. The Arabic side writes it in
         * Arabic, which `new Date` does not parse, so reading the row in
         * the current language silently fell back to today for all nine.
         *
         * Most of them are not dates at all. The release notes were written
         * before the ship dates were fixed, so the row says "Launch week",
         * "Third week after launch", "Mid-2027 (v4.0)" — every one of them
         * carrying a [CONFIRM]. Those are reported with the rest of the
         * notes, and nothing is invented for them: they are being published
         * today, so today is the true answer until somebody sets the real
         * one in the panel.
         *
         * The seconds keep each section in the order its folders are
         * numbered, rather than in whatever order the rows come back.
         */
        if (locale === "ar") {
          const dated = rowMap(enRows, files.en.parsed.rows)
            .get("Date")
            ?.replace(/\[[^\]]*\]/g, "")
            .trim();
          // Strict: a string only counts as a date if it carries a day, a
          // month and a four-digit year. "Spring 2027" must not become the
          // first of some month because a parser was generous.
          const usable = dated && /\d{1,2}\s+\w+\s+\d{4}|\d{4}-\d{2}-\d{2}/.test(dated);
          const parsedDate = usable ? new Date(dated) : null;
          data.publishedAt =
            parsedDate && !Number.isNaN(parsedDate.getTime())
              ? parsedDate.toISOString()
              : new Date(Date.now() - index * 1000).toISOString();
          if (dated && !usable) {
            notes.push({ piece, note: `release date is not a date: "${dated}"` });
          }
        }

        if (docId === undefined) {
          const doc = await payload.create({
            collection: section.collection,
            locale,
            draft: false,
            data: data as never,
          });
          docId = doc.id;
        } else {
          await payload.update({
            collection: section.collection,
            id: docId,
            locale,
            draft: false,
            data: data as never,
          });
        }
      }

      created += 1;
      log(`  created ${slug}`);
    }
  }

  log();
  log(`${created} pieces imported, ${kept} already there. ${media.size} images uploaded.`);

  if (notes.length > 0) {
    log();
    log(`${notes.length} writer's notes were removed from the text:`);
    log();
    let last = "";
    for (const { piece, note } of notes) {
      if (piece !== last) {
        log(`  ${piece}`);
        last = piece;
      }
      log(`      ${note.replace(/\s+/g, " ")}`);
    }
  }

  process.exit(0);
}

await main();
