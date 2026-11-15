import { z } from "zod";
import { LOCALES } from "./i18n/locales";

/** Public signup lists. Beta applicants use the existing studio/company fork. */
export const SIGNUP_TOPICS = ["newsletter", "contact"] as const;
export type SignupTopic = (typeof SIGNUP_TOPICS)[number];

const signup = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  country: z.string().trim().max(60).optional(),
  locale: z.enum(LOCALES).optional(),
  // A filled honeypot is accepted and discarded by the route, never stored.
  company_url: z.string().max(2048).optional(),
});

/** One contract for the reusable signup form and the beta waitlist endpoint. */
export const WaitlistSchema = z.union([
  signup.extend({ topic: z.enum(SIGNUP_TOPICS) }),
  signup.extend({ type: z.enum(["studio", "company"]) }),
]);

export type WaitlistRequest = z.input<typeof WaitlistSchema>;
