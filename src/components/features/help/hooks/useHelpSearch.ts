import { useId, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import type { HelpPost } from "../types";
import { fold } from "../utils/fold";

/*
 * The help centre's search state: the query, the picked category, the
 * suggestion panel and its highlighted row, and the keyboard handling that
 * makes the field an ARIA combobox. The markup is HelpBrowser's; the reasoning
 * for the combobox is in its header.
 */
export function useHelpSearch(posts: HelpPost[]) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  /* -1 is "nothing highlighted", which is the state the list opens in: the
     first suggestion is not chosen for the reader, so Enter on an untouched
     list submits nothing rather than navigating somewhere they never looked
     at. */
  const [active, setActive] = useState(-1);
  const fieldId = useId();
  const listId = `${fieldId}-suggestions`;
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const shown = useMemo(() => {
    const needle = fold(query.trim());
    return posts.filter((post) => {
      if (picked && post.category !== picked) return false;
      if (!needle) return true;
      return fold(`${post.title} ${post.excerpt} ${post.category}`).includes(needle);
    });
  }, [posts, query, picked]);

  const searching = query.trim().length > 0 || picked !== null;

  /* Six, because the panel hangs over the category tiles and a longer one
     covers the page it is meant to be a shortcut into. The list below holds
     the rest, and the count beside its heading says how many that is. */
  const suggestions = useMemo(
    () => (query.trim() ? shown.slice(0, 6) : []),
    [shown, query],
  );
  const showing = open && suggestions.length > 0;

  const move = (to: number) => {
    if (!suggestions.length) return;
    setOpen(true);
    setActive((to + suggestions.length) % suggestions.length);
  };

  /* The panel closes when focus leaves the control as a whole, not
     when it leaves the input — otherwise clicking a suggestion
     closes the list out from under the click. `relatedTarget` is
     null when focus goes to the page chrome, which also closes. */
  const onSearchBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    setActive(-1);
  };

  const onQueryFocus = () => setOpen(true);

  const onQueryKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(active - 1);
    } else if (event.key === "Enter" && showing && active >= 0) {
      event.preventDefault();
      optionRefs.current[active]?.click();
    } else if (event.key === "Escape") {
      /* First Escape closes the list, a second clears the field.
         Closing and clearing on the same press loses the query of
         anybody who pressed it to get the panel out of the way.
         `preventDefault` because this is `type="search"`, and
         Chrome's own Escape on one of those empties the field —
         which did both halves on the first press and made the two
         steps here look like they did nothing. */
      event.preventDefault();
      if (showing) setOpen(false);
      else setQuery("");
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setOpen(false);
  };

  /* Selecting a tile a second time clears it. */
  const togglePicked = (name: string) => setPicked(picked === name ? null : name);

  return {
    query,
    picked,
    active,
    setActive,
    fieldId,
    listId,
    optionRefs,
    shown,
    searching,
    suggestions,
    showing,
    onSearchBlur,
    onQueryChange,
    onQueryFocus,
    onQueryKeyDown,
    clearQuery,
    togglePicked,
  };
}
