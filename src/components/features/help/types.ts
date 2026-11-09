import type { IconName } from "@/components/ui";

export type HelpPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
};

export type HelpCategory = {
  name: string;
  icon: IconName;
  count: number;
};

/** The strings the help centre's search and lists need, already localised. */
export type HelpLabels = {
  search: string;
  placeholder: string;
  clear: string;
  categories: string;
  all: string;
  noMatch: string;
  suggestions: string;
};
