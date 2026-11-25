import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { contentSiteKey } from "@/lib/content/djangoClient";

/*
 * The daily salt.
 *
 * Regenerated whenever the date changes, and never written anywhere. Once it
 * rolls over, yesterday's hashes cannot be matched to today's even by us —
 * which is the property that makes this safe to run without asking consent.
 *
 * In-memory means each server instance has its own salt, so a visitor spread
 * across instances may count more than once. That is a deliberate trade:
 * counting slightly high on unique visitors is a much smaller problem than
 * persisting a key that could link a person across days.
 */
let salt = randomBytes(32);
let saltDay = "";

function dailySalt(): Buffer {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== saltDay) {
    salt = randomBytes(32);
    saltDay = today;
  }
  return salt;
}

/** An anonymous id for one visitor, for today only. Never stored by this site. */
export function visitorHash(ip: string, userAgent: string): string {
  return createHash("sha256")
    .update(dailySalt())
    .update(ip)
    .update(userAgent)
    .digest("hex")
    .slice(0, 32);
}

/** The visitor's IP as the platform in front of this site reports it. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0]?.trim() || "0.0.0.0";
}

/**
 * Headers for a request this site's server makes to the platform on a
 * visitor's behalf: signed with the site key, and naming the visitor by
 * today's anonymous hash so the platform can rate-limit per visitor rather
 * than per server. The IP itself never leaves this server.
 */
export function siteHeaders(request: Request): Record<string, string> {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Content-Key": contentSiteKey(),
    "X-Visitor": visitorHash(clientIp(request), request.headers.get("user-agent") ?? ""),
  };
}
