import { tool } from "ai";
import { z } from "zod";
import {
  addCompareCurrencies,
  deleteCompareCurrencies,
  getCompareRates,
} from "../actions";

export const manage_compare = tool({
  description:
    "Manage the user's currency comparison list. Can list current currencies, or add/remove 3-letter ISO currency codes (e.g., USD, EUR, JPY).",
  inputSchema: z.object({
    action: z
      .enum(["list", "add", "remove"])
      .describe("The compare management action to perform"),
    currencies: z
      .array(
        z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z]{3}$/, "Must be a 3-letter ISO currency code"),
      )
      .optional()
      .describe(
        "List of 3-letter ISO currency codes (required and must be non-empty for 'add' or 'remove')",
      ),
  }),
  execute: async ({ action, currencies }) => {
    try {
      if (action === "list") {
        const compareList = await getCompareRates();
        return { success: true, compareList };
      }

      // Guard against missing or empty arrays for mutation actions
      if (!currencies || currencies.length === 0) {
        return {
          success: false,
          error: `At least one valid 3-letter currency code is required to ${action} items.`,
        };
      }

      if (action === "add") {
        const results = await addCompareCurrencies(currencies);
        return {
          success: !!results,
          revalidate: !!results,
          action: "add",
          currencies,
          error: results
            ? undefined
            : `Failed to add ${currencies.join(", ")} to the compare list.`,
        };
      }

      if (action === "remove") {
        const results = await deleteCompareCurrencies(currencies);
        return {
          success: !!results,
          revalidate: !!results,
          action: "remove",
          currencies,
          error: results
            ? undefined
            : `Failed to remove ${currencies.join(", ")} from the compare list.`,
        };
      }

      return { success: false, error: "Invalid action." };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute compare action.",
      };
    }
  },
});
