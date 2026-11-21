import type { IconName } from "@/components/ui";

/*
 * A category's icon, as the platform stores it (a Line Awesome glyph name
 * from the admin's CATEGORY_ICONS list), mapped onto this site's icon names.
 * Anything unknown is `book`: neutral, never wrong.
 */
const GLYPHS: Record<string, IconName> = {
  "question-circle": "help",
  book: "book",
  play: "play",
  user: "user",
  users: "users",
  lock: "lock",
  key: "key",
  "credit-card": "creditCard",
  cog: "cog",
  palette: "palette",
  shapes: "shapes",
  image: "image",
  "file-alt": "fileAlt",
  "clipboard-list": "form",
  "chart-line": "chartLine",
  bullseye: "bullseye",
  "layer-group": "layers",
  globe: "globe",
  language: "languages",
  sitemap: "sitemap",
  "shield-alt": "shieldAlt",
  envelope: "envelope",
  sliders: "sliders",
  star: "star",
};

export const categoryIcon = (glyph: string): IconName => GLYPHS[glyph] ?? "book";
