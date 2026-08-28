import { describe, expect, it } from "vitest";
import { getRandomInt } from "./random-int";

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

  it("should pick a real min if swapped min and max", () => {
    const result = getRandomInt(10, 0);
    expect(result).toBeLessThan(10);
  });
});
