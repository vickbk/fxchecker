import { describe, expect, it, test } from "vitest";
import { getRandomElement, getRandomElements, getRandomInt } from "./generator";

describe("Random Generation Helpers", () => {
  describe("getRandomInt", () => {
    it("should generate number within range", () => {
      const result = getRandomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThan(10);
    });

    it("should use default min of 0", () => {
      const result = getRandomInt(0, 5);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(5);
    });

    it("should use default max of 10", () => {
      const result = getRandomInt();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(10);
    });

    it("should handle negative numbers", () => {
      const result = getRandomInt(-10, 0);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThan(0);
    });

    it("should return different values on multiple calls", () => {
      const values = new Set();
      for (let i = 0; i < 10; i++) {
        values.add(getRandomInt(1, 100));
      }

      expect(values.size).toBeGreaterThan(1);
    });

    it("should work with range of 1", () => {
      const result = getRandomInt(5, 6);
      expect(result).toBe(5);
    });

    it("should handle floats as input and return integers", () => {
      const result = getRandomInt(1.5, 9.8);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThan(9);
    });
  });

  describe("get Random Element", () => {
    it("should return element from array", () => {
      const arr = ["a", "b", "c"];
      const result = getRandomElement(arr);
      expect(arr).toContain(result);
    });

    it("should work with single element array", () => {
      const arr = ["only"];
      const result = getRandomElement(arr);
      expect(result).toBe("only");
    });

    it("should work with different types", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = getRandomElement(numbers);
      expect(numbers).toContain(result);
    });

    it("should work with objects", () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = getRandomElement(arr);
      expect(arr).toContain(result);
    });

    it("should return different elements on multiple calls", () => {
      const arr = ["a", "b", "c", "d", "e"];
      const results = new Set();
      for (let i = 0; i < 20; i++) {
        results.add(getRandomElement(arr));
      }

      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe("get Multiple Random Elements", () => {
    const parent = [1, 2, 3, 4, 5];
    it("should return a subset of the original list", () => {
      const results = getRandomElements(parent, 3);
      const parentHasAll = results.every((element) => parent.includes(element));
      expect(parentHasAll).toBe(true);
    });

    it("should not contain the same element multiple times", () => {
      const results = getRandomElements(parent, 3);
      const resultsSet = new Set(results);
      expect(results.length).toBe(resultsSet.size);
    });

    it("should return an array of the same size if requested for the same length", () => {
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

    test("should keep parent length and shuffle element postion", () => {
      const results = getRandomElements(parent, 5);
      const shuffled = results.some(
        (element, index) => index !== parent.indexOf(element),
      );
      expect(shuffled).toBe(true);
      expect(results.length).toBe(parent.length);
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
});
