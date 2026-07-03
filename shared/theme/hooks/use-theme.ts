import { useCallback, useEffect, useState } from "react";
import { applyTheme, getSavedTheme, saveTheme } from "../scripts";
import type { Themes } from "../types";

export function useTheme() {
  const [theme, setTheme] = useState<Themes>("light");

  const isDark = theme === "dark";
  const isLight = theme === "light";

  const changeTheme = useCallback((theme: Themes) => {
    applyTheme(theme, setTheme);
    saveTheme(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Themes = isDark ? "light" : "dark";
    changeTheme(nextTheme);
  }, [isDark, changeTheme]);

  useEffect(() => {
    changeTheme(getSavedTheme());
    // Since theme needs to be applied on initial render, we call changeTheme here. We don't want to add changeTheme as a dependency because it would never be called.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isDark, isLight, theme, changeTheme, toggleTheme };
}
