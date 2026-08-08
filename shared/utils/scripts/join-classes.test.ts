import { describe, expect, it } from "vitest";
import { joinClasses } from "./join-classes";

describe("joinClasses", () => {
  describe("join classes legacy behavior", () => {
    it("should join multiple classes", () => {
      const result = joinClasses("btn", "btn-primary", "btn-lg");
      expect(result).toBe("btn btn-primary btn-lg");
    });

    it("should filter out false values", () => {
      const result = joinClasses("btn", false, "btn-primary", false, "btn-lg");
      expect(result).toBe("btn btn-primary btn-lg");
    });

    it("should handle empty array", () => {
      const result = joinClasses();
      expect(result).toBe("");
    });

    it("should handle array with only false values", () => {
      const result = joinClasses(false, false, false);
      expect(result).toBe("");
    });

    it("should handle array with one class", () => {
      const result = joinClasses("btn");
      expect(result).toBe("btn");
    });

    it("should handle mixed false positions", () => {
      const result = joinClasses(false, "btn", false, "primary", "lg", false);
      expect(result).toBe("btn primary lg");
    });

    it("should work with template strings and conditionals", () => {
      const isActive = true;
      const isDisabled = false;
      const result = joinClasses(
        "btn",
        isActive && "btn-active",
        isDisabled && "btn-disabled",
      );
      expect(result).toBe("btn btn-active");
    });

    it("should not add extra spaces", () => {
      const result = joinClasses("class1", "class2");
      expect(result).not.toContain("  ");
    });
  });
  // ==========================================
  // 1. BASIC STRING JOINING
  // ==========================================
  describe("basic functionality", () => {
    it("joins multiple class strings with a single space", () => {
      expect(joinClasses("btn", "btn-primary", "large")).toBe(
        "btn btn-primary large",
      );
    });

    it("returns a single string unchanged", () => {
      expect(joinClasses("container")).toBe("container");
    });

    it("returns an empty string when no arguments are provided", () => {
      expect(joinClasses()).toBe("");
    });
  });

  // ==========================================
  // 2. FALSY VALUES FILTERING
  // ==========================================
  describe("falsy value filtering", () => {
    it("filters out boolean false", () => {
      expect(joinClasses("btn", false, "active")).toBe("btn active");
    });

    it("filters out null and undefined (common in React optional props)", () => {
      expect(joinClasses("card", null, undefined, "shadow")).toBe(
        "card shadow",
      );
    });

    it("filters out empty strings without adding extra spaces", () => {
      expect(joinClasses("header", "", "fixed", "")).toBe("header fixed");
    });

    it("filters out numeric 0 and NaN", () => {
      expect(joinClasses("badge", 0, NaN, "count")).toBe("badge count");
    });

    it("returns an empty string when ALL arguments are falsy", () => {
      expect(joinClasses(false, null, undefined, "", 0, NaN)).toBe("");
    });
  });

  // ==========================================
  // 3. NUMBERS & TRUTHY VALUES
  // ==========================================
  describe("numbers and truthy non-string values", () => {
    it("includes positive and negative non-zero numbers as strings", () => {
      expect(joinClasses("col", 12, "order", -1)).toBe("col 12 order -1");
    });

    it("handles boolean true (converts to string 'true' if passed directly)", () => {
      // Direct boolean true is truthy in JavaScript `if (cls)`
      expect(joinClasses("item", true)).toBe("item true");
    });
  });

  // ==========================================
  // 4. COMMON REACT CONDITIONAL PATTERNS
  // ==========================================
  describe("conditional expressions in React", () => {
    it("handles logical AND (&&) conditionals cleanly", () => {
      const isActive = true;
      const isDisabled = false;
      const isPending = undefined;

      const result = joinClasses(
        "btn",
        isActive && "btn-active",
        isDisabled && "btn-disabled",
        isPending && "btn-pending",
      );

      expect(result).toBe("btn btn-active");
    });

    it("handles ternary operator conditionals cleanly", () => {
      const variant: "primary" | "secondary" = "primary";
      const error: string | null = null;

      const result = joinClasses(
        "box",
        variant === "primary" ? "box-primary" : "box-secondary",
        error ? "box-error" : null,
      );

      expect(result).toBe("box box-primary");
    });

    it("evaluates a complex mix of prop types smoothly", () => {
      const customClassName: string | undefined = undefined;
      const count = 5;
      const selectedId = 0; // Falsy number

      const result = joinClasses(
        "list-item",
        customClassName,
        count && "has-count",
        selectedId && `selected-${selectedId}`,
      );

      expect(result).toBe("list-item has-count");
    });
  });

  // ==========================================
  // 5. SPACE HYGIENE
  // ==========================================
  describe("space hygiene", () => {
    it("never produces double spaces between valid class names", () => {
      const result = joinClasses("a", false, "b", "", null, "c");
      expect(result).toBe("a b c");
      expect(result).not.toContain("  ");
    });

    it("does not add leading or trailing spaces", () => {
      const result = joinClasses(undefined, "middle", false);
      expect(result).toBe("middle");
      expect(result.startsWith(" ")).toBe(false);
      expect(result.endsWith(" ")).toBe(false);
    });
  });

  // ==========================================
  // 6. LARGE INPUTS & ARRAYS
  // ==========================================
  describe("edge cases & spread arrays", () => {
    it("handles large numbers of arguments efficiently", () => {
      const classes = Array.from({ length: 100 }, (_, i) =>
        i % 2 === 0 ? `cls-${i}` : false,
      );

      const result = joinClasses(...classes);
      expect(result.split(" ").length).toBe(50);
      expect(result).toContain("cls-0");
      expect(result).toContain("cls-98");
      expect(result).not.toContain("false");
    });
  });
});
