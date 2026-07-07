import { joinClasses } from "./other-helpers";

describe("Other Helpers", () => {
  describe("join classes", () => {
    it("should join multiple classes", () => {
      const result = joinClasses(["btn", "btn-primary", "btn-lg"]);
      expect(result).toBe("btn btn-primary btn-lg");
    });

    it("should filter out false values", () => {
      const result = joinClasses([
        "btn",
        false,
        "btn-primary",
        false,
        "btn-lg",
      ]);
      expect(result).toBe("btn btn-primary btn-lg");
    });

    it("should handle empty array", () => {
      const result = joinClasses([]);
      expect(result).toBe("");
    });

    it("should handle array with only false values", () => {
      const result = joinClasses([false, false, false]);
      expect(result).toBe("");
    });

    it("should handle array with one class", () => {
      const result = joinClasses(["btn"]);
      expect(result).toBe("btn");
    });

    it("should handle mixed false positions", () => {
      const result = joinClasses([false, "btn", false, "primary", "lg", false]);
      expect(result).toBe("btn primary lg");
    });

    it("should work with template strings and conditionals", () => {
      const isActive = true;
      const isDisabled = false;
      const result = joinClasses([
        "btn",
        isActive && "btn-active",
        isDisabled && "btn-disabled",
      ]);
      expect(result).toBe("btn btn-active");
    });

    it("should not add extra spaces", () => {
      const result = joinClasses(["class1", "class2"]);
      expect(result).not.toContain("  ");
    });
  });
});
