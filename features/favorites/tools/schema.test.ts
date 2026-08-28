import { describe, expect, it } from "vitest";
import { inputSchema } from "./schema";

describe("inputSchema (Discriminated Union)", () => {
  describe("Variant: action = 'list'", () => {
    it("parses minimal payload with only action: 'list'", () => {
      const input = { action: "list" };
      const result = inputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          action: "list",
          base: undefined,
          quote: undefined,
        });
      }
    });

    it("parses action: 'list' with valid optional base and quote", () => {
      const input = { action: "list", base: "USD", quote: "EUR" };
      const result = inputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          action: "list",
          base: "USD",
          quote: "EUR",
        });
      }
    });

    it("applies trim and uppercase transformations to optional base and quote when provided in 'list'", () => {
      const input = { action: "list", base: " gbp ", quote: "jpy " };
      const result = inputSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          action: "list",
          base: "GBP",
          quote: "JPY",
        });
      }
    });

    it("fails validation if provided optional base or quote in 'list' is invalid", () => {
      const result = inputSchema.safeParse({ action: "list", base: "INVALID" });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path.includes("base"));
        expect(issue?.message).toBe("Must be a 3-letter ISO currency code");
      }
    });
  });

  describe("Variants: action = 'add' | 'remove'", () => {
    it.each(["add", "remove"] as const)(
      "parses valid payload for action: '%s'",
      (action) => {
        const input = { action, base: "USD", quote: "EUR" };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action,
            base: "USD",
            quote: "EUR",
          });
        }
      },
    );

    it.each(["add", "remove"] as const)(
      "applies trim and uppercase transformations to base and quote for '%s'",
      (action) => {
        const input = { action, base: "  cad  ", quote: "chf " };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action,
            base: "CAD",
            quote: "CHF",
          });
        }
      },
    );

    it.each(["add", "remove"] as const)(
      "rejects action: '%s' when base or quote is missing",
      (action) => {
        expect(inputSchema.safeParse({ action, quote: "EUR" }).success).toBe(
          false,
        );
        expect(inputSchema.safeParse({ action, base: "USD" }).success).toBe(
          false,
        );
        expect(inputSchema.safeParse({ action }).success).toBe(false);
      },
    );

    it.each([
      { code: "US", reason: "less than 3 letters" },
      { code: "USDT", reason: "more than 3 letters" },
      { code: "U12", reason: "contains digits" },
      { code: "US!", reason: "contains special characters" },
      { code: "", reason: "empty string" },
    ])("rejects invalid currency code '$code' ($reason)", ({ code }) => {
      const resultBase = inputSchema.safeParse({
        action: "add",
        base: code,
        quote: "EUR",
      });
      const resultQuote = inputSchema.safeParse({
        action: "remove",
        base: "USD",
        quote: code,
      });

      expect(resultBase.success).toBe(false);
      expect(resultQuote.success).toBe(false);
    });
  });

  describe("Discriminated Union Edge Cases & Invalid Actions", () => {
    it("rejects unknown action string values", () => {
      const result = inputSchema.safeParse({
        action: "update",
        base: "USD",
        quote: "EUR",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(["action"]);
      }
    });

    it("rejects non-string actions or missing action key", () => {
      expect(
        inputSchema.safeParse({ action: 123, base: "USD", quote: "EUR" })
          .success,
      ).toBe(false);
      expect(inputSchema.safeParse({ base: "USD", quote: "EUR" }).success).toBe(
        false,
      );
    });

    it("rejects non-object payloads", () => {
      expect(inputSchema.safeParse(null).success).toBe(false);
      expect(inputSchema.safeParse("action: list").success).toBe(false);
      expect(inputSchema.safeParse([]).success).toBe(false);
    });
  });
});
