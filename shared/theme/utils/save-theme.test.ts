import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Themes } from "../types";
import { saveTheme, THEME_CHANGE_EVENT } from "./save-theme";

describe("Theme Handler", () => {
  describe("saveTheme", () => {
    beforeEach(() => {
      localStorage.clear();

      // Suppress console.warn during test runs while allowing assertions on it
      vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    // ==========================================
    // 1. SUCCESSFUL PERSISTENCE
    // ==========================================
    describe("successful persistence", () => {
      it("saves 'dark' theme to localStorage and returns true", () => {
        const result = saveTheme("dark");

        expect(result).toBe(true);
        expect(localStorage.getItem("theme")).toBe("dark");
      });

      it("saves 'light' theme to localStorage and returns true", () => {
        const result = saveTheme("light");

        expect(result).toBe(true);
        expect(localStorage.getItem("theme")).toBe("light");
      });
    });

    // ==========================================
    // 2. CUSTOM EVENT DISPATCHING (IN-TAB SYNC)
    // ==========================================
    describe("custom event dispatching", () => {
      it("dispatches 'app-theme-change' CustomEvent on window with updated theme detail", () => {
        const eventListener = vi.fn();
        window.addEventListener(THEME_CHANGE_EVENT, eventListener);

        saveTheme("dark");

        expect(eventListener).toHaveBeenCalledTimes(1);

        const dispatchedEvent = eventListener.mock
          .calls[0][0] as CustomEvent<Themes>;
        expect(dispatchedEvent.type).toBe(THEME_CHANGE_EVENT);
        expect(dispatchedEvent.detail).toBe("dark");

        window.removeEventListener(THEME_CHANGE_EVENT, eventListener);
      });

      it("allows multiple in-tab listeners to catch the theme update event", () => {
        const listenerOne = vi.fn();
        const listenerTwo = vi.fn();

        window.addEventListener(THEME_CHANGE_EVENT, listenerOne);
        window.addEventListener(THEME_CHANGE_EVENT, listenerTwo);

        saveTheme("light");

        expect(listenerOne).toHaveBeenCalledTimes(1);
        expect(listenerTwo).toHaveBeenCalledTimes(1);

        window.removeEventListener(THEME_CHANGE_EVENT, listenerOne);
        window.removeEventListener(THEME_CHANGE_EVENT, listenerTwo);
      });
    });

    // ==========================================
    // 3. INPUT VALIDATION
    // ==========================================
    describe("input validation", () => {
      it.each([
        "blue",
        "system",
        "DARK",
        "LIGHT",
        "",
        "   ",
        "undefined",
        "null",
      ])(
        "rejects invalid theme '%s', returns false, and does not dispatch events",
        (invalidTheme) => {
          const eventListener = vi.fn();
          window.addEventListener(THEME_CHANGE_EVENT, eventListener);

          // @ts-expect-error Testing untyped JS caller or runtime invalid value
          const result = saveTheme(invalidTheme);

          expect(result).toBe(false);
          expect(localStorage.getItem("theme")).toBeNull();
          expect(eventListener).not.toHaveBeenCalled();
          expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining(
              `Invalid theme provided: "${invalidTheme}"`,
            ),
          );

          window.removeEventListener(THEME_CHANGE_EVENT, eventListener);
        },
      );
    });

    // ==========================================
    // 4. STORAGE EXCEPTIONS (Private Mode / Full Quota)
    // ==========================================
    describe("storage exception handling", () => {
      it("handles SecurityError / DOMException (Safari Private Browsing / blocked cookies) gracefully", () => {
        vi.spyOn(localStorage, "setItem").mockImplementation(() => {
          throw new DOMException("Access is denied", "SecurityError");
        });

        const eventListener = vi.fn();
        window.addEventListener(THEME_CHANGE_EVENT, eventListener);

        expect(() => saveTheme("dark")).not.toThrow();

        const result = saveTheme("dark");

        expect(result).toBe(false);
        expect(eventListener).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledWith(
          "[saveTheme] Failed to persist theme to localStorage:",
          expect.any(DOMException),
        );

        window.removeEventListener(THEME_CHANGE_EVENT, eventListener);
      });

      it("handles QuotaExceededError when localStorage storage quota is full", () => {
        vi.spyOn(localStorage, "setItem").mockImplementation(() => {
          throw new DOMException("Quota exceeded", "QuotaExceededError");
        });

        const result = saveTheme("light");

        expect(result).toBe(false);
        expect(console.warn).toHaveBeenCalledWith(
          "[saveTheme] Failed to persist theme to localStorage:",
          expect.any(DOMException),
        );
      });
    });

    // ==========================================
    // 5. SERVER-SIDE RENDERING (SSR)
    // ==========================================
    describe("SSR / Node environment", () => {
      it("returns false gracefully without throwing when window is undefined", () => {
        vi.stubGlobal("window", undefined);
        try {
          expect(() => saveTheme("dark")).not.toThrow();
          expect(saveTheme("dark")).toBe(false);
        } finally {
          vi.unstubAllGlobals();
        }
      });
    });
  });
});
