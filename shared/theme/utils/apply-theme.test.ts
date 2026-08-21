import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme } from "./apply-theme";

describe("applyTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    // Reset document.documentElement attributes and styles before each test
    document.documentElement.removeAttribute("theme");
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.colorScheme = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================
  // 1. DOM ATTRIBUTES & NATIVE UI COLOR SCHEME
  // ==========================================
  describe("DOM attributes and styles", () => {
    it("sets default 'theme' attribute and style.colorScheme to 'dark'", () => {
      applyTheme("dark");

      expect(document.documentElement.getAttribute("theme")).toBe("dark");
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });

    it("sets default 'theme' attribute and style.colorScheme to 'light'", () => {
      applyTheme("light");

      expect(document.documentElement.getAttribute("theme")).toBe("light");
      expect(document.documentElement.style.colorScheme).toBe("light");
    });

    it("supports custom HTML attribute names (e.g., 'data-theme')", () => {
      applyTheme("dark", { attributeName: "data-theme" });

      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
      expect(document.documentElement.getAttribute("theme")).toBeNull();
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });
  });

  // ==========================================
  // 2. LOCALSTORAGE PERSISTENCE
  // ==========================================
  describe("localStorage persistence", () => {
    it("persists applied theme to localStorage by default", () => {
      applyTheme("dark");

      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("persists applied theme to localStorage when persist option is explicitly true", () => {
      applyTheme("light", { persist: true });

      expect(localStorage.getItem("theme")).toBe("light");
    });

    it("bypasses localStorage persistence when persist option is false", () => {
      applyTheme("dark", { persist: false });

      expect(localStorage.getItem("theme")).toBeNull();
      expect(document.documentElement.getAttribute("theme")).toBe("dark");
    });
  });

  // ==========================================
  // 3. STATE UPDATER CALLBACK
  // ==========================================
  describe("stateUpdater callback", () => {
    it("invokes stateUpdater callback with the applied theme", () => {
      const stateUpdater = vi.fn();

      applyTheme("dark", { stateUpdater });

      expect(stateUpdater).toHaveBeenCalledTimes(1);
      expect(stateUpdater).toHaveBeenCalledWith("dark");
    });

    it("executes stateUpdater even when persistence is disabled", () => {
      const stateUpdater = vi.fn();

      applyTheme("light", { persist: false, stateUpdater });

      expect(stateUpdater).toHaveBeenCalledTimes(1);
      expect(stateUpdater).toHaveBeenCalledWith("light");
    });

    it("runs safely when stateUpdater is omitted", () => {
      expect(() => applyTheme("dark")).not.toThrow();
    });
  });

  // ==========================================
  // 4. STORAGE ACCESS EXCEPTIONS (Private Mode / Full Quota)
  // ==========================================
  describe("storage exception handling", () => {
    it("applies DOM attributes and calls stateUpdater even if localStorage.setItem throws SecurityError", () => {
      vi.spyOn(localStorage, "setItem").mockImplementation(() => {
        throw new DOMException("Access is denied", "SecurityError");
      });

      const stateUpdater = vi.fn();

      expect(() => applyTheme("dark", { stateUpdater })).not.toThrow();
      expect(localStorage.setItem).toHaveBeenCalled();

      expect(document.documentElement.getAttribute("theme")).toBe("dark");
      expect(document.documentElement.style.colorScheme).toBe("dark");
      expect(stateUpdater).toHaveBeenCalledWith("dark");
    });

    it("handles QuotaExceededError when storage space is full without throwing", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });

      expect(() => applyTheme("light")).not.toThrow();
      expect(document.documentElement.getAttribute("theme")).toBe("light");
    });
  });

  // ==========================================
  // 5. SERVER-SIDE RENDERING (SSR)
  // ==========================================
  describe("SSR / Node environment", () => {
    it("returns gracefully without throwing when document is undefined", () => {
      vi.stubGlobal("window", undefined);
      vi.stubGlobal("document", undefined);

      const stateUpdater = vi.fn();

      try {
        expect(() => applyTheme("dark", { stateUpdater })).not.toThrow();
        expect(stateUpdater).not.toHaveBeenCalled();
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });
});
