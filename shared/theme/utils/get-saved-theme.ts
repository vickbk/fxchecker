import { Themes } from "../types";
import { VALID_THEMES } from "./save-theme";

export function getSavedTheme(defaultTheme: Themes = "dark"): Themes {
  // 1. SSR Guard
  if (typeof window === "undefined") return defaultTheme;

  // 2. Safe localStorage read with type validation
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && VALID_THEMES.has(savedTheme as Themes)) {
      return savedTheme as Themes;
    }
  } catch {
    // Gracefully handle disabled/restricted storage (Private Browsing, iFrames)
  }

  // 3. System preference fallback
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
