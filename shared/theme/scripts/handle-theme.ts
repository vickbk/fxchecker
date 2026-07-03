import { getMemoItem } from "@/shared";
import type { Themes } from "../types";

export function getSavedTheme() {
  let savedTheme = getMemoItem<Themes>("theme");
  if (!savedTheme)
    savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  return savedTheme;
}

export function applyTheme(theme: Themes) {
  document.documentElement.setAttribute("theme", theme);
}
