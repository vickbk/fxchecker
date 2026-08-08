import { describe, expect, it } from "vitest";
import { keyFromSearchQuery } from "./key-from-search-query";

describe("keyFromSearchQuery", () => {
  describe("core functionality", () => {
    it("formats all key-value pairs when no include list is provided", () => {
      const params = { page: 1, filter: "active", sort: "desc" };
      expect(keyFromSearchQuery(params)).toBe("page-1-filter-active-sort-desc");
    });

    it("filters and formats only keys specified in the include list", () => {
      const params = { page: 1, filter: "active", sort: "desc" };
      expect(keyFromSearchQuery(params, "page", "sort")).toBe(
        "page-1-sort-desc",
      );
    });

    it("strictly preserves the order of keys specified in the include parameter", () => {
      const params = { a: 1, b: 2, c: 3 };
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
      expect(keyFromSearchQuery(params, "page", "missingKey", "unknown")).toBe(
        "page-1",
      );
    });

    it("returns an empty string if none of the include keys exist in the source object", () => {
      const params = { page: 1, sort: "asc" };
      expect(keyFromSearchQuery(params, "foo", "bar")).toBe("");
    });

    it("duplicates output if duplicate keys are explicitly passed to include", () => {
      const params = { page: 1 };
      expect(keyFromSearchQuery(params, "page", "page")).toBe("page-1-page-1");
    });
  });

  describe("empty and nullish inputs", () => {
    it("returns an empty string for an empty object", () => {
      expect(keyFromSearchQuery({})).toBe("");
      expect(keyFromSearchQuery({}, "page", "sort")).toBe("");
    });

    it("returns an empty string when keys parameter is null or undefined (runtime JS callers)", () => {
      expect(keyFromSearchQuery(null)).toBe("");
      expect(keyFromSearchQuery(undefined)).toBe("");
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
