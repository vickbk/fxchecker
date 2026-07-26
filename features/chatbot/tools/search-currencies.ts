import { fetchCurrencies, fetchCurrencyDetails } from "@/infra/api/frankfurter";
import { getRandomElements } from "@/shared/random";
import { tool } from "ai";
import { z } from "zod";
import { normalizeCurrency } from "../utils/tools";

export const search_currency = tool({
  description:
    "Retrieve detailed currency information (such as symbol, full name, and country list) for a specific 3-letter currency code.",

  inputSchema: z.object({
    code: z
      .string()
      .length(3, "Currency code must be exactly 3 uppercase letters")
      .transform(normalizeCurrency)
      .describe(
        "The 3-letter ISO 4217 currency code (e.g., 'USD', 'EUR', 'JPY'). If the user mentions a country or currency name (like 'Japan' or 'Yen'), resolve it to its 3-letter code before calling.",
      ),
  }),

  execute: async ({ code }) => {
    try {
      const details = await fetchCurrencyDetails(code);

      if (!details) {
        return {
          success: false,
          error: `No details found for currency code '${code}'. Verify if the 3-letter ISO code is supported.`,
        };
      }

      return {
        success: true,
        code,
        details,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve currency details.",
      };
    }
  },
});

export const get_currencies = tool({
  description:
    "Search or filter supported currencies by name, code, or symbol. If no search criteria are provided, returns a sample list of 5 supported currencies.",

  inputSchema: z.object({
    names: z
      .array(
        z
          .string()
          .transform(normalizeCurrency)
          .describe("Search term matching currency code, name, or symbol"),
      )
      .default([])
      .describe(
        "Optional list of search terms or currency names/codes to filter by",
      ),
  }),

  execute: async ({ names }) => {
    try {
      const list = await fetchCurrencies();

      if (!Array.isArray(list) || list.length === 0) {
        return {
          success: false,
          error: "Unable to retrieve the currency directory.",
        };
      }

      if (names.length === 0) {
        return {
          success: true,
          isSample: true,
          currencies: getRandomElements(list, 5),
        };
      }

      const filtered = list.filter(({ name, code, symbol }) => {
        const lowerName = (name ?? "").toLowerCase();
        const lowerCode = (code ?? "").toLowerCase();
        const lowerSymbol = (symbol ?? "").toLowerCase();

        return names.some(
          (term) =>
            lowerName.includes(term) ||
            lowerCode.includes(term) ||
            lowerSymbol.includes(term),
        );
      });

      return {
        success: true,
        isSample: false,
        count: filtered.length,
        currencies: filtered,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to search currencies.",
      };
    }
  },
});
