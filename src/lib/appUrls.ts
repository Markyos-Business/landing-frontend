/** Public platform origin; set per deployment so previews can use staging. */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://app.markyos.com").replace(/\/+$/, "");

/** Keep historical website registration URLs while targeting the actual form. */
export function appAuthHref(href: string): string {
  const url = new URL(href, `${APP_URL}/`);
  if (["/start", "/register"].includes(url.pathname)) url.pathname = "/signup";
  return url.href;
}
