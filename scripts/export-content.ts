import fs from "node:fs";
import path from "node:path";
import { getPayload, type Payload } from "payload";
import { convertLexicalToHTML, defaultHTMLConverters } from "@payloadcms/richtext-lexical/html";
import config from "../payload.config";

/*
 * Export the website's Payload content for the Markyos platform CMS.
 *
 *   npm run cms:export -- <output folder>
 *
 * Writes `content.json` and `files/` (every media file) into the folder, for
 * the backend's `python manage.py import_payload <folder> --as <email>`.
 * Reads only: nothing in Payload changes.
 *
 * Which Payload it reads is the usual configuration: DATABASE_URI for
 * Postgres (staging), otherwise the local SQLite file. Media files come from
 * R2 when R2_* is set, otherwise from the local `media/` folder.
 *
 * Article bodies are converted from Lexical to HTML here, by Payload's own
 * converter, because only Payload knows its node types. An image inside the
 * text is written as `payload-media:<id>`: Payload's file route no longer
 * exists, so the import swaps in the image's new address.
 */

type Doc = Record<string, unknown>;
type Localized<T> = { en?: T; ar?: T };

/** Payload collection → the platform's section key. */
const SECTIONS = {
  posts: "blog",
  guides: "guides",
  helpArticles: "help",
  comparisons: "compare",
  updates: "whatsNew",
} as const;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const loc = <T,>(v: unknown): Localized<T> => (v && typeof v === "object" ? (v as Localized<T>) : {});
/** A relation's id, whether Payload returned the document or just its id. */
const idOf = (v: unknown): string | undefined =>
  v == null ? undefined : typeof v === "object" ? String((v as Doc).id ?? "") || undefined : String(v);

const html = (state: unknown): string => {
  if (!state || typeof state !== "object") return "";
  return convertLexicalToHTML({
    data: state as Parameters<typeof convertLexicalToHTML>[0]["data"],
    disableContainer: true,
    converters: {
      ...defaultHTMLConverters,
      upload: ({ node }) => {
        const n = node as unknown as { value?: unknown; fields?: { caption?: string } };
        const key = idOf(n.value);
        if (!key) return "";
        const doc = (typeof n.value === "object" ? n.value : {}) as Doc;
        const alt = str(loc<string>(doc.alt).en ?? doc.alt).replace(/"/g, "&quot;");
        const caption = str(n.fields?.caption);
        const img = `<img src="payload-media:${key}" alt="${alt}">`;
        return caption ? `<figure>${img}<figcaption>${caption}</figcaption></figure>` : `<figure>${img}</figure>`;
      },
    },
  });
};

async function all(payload: Payload, collection: string): Promise<Doc[]> {
  const result = await payload.find({
    collection: collection as never,
    locale: "all",
    depth: 2,
    pagination: false,
    overrideAccess: true,
    // `_status` is a hidden field on the editorial collections.
    showHiddenFields: true,
  });
  return result.docs as unknown as Doc[];
}

/** The file's bytes, from R2 when configured, else from local disk. */
async function readFile(filename: string): Promise<Buffer | null> {
  if (process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
    const sdk = "@aws-sdk/client-s3";
    const { S3Client, GetObjectCommand } = await import(sdk);
    const client = new S3Client({
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
    });
    const object = await client.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: `marketing/${filename}` }));
    const bytes = await object.Body?.transformToByteArray();
    return bytes ? Buffer.from(bytes) : null;
  }
  const local = path.resolve(process.cwd(), "media", filename);
  return fs.existsSync(local) ? fs.readFileSync(local) : null;
}

async function main(): Promise<void> {
  const out = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!out) throw new Error("Pass the output folder as the first argument.");
  fs.mkdirSync(path.join(out, "files"), { recursive: true });
  const payload = await getPayload({ config });
  const missing: string[] = [];

  const media = [];
  for (const doc of await all(payload, "media")) {
    const key = String(doc.id);
    const filename = str(doc.filename);
    const bytes = filename ? await readFile(filename).catch(() => null) : null;
    const file = bytes ? `${key}-${filename}` : "";
    if (bytes) fs.writeFileSync(path.join(out, "files", file), bytes);
    else missing.push(filename || key);
    const alt = loc<string>(doc.alt);
    media.push({
      key,
      file,
      fileName: filename,
      mimeType: str(doc.mimeType),
      size: Number(doc.filesize ?? bytes?.length ?? 0),
      altEn: str(alt.en).trim(),
      altAr: str(alt.ar).trim(),
      credit: str(doc.credit),
    });
  }

  const labels = async (collection: string) =>
    (await all(payload, collection)).map((doc) => {
      const label = loc<string>(doc.label);
      return { key: String(doc.id), slug: str(doc.slug), labelEn: str(label.en), labelAr: str(label.ar) };
    });

  const authors = (await all(payload, "authors")).map((doc) => {
    const role = loc<string>(doc.role);
    const bio = loc<string>(doc.bio);
    return {
      key: String(doc.id),
      name: str(doc.name),
      roleEn: str(role.en),
      roleAr: str(role.ar),
      bioEn: str(bio.en),
      bioAr: str(bio.ar),
      avatarKey: idOf(doc.avatar),
    };
  });

  const articles = [];
  for (const [collection, kind] of Object.entries(SECTIONS)) {
    for (const doc of await all(payload, collection)) {
      const title = loc<string>(doc.title);
      const excerpt = loc<string>(doc.excerpt);
      const body = loc<unknown>(doc.body);
      const seoTitle = loc<string>(doc.seoTitle);
      const seoDescription = loc<string>(doc.seoDescription);
      const hero = loc<unknown>(doc.heroImage);
      const translations: Record<string, unknown> = {};
      for (const locale of ["en", "ar"] as const) {
        if (!str(title[locale]).trim()) continue;
        translations[locale] = {
          title: str(title[locale]),
          excerpt: str(excerpt[locale]),
          bodyHtml: html(body[locale]),
          seoTitle: str(seoTitle[locale]),
          seoDescription: str(seoDescription[locale]),
          heroKey: idOf(hero[locale]),
        };
      }
      articles.push({
        kind,
        slug: str(doc.slug),
        status: doc._status === "published" ? "published" : "draft",
        publishedAt: str(doc.publishedAt) || undefined,
        provisional: doc.provisional === true,
        authorKey: idOf(doc.author),
        categoryKey: idOf(doc.category),
        tagKeys: Array.isArray(doc.tags) ? doc.tags.map(idOf).filter(Boolean) : [],
        guideType: str(doc.guideType),
        competitorName: str(doc.competitorName),
        downloadKey: idOf(doc.downloadFile),
        translations,
      });
    }
  }

  const redirects = (await all(payload, "redirects")).map((doc) => ({
    from: str(doc.from),
    to: str(doc.to),
    type: str(doc.type) || "301",
  }));

  const content = {
    exportedAt: new Date().toISOString(),
    source: process.env.DATABASE_URI ? "postgres" : "sqlite",
    media,
    categories: await labels("categories"),
    tags: await labels("tags"),
    authors,
    articles,
    redirects,
  };
  fs.writeFileSync(path.join(out, "content.json"), JSON.stringify(content, null, 2));

  const published = articles.filter((a) => a.status === "published").length;
  console.log(
    `Exported ${articles.length} articles (${published} published), ${media.length} media, ` +
      `${content.categories.length} categories, ${content.tags.length} tags, ${authors.length} authors, ` +
      `${redirects.length} redirects to ${out}.`,
  );
  if (missing.length) console.warn(`No file found for: ${missing.join(", ")}`);
  process.exit(0);
}

await main();
