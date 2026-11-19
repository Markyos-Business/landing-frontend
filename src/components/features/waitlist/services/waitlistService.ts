import type { WaitlistRequest, WaitlistResult } from "../types";

/** Persist through the website route; failures never claim the address was saved. */
export async function joinWaitlist(request: WaitlistRequest): Promise<WaitlistResult> {
  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
