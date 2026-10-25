import { deepMerge } from "@/lib/i18n/merge";
import type { SiteCopy } from "../types";
import { copy as en } from "../en";
import { overrides } from "./overrides";

/**
 * The Arabic dictionary: the transcreated fields in `overrides.ts`, layered
 * over the complete English copy.
 *
 * The English import is what makes the fallback work, and it costs nothing at
 * runtime that matters — both dictionaries are server-only, so neither reaches
 * the browser.
 */
export const copy: SiteCopy = deepMerge(en, overrides);
