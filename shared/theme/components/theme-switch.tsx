"use client";
import { useTheme } from "../hooks";

export const ThemeSwitch = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="ml-auto">
      <button type="button" onClick={toggleTheme} className="cursor-pointer">
        <span className="sr-only">
          Switch to {isDark ? "light" : "dark"} theme
        </span>
        <i
          className={
            isDark ? "bi bi-sun-fill text-lime-500" : "bi bi-moon-fill"
          }
        />
      </button>
    </div>
  );
};
