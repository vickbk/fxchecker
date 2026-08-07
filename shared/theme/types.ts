export type Themes = "light" | "dark";

export interface ApplyThemeOptions {
  /** Callback to update React state or UI store */
  stateUpdater?: (theme: Themes) => void;
  /** Whether to persist the theme in localStorage (defaults to true) */
  persist?: boolean;
  /** Custom HTML attribute name to set (defaults to "theme") */
  attributeName?: string;
}
