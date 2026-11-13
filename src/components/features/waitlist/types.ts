export type { WaitlistRequest } from "@/lib/waitlist";

/** How a submit ended. `pending` is the endpoint saying it is not wired up yet. */
export type WaitlistResult = "sent" | "pending" | "failed";

export type SignupState = "idle" | "sending" | WaitlistResult;
