import { getRate } from "@/infra/api/frankfurter";
import { tool } from "ai";
import { z } from "zod";
import { normalizeCurrency } from "../utils/tools";

export const convert_currency = tool({
  description:
    "Convert a monetary amount from a base currency to a single target (quote) currency using real-time foreign exchange rates.",

  inputSchema: z.object({
    base: z
      .string()
      .transform(normalizeCurrency)
      .describe(
        "The 3-letter ISO base currency code to convert from (e.g., 'USD', 'EUR', 'GBP')",
      ),

    quote: z
      .string()
      .transform(normalizeCurrency)
      .describe(
        "The 3-letter ISO target currency code to convert to (e.g., 'JPY', 'CAD')",
      ),

    amount: z.coerce
      .number()
      .positive("Amount must be greater than zero")
      .describe("The numerical amount to convert"),
  }),

  execute: async ({ amount, base, quote }) => {
    try {
      const results = await getRate(base, quote);

      if (!results || typeof results.rate !== "number") {
        return {
          success: false,
          error: `Could not retrieve a valid rate for pair ${base}/${quote}. Check if currency codes are supported.`,
        };
      }

      const calculatedResult = Number((amount * results.rate).toFixed(4));

      return {
        success: true,
        base,
        quote,
        amount,
        rate: results.rate,
        result: calculatedResult,
        date: results.date,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute currency conversion.",
      };
    }
  },
});
