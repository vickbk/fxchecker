import { getRandomElement, getRandomInt, getRandomText } from "./random-gen";

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

  describe("get Random Text", () => {
    it("should return object with word property", () => {
      const result = getRandomText();
      expect(result).toHaveProperty("word");
      expect(typeof result.word).toBe("string");
    });

    it("should return object with sentence property", () => {
      const result = getRandomText();
      expect(result).toHaveProperty("sentence");
      expect(typeof result.sentence).toBe("string");
    });

    it("should return object with paragraph property", () => {
      const result = getRandomText();
      expect(result).toHaveProperty("paragraph");
      expect(typeof result.paragraph).toBe("string");
    });

    it("should generate non-empty strings", () => {
      const result = getRandomText();
      expect(result.word.length).toBeGreaterThan(0);
      expect(result.sentence.length).toBeGreaterThan(0);
      expect(result.paragraph.length).toBeGreaterThan(0);
    });

    it("should generate different text on multiple calls", () => {
      const results = new Set();
      for (let i = 0; i < 5; i++) {
        const text = getRandomText();
        results.add(text.word + text.sentence);
      }

      expect(results.size).toBeGreaterThan(1);
    });

    it("should have sentence longer than single word", () => {
      const result = getRandomText();
      expect(result.sentence.length).toBeGreaterThan(result.word.length);
    });
  });
});
