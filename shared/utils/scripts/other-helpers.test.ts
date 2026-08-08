import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryValue } from "../types/other-helpers";
import {
  getSearchQuery,
  getSearchQueryObject,
  keyFromSearchQuery,
  scrollIntoView,
} from "./other-helpers";

describe("Other Helpers", () => {
  describe("keyFromSearchQuery", () => {
    describe("core functionality", () => {
      it("formats all key-value pairs when no include list is provided", () => {
        const params = { page: 1, filter: "active", sort: "desc" };
        expect(keyFromSearchQuery(params)).toBe(
          "page-1-filter-active-sort-desc",
        );
      });

      it("filters and formats only keys specified in the include list", () => {
        const params = { page: 1, filter: "active", sort: "desc" };
        expect(keyFromSearchQuery(params, "page", "sort")).toBe(
          "page-1-sort-desc",
        );
      });

      it("strictly preserves the order of keys specified in the include parameter", () => {
        const params = { a: 1, b: 2, c: 3 };
        // Passes 'c' then 'a'
        expect(keyFromSearchQuery(params, "c", "a")).toBe("c-3-a-1");
      });
    });

    describe("value edge cases", () => {
      it("correctly includes numeric 0 and negative numbers without treating them as falsy", () => {
        const params = { page: 0, offset: -10 };
        expect(keyFromSearchQuery(params)).toBe("page-0-offset--10");
        expect(keyFromSearchQuery(params, "page")).toBe("page-0");
      });

      it("handles empty string values without skipping them", () => {
        const params = { query: "", page: 1 };
        expect(keyFromSearchQuery(params)).toBe("query--page-1");
        expect(keyFromSearchQuery(params, "query")).toBe("query-");
      });

      it("skips keys with undefined values", () => {
        const params = { page: 1, sort: "asc" };
        expect(keyFromSearchQuery(params)).toBe("page-1-sort-asc");
        expect(keyFromSearchQuery(params, "search", "page")).toBe("page-1");
      });

      it("handles keys and values containing hyphens or special characters", () => {
        const params = { "user-id": "usr_123-abc", "date-range": "2026-08-07" };
        expect(keyFromSearchQuery(params)).toBe(
          "user-id-usr_123-abc-date-range-2026-08-07",
        );
      });
    });

    describe("include parameter edge cases", () => {
      it("ignores keys in include that do not exist in the source object", () => {
        const params = { page: 1 };
        expect(
          keyFromSearchQuery(params, "page", "missingKey", "unknown"),
        ).toBe("page-1");
      });

      it("returns an empty string if none of the include keys exist in the source object", () => {
        const params = { page: 1, sort: "asc" };
        expect(keyFromSearchQuery(params, "foo", "bar")).toBe("");
      });

      it("duplicates output if duplicate keys are explicitly passed to include", () => {
        const params = { page: 1 };
        expect(keyFromSearchQuery(params, "page", "page")).toBe(
          "page-1-page-1",
        );
      });
    });

    describe("empty and nullish inputs", () => {
      it("returns an empty string for an empty object", () => {
        expect(keyFromSearchQuery({})).toBe("");
        expect(keyFromSearchQuery({}, "page", "sort")).toBe("");
      });

      it("returns an empty string when keys parameter is null or undefined (runtime JS callers)", () => {
        // @ts-expect-error Testing untyped JS caller passing null
        expect(keyFromSearchQuery(null)).toBe("");
        // @ts-expect-error Testing untyped JS caller passing undefined
        expect(keyFromSearchQuery(undefined)).toBe("");
        // @ts-expect-error Testing untyped JS caller passing null with include
        expect(keyFromSearchQuery(null, "page")).toBe("");
      });
    });

    describe("prototypal key edge cases", () => {
      it("safely handles keys that match Built-in Object methods", () => {
        const params = { toString: "custom", hasOwnProperty: 123 };
        expect(keyFromSearchQuery(params, "toString")).toBe("toString-custom");
        expect(keyFromSearchQuery(params)).toBe(
          "toString-custom-hasOwnProperty-123",
        );
      });
    });
  });

  describe("URL Search Query Helpers", () => {
    // ==========================================
    // 1. getSearchQuery (Tuple / Rest Version)
    // ==========================================
    describe("getSearchQuery (tuples)", () => {
      it("adds new search parameters to an existing query string", () => {
        const initial = new URLSearchParams("category=tech");
        const result = getSearchQuery(initial, ["page", 2], ["sort", "asc"]);

        expect(result).toBe("category=tech&page=2&sort=asc");
      });

      it("overwrites existing search parameters", () => {
        const initial = new URLSearchParams("page=1&sort=asc");
        const result = getSearchQuery(initial, ["page", 2]);

        expect(result).toBe("page=2&sort=asc");
      });

      it("converts number (including 0) and boolean values correctly", () => {
        const initial = new URLSearchParams();
        const result = getSearchQuery(
          initial,
          ["count", 0],
          ["active", false],
          ["enabled", true],
        );

        expect(result).toBe("count=0&active=false&enabled=true");
      });

      it("deletes parameters when values are empty string, null, or undefined", () => {
        const initial = new URLSearchParams("page=2&filter=active&sort=desc");
        const result = getSearchQuery(
          initial,
          ["filter", ""],
          ["sort", null],
          ["page", undefined],
        );

        expect(result).toBe("");
      });

      it("returns original query string when no parameter tuples are provided", () => {
        const initial = new URLSearchParams("page=1&sort=asc");
        expect(getSearchQuery(initial)).toBe("page=1&sort=asc");
      });

      it("handles multiple tuple updates for the same key in order", () => {
        const initial = new URLSearchParams("page=1");
        const result = getSearchQuery(initial, ["page", 2], ["page", 3]);

        expect(result).toBe("page=3");
      });

      it("does not mutate the original URLSearchParams object", () => {
        const initial = new URLSearchParams("page=1");
        getSearchQuery(initial, ["page", 2]);

        expect(initial.toString()).toBe("page=1");
      });
    });

    // ==========================================
    // 2. getSearchQueryObject (Object Version)
    // ==========================================
    describe("getSearchQueryObject (object)", () => {
      it("adds and overwrites search parameters using an object map", () => {
        const initial = new URLSearchParams("page=1&category=books");
        const result = getSearchQueryObject(initial, {
          page: 2,
          sort: "desc",
        });

        expect(result).toBe("page=2&category=books&sort=desc");
        expect(result).toBe("page=2&category=books&sort=desc");
      });

      it("converts number (including 0) and boolean (including false) values", () => {
        const initial = new URLSearchParams();
        const result = getSearchQueryObject(initial, {
          offset: 0,
          archived: false,
          verified: true,
        });

        expect(result).toBe("offset=0&archived=false&verified=true");
      });

      it("deletes parameters with empty string, null, or undefined values", () => {
        const initial = new URLSearchParams("q=react&page=5&limit=10");
        const result = getSearchQueryObject(initial, {
          q: "",
          page: null,
          limit: undefined,
        });

        expect(result).toBe("");
      });

      it("returns original query string when params object is empty", () => {
        const initial = new URLSearchParams("page=1");
        expect(getSearchQueryObject(initial, {})).toBe("page=1");
      });

      it("safely handles null or undefined params argument", () => {
        const initial = new URLSearchParams("page=1");
        // @ts-expect-error Testing untyped JS caller passing null
        expect(getSearchQueryObject(initial, null)).toBe("page=1");
        // @ts-expect-error Testing untyped JS caller passing undefined
        expect(getSearchQueryObject(initial, undefined)).toBe("page=1");
      });

      it("does not mutate the original URLSearchParams object", () => {
        const initial = new URLSearchParams("q=test");
        getSearchQueryObject(initial, { q: "newTest" });

        expect(initial.toString()).toBe("q=test");
      });
    });

    // ==========================================
    // 3. Shared Edge Cases & Parity
    // ==========================================
    describe("shared edge cases & encoding", () => {
      it("automatically encodes special characters, spaces, and non-ASCII text", () => {
        const initial = new URLSearchParams();
        const params: [string, QueryValue][] = [
          ["query", "coffee & tea"],
          ["filter", "price>50"],
          ["city", "Montréal"],
        ];

        const tupleResult = getSearchQuery(initial, ...params);
        const objectResult = getSearchQueryObject(initial, {
          query: "coffee & tea",
          filter: "price>50",
          city: "Montréal",
        });

        expect(tupleResult).toBe(objectResult);
        expect(tupleResult).toBe(
          "query=coffee+%26+tea&filter=price%3E50&city=Montr%C3%A9al",
        );
      });

      it("returns an empty string when given a null/falsy URLSearchParams instance", () => {
        // @ts-expect-error Testing untyped JS caller passing null
        expect(getSearchQuery(null, ["page", 1])).toBe("");
        // @ts-expect-error Testing untyped JS caller passing null
        expect(getSearchQueryObject(null, { page: 1 })).toBe("");
      });

      it("preserves unmodified keys with special formatting or arrays", () => {
        const initial = new URLSearchParams("tag=js&tag=ts&active=true");
        const result = getSearchQueryObject(initial, { active: false });

        expect(result).toBe("tag=js&tag=ts&active=false");
      });
    });
  });

  describe("scrollIntoView", () => {
    let mockScrollIntoView: ReturnType<typeof vi.fn>;
    let mockMatchMedia: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      // 1. Mock Element.prototype.scrollIntoView (lacking in standard JSDOM)
      mockScrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView as unknown as (
        arg?: boolean | ScrollIntoViewOptions | undefined,
      ) => void;

      // 2. Default matchMedia mock (reduced moqtion = false)
      mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      });
      window.matchMedia = mockMatchMedia as unknown as ((
        query: string,
      ) => MediaQueryList) &
        ((query: string) => MediaQueryList);

      // 3. Reset DOM body
      document.body.innerHTML = "";
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    // ==========================================
    // 1. TARGET RESOLUTION
    // ==========================================
    describe("target resolution", () => {
      it("scrolls direct HTMLElement target", () => {
        const element = document.createElement("div");
        document.body.appendChild(element);

        scrollIntoView(element);

        expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      });

      it("scrolls element passed inside a React Ref object", () => {
        const element = document.createElement("div");
        document.body.appendChild(element);
        const ref = { current: element };

        scrollIntoView(ref);

        expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      });

      it("resolves and scrolls element using a CSS selector string", () => {
        const element = document.createElement("div");
        element.id = "target-section";
        document.body.appendChild(element);

        scrollIntoView("#target-section");

        expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
      });

      it("handles CSS selector that matches no element silently without throwing", () => {
        expect(() => scrollIntoView("#missing-element")).not.toThrow();
        expect(mockScrollIntoView).not.toHaveBeenCalled();
      });

      it("handles React Ref with null current value gracefully", () => {
        const ref = { current: null };
        expect(() => scrollIntoView(ref)).not.toThrow();
        expect(mockScrollIntoView).not.toHaveBeenCalled();
      });

      it("handles null, undefined, or empty string target without throwing", () => {
        expect(() => scrollIntoView(null)).not.toThrow();
        expect(() => scrollIntoView(undefined)).not.toThrow();
        expect(() => scrollIntoView("")).not.toThrow();
        expect(mockScrollIntoView).not.toHaveBeenCalled();
      });
    });

    // ==========================================
    // 2. ACCESSIBILITY & MOTION SENSITIVITY
    // ==========================================
    describe("accessibility & prefers-reduced-motion", () => {
      it("uses 'smooth' behavior when prefers-reduced-motion is false", () => {
        const element = document.createElement("div");
        scrollIntoView(element);

        expect(mockScrollIntoView).toHaveBeenCalledWith(
          expect.objectContaining({ behavior: "smooth" }),
        );
      });

      it("switches behavior to 'auto' when user enables prefers-reduced-motion", () => {
        mockMatchMedia.mockReturnValue({ matches: true });

        const element = document.createElement("div");
        scrollIntoView(element);

        expect(mockScrollIntoView).toHaveBeenCalledWith(
          expect.objectContaining({ behavior: "auto" }),
        );
      });
    });

    // ==========================================
    // 3. CUSTOM OPTIONS & DEFAULTS
    // ==========================================
    describe("options merging", () => {
      it("merges custom scroll options while keeping non-overridden defaults", () => {
        const element = document.createElement("div");
        scrollIntoView(element, { block: "start", inline: "center" });

        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
      });

      it("allows caller to explicitly override default behavior", () => {
        const element = document.createElement("div");
        scrollIntoView(element, { behavior: "instant" as ScrollBehavior });

        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: "instant",
          block: "center",
          inline: "nearest",
        });
      });
    });

    // ==========================================
    // 4. DEFERRED EXECUTION (useAnimationFrame)
    // ==========================================
    describe("useAnimationFrame", () => {
      it("defers scroll until next animation frame when useAnimationFrame is true", () => {
        const element = document.createElement("div");
        let rafCallback: FrameRequestCallback | null = null;

        vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
          rafCallback = cb;
          return 1;
        });

        scrollIntoView(element, { useAnimationFrame: true });

        // Should not trigger synchronously
        expect(mockScrollIntoView).not.toHaveBeenCalled();

        // Trigger animation frame callback
        if (rafCallback) {
          (rafCallback as FrameRequestCallback)(0);
        }

        expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
      });
    });

    // ==========================================
    // 5. SERVER-SIDE RENDERING (SSR)
    // ==========================================
    describe("SSR environment", () => {
      it("exits silently without throwing when window is undefined", () => {
        const originalWindow = global.window;

        try {
          // @ts-expect-error Simulating SSR environment
          delete global.window;

          expect(() => scrollIntoView("div")).not.toThrow();
        } finally {
          global.window = originalWindow;
        }
      });
    });
  });
});
