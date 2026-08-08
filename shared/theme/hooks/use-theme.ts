import { useCallback, useState } from "react";
import type { Themes } from "../types";
import { applyTheme } from "../utils/apply-theme";
import { getSavedTheme } from "../utils/get-saved-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Themes>(() => {
    const saved = getSavedTheme();
    applyTheme(saved, { persist: false });
    return saved;
  });

  const isDark = theme === "dark";
  const isLight = theme === "light";

  const changeTheme = useCallback((theme: Themes) => {
    setTheme(theme);
    applyTheme(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Themes = isDark ? "light" : "dark";
    changeTheme(nextTheme);
  }, [isDark, changeTheme]);

  return { isDark, isLight, theme, changeTheme, toggleTheme };
}
