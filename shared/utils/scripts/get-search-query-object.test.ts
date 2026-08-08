import { describe, expect, it } from "vitest";
import { getSearchQueryObject } from "./get-search-query-object";

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

  it("preserves unmodified keys with special formatting or arrays", () => {
    const initial = new URLSearchParams("tag=js&tag=ts&active=true");
    const result = getSearchQueryObject(initial, { active: false });

    expect(result).toBe("tag=js&tag=ts&active=false");
  });
});
