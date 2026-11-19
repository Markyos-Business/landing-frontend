/**
 * Which deployment this build is: "production", "preview" (staging and every
 * branch preview) or "" (local). next.config.ts stamps it into the browser
 * bundle as MARKYOS_DEPLOY_ENV at build time, so a client component and the
 * server that rendered it always agree; on the server Vercel's own VERCEL_ENV
 * answers before the stamp exists (next.config itself reads this module).
 */
export const DEPLOY_ENV: string = process.env.MARKYOS_DEPLOY_ENV || process.env.VERCEL_ENV || "";

/**
 * A deployment's address when its env var is missing.
 *
 * Previews fall back to staging and production to production, never across:
 * a staging site that silently sent sign-ups to the production app (it did,
 * until 19 Nov 2026) is worse than one with a slightly wrong link.
 */
export function byDeployment(values: { production: string; preview: string; local: string }): string {
  if (DEPLOY_ENV === "preview") return values.preview;
  if (DEPLOY_ENV === "production") return values.production;
  return values.local;
}
