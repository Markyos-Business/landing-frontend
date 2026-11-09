import type { NavItemCopy } from "@/content/types";
import type { Locale } from "@/lib/i18n/locales";

export type PanelProps = {
  id: string;
  hidden: boolean;
  item: NavItemCopy;
  locale: Locale;
  panelRef: (node: HTMLDivElement | null) => void;
};
