/*
 * Deep merge, used for exactly one thing: layering a partial Arabic
 * dictionary over the complete English one.
 *
 * This mirrors the `fallback: true` rule the CMS architecture already commits
 * to for Payload — "an unfinished Arabic draft falls back to English rather
 * than rendering blank". The same rule has to hold for page copy, because the
 * alternative while the Arabic is being transcreated is a hole in the page
 * that only an Arabic reader ever sees.
 *
 * Arrays are replaced, never merged element-wise. A translated list of four
 * proof points is a different list, not four patches, and index-wise merging
 * would silently pair the third Arabic line with the second English one.
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override as T;

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    result[key] = deepMerge((base as Record<string, unknown>)[key], value);
  }
  return result as T;
}
