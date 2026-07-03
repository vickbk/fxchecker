import { Icon } from "@/shared/helpers/components/bi-icon";
import { SROnly } from "@/shared/helpers/components/SROnly";
import { useTheme } from "../hooks";

export const ThemeSwitch = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="ml-auto">
      <button type="button" onClick={toggleTheme}>
        <SROnly>Switch to {isDark ? "light" : "dark"} theme</SROnly>
        <Icon name={isDark ? "sun-fill c-yellow-400" : "moon-fill"} />
      </button>
    </div>
  );
};
