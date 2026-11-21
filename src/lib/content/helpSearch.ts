import "server-only";
import { contentSiteKey } from "./djangoClient";
import { clientIp, visitorHash } from "@/lib/visitor";

/* Shared by the Help Center search routes (app/api/help/search). */

/** Do Not Track or Global Privacy Control: never log this visitor's searches. */
export const optOut = (request: Request) =>
  request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1";

/** Signed with the site key; the visitor named by today's anonymous hash. */
export function upstreamHeaders(request: Request): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Content-Key": contentSiteKey(),
    "X-Visitor": visitorHash(clientIp(request), request.headers.get("user-agent") ?? ""),
  };
}

