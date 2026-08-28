import { currencyCodeSchema } from "@/shared/currencies/schema";
import { z } from "zod";

export const amountSchema = z.coerce
  .number()
  .positive("Amount must be greater than zero")
  .describe("The converted amount in base currency. Required for 'add'.");

export const rateSchema = z.coerce
  .number()
  .describe("The exchange rate applied. Required for 'add'.");

export const limitSchema = z.coerce
  .number()
  .positive()
  .default(10)
  .describe(
    "Maximum number of recent log entries to return when listing (defaults to 10).",
  );
export const id = z.string().optional().describe("Id of an item to delete");
export const position = z
  .enum(["latest", "oldest", "first", "last"])
  .or(z.number())
  .optional()
  .describe("absolute or relative positioning of an item to delete");
export const inputSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("list").describe("logs 'list' action queries past logs"),

    limit: limitSchema,
    base: currencyCodeSchema.optional(),
    quote: currencyCodeSchema.optional(),
    amount: amountSchema.optional(),
    rate: rateSchema.optional(),
    position,
    id,
  }),
  z.object({
    action: z
      .literal("add")
      .describe("logs 'add' saves a new conversion entry."),

    base: currencyCodeSchema,
    quote: currencyCodeSchema,
    amount: amountSchema,
    rate: rateSchema,
    limit: limitSchema,
    id,
    position,
  }),
  z.object({
    action: z
      .literal("delete")
      .describe("logs 'delete' clear a log entry from the database."),
    base: currencyCodeSchema.optional(),
    quote: currencyCodeSchema.optional(),
    amount: amountSchema.optional(),
    rate: rateSchema.optional(),
    limit: limitSchema,
    id,
    position,
  }),
]);
