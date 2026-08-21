export type Themes = "light" | "dark";

export type ApplyThemeOptions = {
  stateUpdater?: (theme: Themes) => void;
  persist?: boolean;
  attributeName?: string;
};
