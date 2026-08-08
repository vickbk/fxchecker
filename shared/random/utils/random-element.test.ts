import { describe, expect, it } from "vitest";
import { getRandomElement } from "./random-element";

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
