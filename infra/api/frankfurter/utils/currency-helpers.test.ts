import { describe, expect, it } from "vitest";
import { sanitizeCurrencyCode } from "./currency-helpers";

describe("sanitizeCurrencyCode", () => {
  describe("Valid Currency Codes", () => {
    it.each([
      ["standard 3-letter uppercase", "USD", "USD"],
      ["lowercase 3-letter code", "eur", "EUR"],
      ["mixed-case 3-letter code", "Jpy", "JPY"],
      ["leading and trailing whitespace", "  gbp  ", "GBP"],
      ["tabs and newline padding", "\tusd\n", "USD"],
    ])(
      "trims, normalizes, and returns valid code: %s (%p -> %p)",
      (_, input, expected) => {
        expect(sanitizeCurrencyCode(input, "from")).toBe(expected);
        expect(sanitizeCurrencyCode(input, "to")).toBe(expected);
      },
    );
  });

  describe("Invalid Currency Codes & Field Error Formatting", () => {
    it("formats error message correctly for 'from' fieldName", () => {
      expect(() => sanitizeCurrencyCode("INVALID", "from")).toThrow(
        "Invalid 'from' currency code.",
      );
    });

    it("formats error message correctly for 'to' fieldName", () => {
      expect(() => sanitizeCurrencyCode("INVALID", "to")).toThrow(
        "Invalid 'to' currency code.",
      );
    });

    it.each([
      ["empty string", ""],
      ["whitespace-only string", "   "],
      ["2-letter code (too short)", "US"],
      ["1-letter code (too short)", "A"],
      ["4-letter code (too long)", "USDT"],
      ["extended word", "EUROPE"],
      ["code containing numbers", "US1"],
      ["purely numeric string", "123"],
      ["contains symbols/punctuation", "US$"],
      ["contains hyphens or underscores", "U_S"],
      ["contains internal spaces", "U SD"],
      ["accented characters", "EÜR"],
      ["Cyrillic lookalike characters (homoglyphs)", "УSD"], // Cyrillic 'У'
    ])("throws Error when value is %s (%p)", (_, input) => {
      expect(() => sanitizeCurrencyCode(input, "from")).toThrow(
        "Invalid 'from' currency code.",
      );
      expect(() => sanitizeCurrencyCode(input, "to")).toThrow(
        "Invalid 'to' currency code.",
      );
    });
  });

  describe("Runtime Edge Cases", () => {
    it("fails predictably if non-string types are passed at runtime", () => {
      // @ts-expect-error - Testing JS runtime boundary
      expect(() => sanitizeCurrencyCode(null, "from")).toThrow();
      // @ts-expect-error - Testing JS runtime boundary
      expect(() => sanitizeCurrencyCode(undefined, "to")).toThrow();
      // @ts-expect-error - Testing JS runtime boundary
      expect(() => sanitizeCurrencyCode(123, "from")).toThrow();
    });
  });
});
