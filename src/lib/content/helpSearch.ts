import "server-only";
import { siteHeaders } from "@/lib/visitor";

/* Shared by the Help Center search routes (app/api/help/search). */

/** Do Not Track or Global Privacy Control: never log this visitor's searches. */
export const optOut = (request: Request) =>
  request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1";

/** Signed with the site key; the visitor named by today's anonymous hash. */
export const upstreamHeaders = siteHeaders;
