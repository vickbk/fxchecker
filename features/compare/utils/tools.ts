import { tool } from "ai";
import { z } from "zod";
import {
  addCompareCurrencies,
  deleteCompareCurrencies,
  getCompareRates,
} from "../actions";

export const manage_compare = tool({
  description:
    "Manage user's compare list. Can list, add or remove compare currency in the list",
  inputSchema: z.object({
    action: z
      .enum(["list", "add", "remove"])
      .describe("The compare management action to perform"),
    currencies: z
      .array(z.string().transform((val) => val?.toUpperCase().trim()))
      .optional()
      .describe(
        "The list of 3-letter ISO currency code (required for add/remove)",
      ),
  }),
  execute: async ({ action, currencies }) => {
    try {
      if (action === "list") {
        return { success: true, compareList: await getCompareRates() };
      }
      if (!currencies)
        return {
          success: false,
          error:
            "the currency codes are required to add or remove to the compare list.",
        };
      if (action === "add" || action === "remove") {
        const isAdd = action === "add";
        const results = await (
          isAdd ? addCompareCurrencies : deleteCompareCurrencies
        )(currencies);
        return {
          revalidate: !!results,
          success: !!results,
          error: results
            ? undefined
            : `Failed to ${isAdd ? "add" : "delete"} ${currencies.join(", ")} to the compare list`,
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
