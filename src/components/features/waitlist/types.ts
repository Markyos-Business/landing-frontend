export type { WaitlistRequest } from "@/lib/waitlist";

/** The result of a durable signup request. */
export type WaitlistResult = "sent" | "failed";

export type SignupState = "idle" | "sending" | WaitlistResult;
