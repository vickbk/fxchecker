import { currencyCodeSchema } from "@/shared/currencies/schema";
import { z } from "zod";

export const currenciesSchema = z
  .array(currencyCodeSchema)
  .describe(
    "List of 3-letter ISO currency codes (required and must be non-empty for 'add' or 'remove')",
  );

export const inputSchema = z.discriminatedUnion("action", [
  z.object({
    action: z
      .literal("list")
      .describe("The 'list' compare management action to perform"),
    currencies: currenciesSchema
      .optional()
      .describe("List of 3-letter ISO currency codes"),
  }),

  z.object({
    action: z
      .enum(["add", "remove"])
      .describe("The compare management action to perform"),
    currencies: currenciesSchema,
  }),
]);
