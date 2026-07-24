"use client";
import { useTheme } from "../hooks";

export const ThemeSwitch = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="ml-auto">
      <button
        type="button"
        onClick={toggleTheme}
        className="cursor-pointer action-btn hover:outline focus-visible:outline px-1 rounded-full aspect-square self-center"
      >
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
