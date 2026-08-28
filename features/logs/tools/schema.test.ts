import { describe, expect, it } from "vitest";
import { LogsAIToolSchema } from "../types";
import {
  amountSchema,
  id,
  inputSchema,
  limitSchema,
  position,
  rateSchema,
} from "./schema";

export function getLogSchemaPayload(
  overWrite: Partial<LogsAIToolSchema> = {},
): LogsAIToolSchema {
  return {
    action: "list",
    limit: 10,
    ...overWrite,
  } as LogsAIToolSchema;
}

describe("Conversion Log Schemas", () => {
  describe("amountSchema", () => {
    it.each([
      { input: 100, expected: 100, desc: "positive integer" },
      { input: 0.01, expected: 0.01, desc: "positive decimal" },
      { input: "250.50", expected: 250.5, desc: "coercible numeric string" },
    ])(
      "parses valid positive values: $desc ($input)",
      ({ input, expected }) => {
        const result = amountSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(expected);
        }
      },
    );

    it.each([
      { input: 0, reason: "zero" },
      { input: -10, reason: "negative number" },
      { input: "-5.25", reason: "negative numeric string" },
    ])("rejects non-positive numbers: $reason ($input)", ({ input }) => {
      const result = amountSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Amount must be greater than zero",
        );
      }
    });

    it.each([
      { input: "invalid", desc: "non-numeric string" },
      { input: NaN, desc: "NaN" },
      { input: undefined, desc: "undefined" },
      { input: {}, desc: "object" },
    ])("rejects uncoercible non-numeric types: $desc", ({ input }) => {
      expect(amountSchema.safeParse(input).success).toBe(false);
    });
  });

  describe("rateSchema", () => {
    it.each([
      { input: 1.085, expected: 1.085, desc: "decimal float" },
      { input: 0, expected: 0, desc: "zero" },
      { input: "1.25", expected: 1.25, desc: "coercible numeric string" },
    ])(
      "coerces and parses valid rate values: $desc ($input)",
      ({ input, expected }) => {
        const result = rateSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(expected);
        }
      },
    );

    it.each([
      { input: "abc", desc: "non-numeric string" },
      { input: NaN, desc: "NaN" },
      { input: undefined, desc: "undefined" },
    ])("rejects uncoercible inputs: $desc", ({ input }) => {
      expect(rateSchema.safeParse(input).success).toBe(false);
    });
  });

  describe("limitSchema", () => {
    it("applies default value of 10 when input is undefined", () => {
      const result = limitSchema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(10);
      }
    });

    it.each([
      { input: 5, expected: 5, desc: "positive integer" },
      { input: "25", expected: 25, desc: "numeric string" },
    ])("parses valid positive limit: $desc ($input)", ({ input, expected }) => {
      const result = limitSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(expected);
      }
    });

    it.each([
      { input: 0, reason: "zero" },
      { input: -1, reason: "negative number" },
      { input: "abc", reason: "invalid string" },
    ])("rejects invalid limit values: $reason ($input)", ({ input }) => {
      expect(limitSchema.safeParse(input).success).toBe(false);
    });
  });

  describe("id schema", () => {
    it.each([
      { input: "log-123", desc: "string id" },
      { input: undefined, desc: "undefined (optional)" },
    ])("parses valid optional string ID: $desc", ({ input }) => {
      const result = id.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(input);
      }
    });

    it.each([
      { input: 123, desc: "number" },
      { input: {}, desc: "object" },
      { input: true, desc: "boolean" },
    ])("rejects non-string ID values: $desc", ({ input }) => {
      expect(id.safeParse(input).success).toBe(false);
    });
  });

  describe("position schema", () => {
    it.each([
      { input: "latest", expected: "latest", desc: "enum string 'latest'" },
      { input: "oldest", expected: "oldest", desc: "enum string 'oldest'" },
      { input: "first", expected: "first", desc: "enum string 'first'" },
      { input: "last", expected: "last", desc: "enum string 'last'" },
      { input: 0, expected: 0, desc: "numeric index zero" },
      { input: 3, expected: 3, desc: "positive numeric index" },
      { input: undefined, expected: undefined, desc: "undefined (optional)" },
    ])("parses valid position value: $desc", ({ input, expected }) => {
      const result = position.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(expected);
      }
    });

    it.each([
      { input: "number one", desc: "unsupported string" },
      { input: "greatest", desc: "unsupported string" },
      { input: null, desc: "null" },
      { input: {}, desc: "object" },
    ])("rejects invalid position values: $desc", ({ input }) => {
      expect(position.safeParse(input).success).toBe(false);
    });
  });

  describe("inputSchema (Discriminated Union)", () => {
    describe("Variant: action = 'list'", () => {
      it("parses minimal list payload and applies default limit", () => {
        const result = inputSchema.safeParse({ action: "list" });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action: "list",
            limit: 10,
            base: undefined,
            quote: undefined,
            amount: undefined,
            rate: undefined,
            position: undefined,
            id: undefined,
          });
        }
      });

      it("parses full list payload including id and position", () => {
        const input = {
          action: "list",
          limit: "15",
          base: " usd ",
          quote: "eur",
          amount: "100.50",
          rate: "1.08",
          position: "latest",
          id: "log-123",
        };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action: "list",
            limit: 15,
            base: "USD",
            quote: "EUR",
            amount: 100.5,
            rate: 1.08,
            position: "latest",
            id: "log-123",
          });
        }
      });

      it("fails validation if an optional field provided to 'list' is invalid", () => {
        const result = inputSchema.safeParse({
          action: "list",
          amount: -50,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          const issue = result.error.issues.find((i) =>
            i.path.includes("amount"),
          );
          expect(issue?.message).toBe("Amount must be greater than zero");
        }
      });
    });

    describe("Variant: action = 'add'", () => {
      it("parses valid 'add' payload with required fields and applies limit default", () => {
        const input = {
          action: "add",
          base: " gbp ",
          quote: "jpy",
          amount: "500",
          rate: "195.2",
        };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action: "add",
            base: "GBP",
            quote: "JPY",
            amount: 500,
            rate: 195.2,
            limit: 10,
            position: undefined,
            id: undefined,
          });
        }
      });

      it("parses 'add' payload with optional id and position", () => {
        const input = {
          action: "add",
          base: "USD",
          quote: "EUR",
          amount: 100,
          rate: 1.08,
          id: "custom-id-001",
          position: "first",
        };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.id).toBe("custom-id-001");
          expect(result.data.position).toBe("first");
        }
      });

      it.each([
        {
          missingField: "base",
          payload: { action: "add", quote: "EUR", amount: 100, rate: 1.08 },
        },
        {
          missingField: "quote",
          payload: { action: "add", base: "USD", amount: 100, rate: 1.08 },
        },
        {
          missingField: "amount",
          payload: { action: "add", base: "USD", quote: "EUR", rate: 1.08 },
        },
        {
          missingField: "rate",
          payload: { action: "add", base: "USD", quote: "EUR", amount: 100 },
        },
      ])(
        "rejects 'add' action when missing required field: $missingField",
        ({ payload }) => {
          const result = inputSchema.safeParse(payload);
          expect(result.success).toBe(false);
        },
      );

      it("rejects 'add' action when required field values are invalid", () => {
        const result = inputSchema.safeParse({
          action: "add",
          base: "USD",
          quote: "EUR",
          amount: 0,
          rate: 1.08,
        });

        expect(result.success).toBe(false);
      });
    });

    describe("Variant: action = 'delete'", () => {
      it("parses minimal 'delete' payload and applies default limit", () => {
        const result = inputSchema.safeParse({ action: "delete" });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action: "delete",
            limit: 10,
            base: undefined,
            quote: undefined,
            amount: undefined,
            rate: undefined,
            position: undefined,
            id: undefined,
          });
        }
      });

      it("parses direct 'delete' payload with explicit item ID", () => {
        const input = {
          action: "delete",
          id: "log-target-999",
        };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action: "delete",
            id: "log-target-999",
            limit: 10,
            base: undefined,
            quote: undefined,
            amount: undefined,
            rate: undefined,
            position: undefined,
          });
        }
      });

      it("parses full 'delete' payload with filter options, position, and id", () => {
        const input = {
          action: "delete",
          id: "log-target-999",
          base: " usd ",
          quote: "eur",
          amount: "100.50",
          rate: "1.08",
          position: "latest",
          limit: "5",
        };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            action: "delete",
            id: "log-target-999",
            base: "USD",
            quote: "EUR",
            amount: 100.5,
            rate: 1.08,
            position: "latest",
            limit: 5,
          });
        }
      });

      it("parses 'delete' payload with position enum value 'last'", () => {
        const input = {
          action: "delete",
          base: "CAD",
          position: "last",
        };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.position).toBe("last");
        }
      });

      it("parses 'delete' payload with numeric position index", () => {
        const input = {
          action: "delete",
          base: "CAD",
          position: 2,
        };
        const result = inputSchema.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.position).toBe(2);
        }
      });

      it("rejects 'delete' action when invalid position is provided", () => {
        const result = inputSchema.safeParse({
          action: "delete",
          position: "invalid_position",
        });

        expect(result.success).toBe(false);
      });

      it("rejects 'delete' action when non-string ID is provided", () => {
        const result = inputSchema.safeParse({
          action: "delete",
          id: 12345,
        });

        expect(result.success).toBe(false);
      });

      it("rejects 'delete' action when optional parameter has invalid value", () => {
        const result = inputSchema.safeParse({
          action: "delete",
          amount: -10,
        });

        expect(result.success).toBe(false);
      });
    });

    describe("Discriminated Union Edge Cases", () => {
      it("rejects unsupported action values", () => {
        const result = inputSchema.safeParse({ action: "unsupported_action" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(["action"]);
        }
      });

      it("rejects non-object inputs", () => {
        expect(inputSchema.safeParse(null).success).toBe(false);
        expect(inputSchema.safeParse("action: add").success).toBe(false);
      });
    });
  });
});
