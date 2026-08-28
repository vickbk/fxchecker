import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getRandomElements } from "./random-elements";
import * as utils from "./random-int";

describe("get Multiple Random Elements", () => {
  const parent = [1, 2, 3, 4, 5];
  test("should return a subset of the original list", () => {
    const results = getRandomElements(parent, 3);
    const parentHasAll = results.every((element) => parent.includes(element));
    expect(parentHasAll).toBe(true);
  });

  test("should not contain the same element multiple times", () => {
    const results = getRandomElements(parent, 3);
    const resultsSet = new Set(results);
    expect(results.length).toBe(resultsSet.size);
  });

  test("should return an array of the same size if requested for the same length", () => {
    const results = getRandomElements(parent, 5);
    expect(parent.length).toBe(results.length);
  });

  test("should keep the requested length", () => {
    const length = 3;
    const results = getRandomElements(parent, length);
    expect(results.length).toBe(length);
  });

  test("should keep parent length if requested length is higher", () => {
    const length = 7;
    const results = getRandomElements(parent, length);
    expect(results.length).toBe(parent.length);
  });

  test("should keep parent length and shuffle element postion in multiple runs", () => {
    for (let i = 0; i < 1000; i++) {
      const results = getRandomElements(parent, 5);
      const shuffled = results.some(
        (element, index) => index !== parent.indexOf(element),
      );

      expect(shuffled).toBe(true);
      expect(results.length).toBe(parent.length);
    }
  });

  test("should return an empty list when count is set to 0", () => {
    const results = getRandomElements(parent, 0);
    expect(results.length).toBe(0);
  });

  test("should return an empty array for an empty provider", () => {
    const results = getRandomElements([], 5);
    expect(results.length).toBe(0);
  });

  test("should return an empty array for negative count", () => {
    const results = getRandomElements([], -3);
    expect(results.length).toBe(0);
  });
});

describe("getRandomElements - isSameItem & identical element checks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("all elements identical (isSameItem stays true)", () => {
    test("returns identical string array without attempting swaps", () => {
      const data = ["A", "A", "A", "A"];
      const results = getRandomElements(data, 3);

      expect(results).toEqual(["A", "A", "A"]);
    });

    test("returns identical number array without throwing or looping endlessly", () => {
      const data = [7, 7, 7, 7, 7];
      const results = getRandomElements(data, 5);

      expect(results).toEqual([7, 7, 7, 7, 7]);
    });

    test("handles identical object reference arrays correctly", () => {
      const sharedObj = { id: 100 };
      const data = [sharedObj, sharedObj, sharedObj];
      const results = getRandomElements(data, 3);

      expect(results).toEqual([sharedObj, sharedObj, sharedObj]);
      expect(results[0]).toBe(sharedObj);
    });

    test("executes safely over 1,000 deterministic rounds with identical elements", () => {
      const data = ["X", "X", "X", "X"];

      for (let i = 0; i < 1000; i++) {
        const results = getRandomElements(data, 3);
        expect(results).toEqual(["X", "X", "X"]);
      }
    });
  });

  describe("duplicate values with sequence match (isSameOrder=true, isSameItem=false)", () => {
    test("detects non-identical items and swaps to break exact match order", () => {
      const data = ["A", "A", "B"];

      // Mock getRandomInt to pick index 0, then 1, then 0.
      // Pick 0: picks data[0] ("A"), shuffled[0] becomes "B"
      // Pick 1: picks data[1] ("A"), shuffled[1] becomes "A"
      // Pick 0: picks data[2] ("B")
      // Picked sequence before swap: ["A", "A", "B"] (isSameOrder = true, isSameItem = false)
      vi.spyOn(utils, "getRandomInt")
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(0);

      const results = getRandomElements(data, 3);

      // Must swap results[0] ("A") with first non-"A" item (results[2] = "B")
      // Output becomes ["B", "A", "A"]
      expect(results).toEqual(["B", "A", "A"]);
      expect(results).not.toEqual(data);
    });

    test("skips scan past leading duplicate elements to find the first distinct swap target", () => {
      const data = ["KEY", "KEY", "KEY", "OTHER"];

      // Force shuffle to pick items in exact input sequence order ["KEY", "KEY", "KEY", "OTHER"]
      vi.spyOn(utils, "getRandomInt")
        .mockReturnValueOnce(0) // picks "KEY" at index 0
        .mockReturnValueOnce(1) // picks "KEY" at index 1
        .mockReturnValueOnce(2) // picks "KEY" at index 2
        .mockReturnValueOnce(0); // picks "OTHER" at index 0

      const results = getRandomElements(data, 4);

      // Swaps results[0] ("KEY") with results[3] ("OTHER")
      expect(results).toEqual(["OTHER", "KEY", "KEY", "KEY"]);
    });
  });

  describe("short-circuiting flag behavior", () => {
    test("flips isSameItem to false on the first distinct element picked", () => {
      const data = ["A", "B", "C"];

      // Pick index 0 ("A"), then index 0 ("C")
      vi.spyOn(utils, "getRandomInt")
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0);

      const results = getRandomElements(data, 2);

      // ["A", "C"] is not same order as ["A", "B"] and not same item
      expect(results).toEqual(["A", "C"]);
    });
  });
});
