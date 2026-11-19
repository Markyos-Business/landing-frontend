import { byDeployment } from "./deployEnv";

/** Public platform origin: NEXT_PUBLIC_APP_URL, else the app of this deployment. */
export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  byDeployment({
    production: "https://app.markyos.com",
    preview: "https://app-staging.markyos.com",
    local: "https://app.markyos.com",
  })
).replace(/\/+$/, "");

/** Keep historical website registration URLs while targeting the actual form. */
export function appAuthHref(href: string): string {
  const url = new URL(href, `${APP_URL}/`);
  if (["/start", "/register"].includes(url.pathname)) url.pathname = "/signup";
  return url.href;
}
