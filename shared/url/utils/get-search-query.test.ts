import { beforeEach, describe, expect, it } from "vitest";
import { QueryValue } from "../types";
import { getSearchQuery, setQuery } from "./get-search-query";
import { getSearchQueryObject } from "./get-search-query-object";

describe("URL Search Query Helpers", () => {
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

    it("skips non-tuplet parameters", () => {
      const initial = new URLSearchParams("page=1");

      const result = getSearchQuery(
        initial,
        ["page", 2],

        // @ts-expect-error Testing untyped JS caller passing null, undefined, number,string, or array
        null,
        undefined,
        3,
        5,
        "ok",
        [],
      );
      expect(result).toBe("page=2");
    });
  });

  describe("getSearchQueryObject (object)", () => {
    it("adds and overwrites search parameters using an object map", () => {
      const initial = new URLSearchParams("page=1&category=books");
      const result = getSearchQueryObject(initial, {
        page: 2,
        sort: "desc",
      });

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
      expect(getSearchQueryObject(initial, null)).toBe("page=1");
      expect(getSearchQueryObject(initial, undefined)).toBe("page=1");
    });

    it("does not mutate the original URLSearchParams object", () => {
      const initial = new URLSearchParams("q=test");
      getSearchQueryObject(initial, { q: "newTest" });

      expect(initial.toString()).toBe("q=test");
    });
  });

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
      expect(getSearchQuery(null, ["page", 1])).toBe("");
      expect(getSearchQueryObject(null, { page: 1 })).toBe("");
    });

    it("preserves unmodified keys with special formatting or arrays", () => {
      const initial = new URLSearchParams("tag=js&tag=ts&active=true");
      const result = getSearchQueryObject(initial, { active: false });

      expect(result).toBe("tag=js&tag=ts&active=false");
    });
  });

  describe("setQuery", () => {
    let params: URLSearchParams;

    beforeEach(() => {
      params = new URLSearchParams("page=1&sort=asc&filter=active");
    });

    describe("Parameter Deletion & Cleanup", () => {
      it("should delete existing key when val is undefined", () => {
        setQuery(params, "sort", undefined);

        expect(params.has("sort")).toBe(false);
        expect(params.toString()).toBe("page=1&filter=active");
      });

      it("should delete existing key when val is null", () => {
        setQuery(params, "filter", null);

        expect(params.has("filter")).toBe(false);
        expect(params.toString()).toBe("page=1&sort=asc");
      });

      it("should delete existing key when val is an empty string", () => {
        setQuery(params, "page", "");

        expect(params.has("page")).toBe(false);
        expect(params.toString()).toBe("sort=asc&filter=active");
      });

      it("should safely do nothing when deleting a key that does not exist", () => {
        setQuery(params, "nonExistentKey", undefined);
        setQuery(params, "anotherMissingKey", null);
        setQuery(params, "thirdMissingKey", "");

        expect(params.toString()).toBe("page=1&sort=asc&filter=active");
      });
    });

    describe("Setting & Overwriting Valid Values", () => {
      it("should set a new string value", () => {
        setQuery(params, "search", "laptop");

        expect(params.get("search")).toBe("laptop");
      });

      it("should overwrite an existing key with a new string value", () => {
        setQuery(params, "sort", "desc");

        expect(params.get("sort")).toBe("desc");
        expect(params.getAll("sort")).toHaveLength(1);
      });

      it("should properly encode special characters in values", () => {
        setQuery(params, "query", "hello world & co.");

        expect(params.get("query")).toBe("hello world & co.");
        expect(params.toString()).toContain("query=hello+world+%26+co.");
      });
    });

    describe("Falsy Non-Nullish Edge Cases", () => {
      it("should set number 0 (should NOT delete despite being falsy)", () => {
        setQuery(params, "page", 0);

        expect(params.get("page")).toBe("0");
        expect(params.has("page")).toBe(true);
      });

      it("should set boolean false (should NOT delete despite being falsy)", () => {
        setQuery(params, "isArchived", false);

        expect(params.get("isArchived")).toBe("false");
        expect(params.has("isArchived")).toBe(true);
      });

      it("should set negative numbers and floating point numbers correctly", () => {
        setQuery(params, "offset", -10);
        setQuery(params, "ratio", 1.5);

        expect(params.get("offset")).toBe("-10");
        expect(params.get("ratio")).toBe("1.5");
      });

      it("should set boolean true correctly", () => {
        setQuery(params, "inStock", true);

        expect(params.get("inStock")).toBe("true");
      });
    });

    describe("In-Place Mutation & Context Isolation", () => {
      it("should mutate the passed URLSearchParams instance in place", () => {
        const originalRef = params;
        setQuery(params, "page", "2");

        expect(params).toBe(originalRef);
        expect(params.get("page")).toBe("2");
      });

      it("should leave unrelated parameters completely untouched", () => {
        setQuery(params, "page", "5");

        expect(params.get("sort")).toBe("asc");
        expect(params.get("filter")).toBe("active");
      });
    });
  });
});
