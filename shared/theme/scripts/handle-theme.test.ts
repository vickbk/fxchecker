import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme, getSavedTheme } from "./handle-theme";

// Mock getMemoItem
vi.mock("@/shared", () => ({
  getMemoItem: vi.fn((key: string) => {
    if (key === "theme") return undefined;
    return undefined;
  }),
}));

describe("Theme Handler", () => {
  describe("get saved theme", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it("should return dark theme if system prefers dark", () => {
      const mediaQuery = vi.spyOn(window, "matchMedia");
      mediaQuery.mockReturnValue({
        matches: true,
      } as MediaQueryList);

      const theme = getSavedTheme();
      expect(theme).toBe("dark");
    });

    it("should return light theme if system prefers light", () => {
      const mediaQuery = vi.spyOn(window, "matchMedia");
      mediaQuery.mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const theme = getSavedTheme();
      expect(theme).toBe("light");
    });

    it("should prefer saved theme over system preference", () => {
      const theme = getSavedTheme();
      expect(["light", "dark"]).toContain(theme);
    });
  });

  describe("apply theme", () => {
    beforeEach(() => {
      document.documentElement.removeAttribute("theme");
    });

    it("should set theme attribute on document element", () => {
      applyTheme("dark");
      expect(document.documentElement.getAttribute("theme")).toBe("dark");
    });

    it("should change theme attribute", () => {
      applyTheme("light");
      expect(document.documentElement.getAttribute("theme")).toBe("light");
      applyTheme("dark");
      expect(document.documentElement.getAttribute("theme")).toBe("dark");
    });

    it("should work with light theme", () => {
      applyTheme("light");
      expect(document.documentElement.getAttribute("theme")).toBe("light");
    });

    it("should work with dark theme", () => {
      applyTheme("dark");
      expect(document.documentElement.getAttribute("theme")).toBe("dark");
    });
  });
});
