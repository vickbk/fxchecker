import { useCallback, useEffect, useState } from "react";
import { applyTheme, getSavedTheme, saveTheme } from "../scripts";
import type { Themes } from "../types";

export function useTheme() {
  const [theme, setTheme] = useState<Themes>();

  useEffect(() => {
    const saved = getSavedTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
    applyTheme(saved);
  }, []);
  const isDark = theme === "dark";
  const isLight = theme === "light";

  const changeTheme = useCallback((theme: Themes) => {
    setTheme(theme);
    applyTheme(theme);
    saveTheme(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Themes = isDark ? "light" : "dark";
    changeTheme(nextTheme);
  }, [isDark, changeTheme]);

  return { isDark, isLight, theme, changeTheme, toggleTheme };
}
