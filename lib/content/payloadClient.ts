import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";

/*
 * The Local API handle.
 *
 * `getPayload` is in-process: no HTTP, no second service, no network hop
 * between the marketing site and its CMS. That is the specific reason Payload
 * was chosen over a hosted CMS, and this one-line module is where the benefit
 * is actually taken.
 *
 * Payload caches the instance itself, so calling this per request is correct
 * and cheap.
 */
export const payloadClient = () => getPayload({ config });

/**
 * Run a CMS read that must never take the site down.
 *
 * Every content read on this site is an *enhancement*: the page has approved
 * copy in the codebase and falls back to it. So a database that is
 * unreachable, a migration mid-flight, or a fresh deploy with no CMS
 * provisioned yet should all produce the built-in page — not a 500 on the
 * homepage.
 *
 * The error is logged rather than swallowed silently, because "the CMS is
 * down and the site looks subtly older than it should" is a thing someone
 * needs to be able to find out.
 */
export async function safeRead<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.warn(`[cms] ${label} unavailable — using built-in content. ${describe(error)}`);
    return fallback;
  }
}

/*
 * A one-line reason.
 *
 * Drizzle attaches the failed SQL to its errors, and for a wide query like the
 * homepage global that is several thousand characters of generated SELECT. Logged
 * raw, a single fallback buries the rest of the build output and looks like a
 * catastrophe rather than a missing table — so the message is summarised and the
 * query is dropped.
 *
 * The most common cause by far is the first case below: a database that exists
 * but has no tables yet, which is simply a CMS nobody has started. Saying so
 * directly saves the reader from reading SQL to find out.
 */
function describe(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (/no such table|does not exist|relation .* does not exist/i.test(message)) {
    return "No CMS tables yet — run the admin once at /admin to create them.";
  }
  if (/unable to open|connect|ECONNREFUSED|ENOTFOUND|timeout/i.test(message)) {
    return "Cannot reach the database. Check DATABASE_URI.";
  }

  // Anything else: the first line only, capped. Enough to search for.
  return message.split(String.fromCharCode(10))[0].slice(0, 160);
}
