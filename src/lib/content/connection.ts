/** One server-side API origin for content, CMS redirects and page-view writes. */
export function contentApiUrl(): string {
  const explicit = process.env.CONTENT_API_URL?.trim();
  const fallback = process.env.VERCEL_ENV === "preview"
    ? "https://api-staging.markyos.com/api/v1"
    : process.env.NODE_ENV === "development"
      ? "http://localhost:8010/api/v1"
      : "https://api.markyos.com/api/v1";
  return (explicit || fallback).replace(/\/+$/, "");
}
