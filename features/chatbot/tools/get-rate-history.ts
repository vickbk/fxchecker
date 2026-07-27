import { fetchHistoricalRates } from "@/infra/api/frankfurter";
import { tool } from "ai";
import { z } from "zod";
import { normalizeCurrency } from "../utils/tools";

export const get_rate_history = tool({
  description:
    "Fetch historical foreign exchange rates for a base currency against one or more target (quote) currencies on a specific historical date.",

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
      .transform((arr) => Array.from(new Set(arr))) // Deduplicate codes
      .default([])
      .describe(
        "List of target 3-letter ISO currency codes to fetch historical rates for (e.g., ['EUR', 'GBP'])",
      ),

    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .describe(
        "The target historical date formatted strictly as YYYY-MM-DD (e.g., '2024-01-15')",
      ),
  }),

  execute: async ({ base, quotes, date }) => {
    try {
      const historyData = await fetchHistoricalRates(date, base, quotes);

      if (!historyData) {
        return {
          success: false,
          error: `Could not retrieve historical rates for base '${base}' on ${date}.`,
        };
      }

      return {
        success: true,
        date,
        base,
        rates: historyData,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch historical rates.",
      };
    }
  },
});
