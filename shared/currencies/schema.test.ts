import { describe, expect, it } from "vitest";
import { currencyCodeSchema } from "./schema";

describe("currencyCodeSchema", () => {
  describe("Valid Inputs & Transformations", () => {
    it.each([
      {
        input: "USD",
        expected: "USD",
        desc: "standard 3-letter uppercase code",
      },
      {
        input: "eur",
        expected: "EUR",
        desc: "lowercase code (transformed to uppercase)",
      },
      {
        input: "Gbp",
        expected: "GBP",
        desc: "mixed-case code (transformed to uppercase)",
      },
      {
        input: "  JPY  ",
        expected: "JPY",
        desc: "whitespace-padded code (trimmed)",
      },
      {
        input: "\tcad \n",
        expected: "CAD",
        desc: "tabs and newlines (trimmed)",
      },
    ])(
      "parses and transforms $desc ('$input' -> '$expected')",
      ({ input, expected }) => {
        const result = currencyCodeSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(expected);
        }
      },
    );
  });

  describe("Validation Failures (Regex & Format Rules)", () => {
    it.each([
      { input: "US", reason: "fewer than 3 characters" },
      { input: "USDT", reason: "more than 3 characters" },
      { input: "U12", reason: "contains numbers" },
      { input: "US$", reason: "contains special characters" },
      { input: "U S", reason: "contains internal spaces" },
      { input: "", reason: "empty string" },
      { input: "   ", reason: "whitespace-only string" },
    ])("rejects invalid string '$input' ($reason)", ({ input }) => {
      const result = currencyCodeSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Must be a 3-letter ISO currency code",
        );
      }
    });
  });

  describe("Type Failures", () => {
    it.each([
      { input: 840, type: "number" },
      { input: true, type: "boolean" },
      { input: null, type: "null" },
      { input: undefined, type: "undefined" },
      { input: {}, type: "object" },
      { input: ["USD"], type: "array" },
    ])("rejects non-string data type ($type)", ({ input }) => {
      const result = currencyCodeSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
