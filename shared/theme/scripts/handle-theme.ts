import type { Themes } from "../types";

export function getSavedTheme() {
  if (typeof window === "undefined") return "dark";
  return (
    (localStorage.getItem("theme") as Themes | null) ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light")
  );
}

export function applyTheme(
  theme: Themes,
  stateUpdater?: (theme: Themes) => void,
) {
  document.documentElement.setAttribute("theme", theme);
  stateUpdater?.(theme);
}

export function saveTheme(theme: Themes) {
  if (typeof window === "undefined") return;
  localStorage.setItem("theme", theme);
}
