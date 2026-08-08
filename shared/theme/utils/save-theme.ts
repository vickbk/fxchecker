import type { Themes } from "../types";

export const VALID_THEMES = new Set<Themes>(["dark", "light"]);

/** Custom event name for syncing theme changes within the current window */
export const THEME_CHANGE_EVENT = "app-theme-change";

export function saveTheme(theme: Themes): boolean {
  // 1. SSR Guard
  if (typeof window === "undefined") return false;

  // 2. Validate input value
  if (!VALID_THEMES.has(theme)) {
    console.warn(`[saveTheme] Invalid theme provided: "${theme}"`);
    return false;
  }

  // 3. Safe localStorage write with exception handling
  try {
    localStorage.setItem("theme", theme);

    // 4. Dispatch custom event to notify listeners in the CURRENT tab
    window.dispatchEvent(
      new CustomEvent<Themes>(THEME_CHANGE_EVENT, { detail: theme }),
    );

    return true;
  } catch (error) {
    // Gracefully handle storage restrictions (Private Browsing, full quota)
    console.warn("[saveTheme] Failed to persist theme to localStorage:", error);
    return false;
  }
}
