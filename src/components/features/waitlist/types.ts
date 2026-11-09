/** What the visitor sends: the address, and which list it is for. */
export type WaitlistRequest = {
  email: string;
  /** Which list this is, so one endpoint can serve several forms. */
  topic: string;
};

/** How a submit ended. `pending` is the endpoint saying it is not wired up yet. */
export type WaitlistResult = "sent" | "pending" | "failed";

export type SignupState = "idle" | "sending" | WaitlistResult;
