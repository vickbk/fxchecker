import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSavedTheme } from "./get-saved-theme";

describe("getSavedTheme", () => {
  let matchMediaSpy: ReturnType<typeof vi.spyOn>;

  const mockMatchMedia = (prefersDark: boolean) => {
    matchMediaSpy.mockReturnValue({
      matches: prefersDark,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList);
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    matchMediaSpy = vi.spyOn(window, "matchMedia");
  });

  // ==========================================
  // 1. SAVED LOCALSTORAGE PREFERENCE
  // ==========================================
  describe("localStorage priority", () => {
    it("returns 'dark' when saved in localStorage regardless of system light preference", () => {
      localStorage.setItem("theme", "dark");
      mockMatchMedia(false); // System prefers light

      expect(getSavedTheme()).toBe("dark");
    });

    it("returns 'light' when saved in localStorage regardless of system dark preference", () => {
      localStorage.setItem("theme", "light");
      mockMatchMedia(true); // System prefers dark

      expect(getSavedTheme()).toBe("light");
    });
  });

  // ==========================================
  // 2. SYSTEM PREFERENCE FALLBACK
  // ==========================================
  describe("system preference fallback (when localStorage is empty)", () => {
    it("falls back to 'dark' when system prefers dark", () => {
      mockMatchMedia(true);
      expect(getSavedTheme()).toBe("dark");
    });

    it("falls back to 'light' when system prefers light", () => {
      mockMatchMedia(false);
      expect(getSavedTheme()).toBe("light");
    });
  });

  // ==========================================
  // 3. CORRUPTED OR INVALID STORAGE VALUES
  // ==========================================
  describe("invalid or corrupted localStorage values", () => {
    it.each([
      "blue",
      "system",
      "DARK",
      "LIGHT",
      "undefined",
      "null",
      "   ",
      "{}",
    ])(
      "ignores invalid value '%s' and falls back to system preference",
      (invalidValue) => {
        localStorage.setItem("theme", invalidValue);
        mockMatchMedia(false); // System prefers light

        expect(getSavedTheme()).toBe("light");
      },
    );
  });

  // ==========================================
  // 4. STORAGE ACCESS EXCEPTIONS (Private Mode / iFrames)
  // ==========================================
  describe("storage exception handling", () => {
    it("falls back gracefully to system preference if localStorage throws SecurityError", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new DOMException("Access is denied", "SecurityError");
      });
      mockMatchMedia(true);

      expect(() => getSavedTheme()).not.toThrow();
      expect(getSavedTheme()).toBe("dark");
    });
  });

  // ==========================================
  // 5. SERVER-SIDE RENDERING (SSR)
  // ==========================================
  describe("SSR / node environment", () => {
    beforeEach(() => {
      vi.stubGlobal("window", undefined);
    });
    afterEach(vi.unstubAllGlobals);
    it("returns default theme 'dark' when window is undefined", () => {
      expect(getSavedTheme()).toBe("dark");
    });

    it("returns custom default theme during SSR when passed", () => {
      expect(getSavedTheme("light")).toBe("light");
    });
  });
});
