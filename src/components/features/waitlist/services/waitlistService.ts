import type { WaitlistRequest, WaitlistResult } from "../types";

/*
 * Post an address to `/api/waitlist`.
 *
 * The endpoint returns **501** on purpose: there is no mailing list wired up
 * yet, and a form that silently swallows an address is worse than no form,
 * because the visitor believes they subscribed. So the 501 is reported as
 * what it is — `pending`, "not connected yet" — rather than as a generic
 * failure. See docs/OPEN-DECISIONS.md §2, which is the decision this is
 * waiting on.
 */
export async function joinWaitlist(request: WaitlistRequest): Promise<WaitlistResult> {
  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    });
    return response.ok ? "sent" : response.status === 501 ? "pending" : "failed";
  } catch {
    return "failed";
  }
}
