import { fetchLatestRates } from "@/infra/api/frankfurter";
import { tool } from "ai";
import { z } from "zod";
import { normalizeCurrency } from "../utils/tools";

export const compare_currencies = tool({
  description:
    "Compare current exchange rates and calculate conversions from a base currency against multiple target (quote) currencies simultaneously.",

  inputSchema: z.object({
    base: z
      .string()
      .transform(normalizeCurrency)
      .describe("The 3-letter ISO base currency code (e.g., 'USD', 'EUR')"),

    quotes: z
      .array(
        z
          .string()
          .transform(normalizeCurrency)
          .describe("3-letter ISO target currency code"),
      )
      .transform((arr) => Array.from(new Set(arr)))
      .default([])
      .describe(
        "List of target 3-letter ISO currency codes to compare against (e.g., ['EUR', 'GBP', 'JPY'])",
      ),

    amount: z.coerce
      .number()
      .positive("Amount must be greater than zero")
      .default(1)
      .describe(
        "The amount in base currency to convert across all target currencies (defaults to 1)",
      ),
  }),

  execute: async ({ base, quotes, amount }) => {
    try {
      const ratesData = await fetchLatestRates(base, quotes);

      if (!Array.isArray(ratesData) || ratesData.length === 0) {
        return {
          success: false,
          error: `Could not retrieve comparison rates for base '${base}'. Verify currency codes.`,
        };
      }

      const comparisons = ratesData.map((item) => ({
        currency: item.quote,
        rate: item.rate,
        convertedAmount: Number((amount * item.rate).toFixed(4)),
      }));

      return {
        success: true,
        base,
        amount,
        comparisons,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute currency comparison.",
      };
    }
  },
});
