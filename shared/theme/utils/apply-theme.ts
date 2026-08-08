import { ApplyThemeOptions, Themes } from "../types";
import { saveTheme } from "./save-theme";

export function applyTheme(
  theme: Themes,
  options: ApplyThemeOptions = {},
): void {
  // 1. SSR Guard
  if (typeof document === "undefined") return;

  const { stateUpdater, persist = true, attributeName = "theme" } = options;

  const root = document.documentElement;

  // 2. Set DOM attribute & native UI color scheme (scrollbars, form inputs)
  root.setAttribute(attributeName, theme);
  root.style.colorScheme = theme;

  // 3. Safe localStorage persistence
  if (persist) {
    saveTheme(theme);
  }

  // 4. Trigger state/store updater callback
  stateUpdater?.(theme);
}
