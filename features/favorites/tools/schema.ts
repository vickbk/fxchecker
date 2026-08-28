import { z } from "zod";

const currencySchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Must be a 3-letter ISO currency code")
  .describe("The 3-letter ISO base currency code (required for add/remove)");
export const inputSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("list").describe("The favorite list action"),
    base: currencySchema.optional(),
    quote: currencySchema.optional(),
  }),
  z.object({
    action: z
      .enum(["add", "remove"])
      .describe("The favorite management action to perform"),
    base: currencySchema,
    quote: currencySchema,
  }),
]);
