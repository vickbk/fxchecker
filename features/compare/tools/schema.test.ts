import { describe, expect, it } from "vitest";
import { currenciesSchema, inputSchema } from "./schema";

describe("Compare Tool Schemas", () => {
  describe("currenciesSchema", () => {
    it("parses, trims, and uppercases valid currency code arrays", () => {
      const result = currenciesSchema.safeParse(["usd", " eur "]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(["USD", "EUR"]);
      }
    });

    it("accepts an empty array structure", () => {
      expect(currenciesSchema.safeParse([]).success).toBe(true);
    });

    it("rejects non-array inputs", () => {
      expect(currenciesSchema.safeParse("USD").success).toBe(false);
      expect(currenciesSchema.safeParse(null).success).toBe(false);
    });
  });

  describe("inputSchema (Discriminated Union)", () => {
    describe("action: 'list'", () => {
      it("allows omitted currencies field", () => {
        const result = inputSchema.safeParse({ action: "list" });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({ action: "list" });
        }
      });

      it("allows optional currencies array when provided", () => {
        const result = inputSchema.safeParse({
          action: "list",
          currencies: ["jpy"],
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action: "list",
            currencies: ["JPY"],
          });
        }
      });
    });

    describe("action: 'add' | 'remove'", () => {
      it.each(["add", "remove"] as const)(
        "requires currencies array for action '%s'",
        (action) => {
          const result = inputSchema.safeParse({ action });
          expect(result.success).toBe(false);
        },
      );

      it.each(["add", "remove"] as const)(
        "successfully parses valid payload for action '%s'",
        (action) => {
          const result = inputSchema.safeParse({
            action,
            currencies: [" gbp ", "cad"],
          });
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toEqual({
              action,
              currencies: ["GBP", "CAD"],
            });
          }
        },
      );
    });

    describe("Schema Rejections", () => {
      it.each([
        {},
        { action: "unsupported" },
        { action: "list", currencies: "USD" },
        { action: "add", currencies: "USD" },
        { action: "remove", currencies: 123 },
      ])("rejects malformed payload: %j", (input) => {
        expect(inputSchema.safeParse(input).success).toBe(false);
      });
    });
  });
});
