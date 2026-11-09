/*
 * Matching, folded.
 *
 * Arabic is written with and without its short vowels and with four shapes of
 * alif, and a reader typing "استبيان" should find «الاستبيان» whichever way
 * either was typed. So both sides are stripped of diacritics and tatweel and
 * their alif, ya and ta-marbuta forms are normalised before comparison —
 * which is the smallest thing that makes an Arabic search feel like a search
 * rather than a trap. `localeCompare` would not help: this is containment,
 * not ordering.
 */
export function fold(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}
