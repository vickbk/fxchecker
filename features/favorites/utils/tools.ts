import { tool } from "ai";
import { z } from "zod";
import { getFavorites, toggleFavorite } from "../actions";

export const manage_favorites = tool({
  description:
    "Manage the user's favorite currency pairs stored in local IndexedDB. Can list, add, or remove currency pairs.",

  inputSchema: z.object({
    action: z
      .enum(["list", "add", "remove"])
      .describe("The favorite management action to perform"),
    base: z
      .string()
      .optional()
      .transform((val) => val?.toUpperCase().trim())
      .describe(
        "The 3-letter ISO base currency code (required for add/remove)",
      ),
    quote: z
      .string()
      .optional()
      .transform((val) => val?.toUpperCase().trim())
      .describe(
        "The 3-letter ISO target currency code (required for add/remove)",
      ),
  }),

  execute: async ({ action, base, quote }) => {
    try {
      if (action === "list") {
        const favorites = await getFavorites();
        return { success: !!favorites, favorites };
      }

      if (!base || !quote) {
        return {
          success: false,
          error:
            "Both base and quote currency codes are required to add or remove a favorite.",
        };
      }

      if (action === "add" || action === "remove") {
        const result = await toggleFavorite({ base, quote });
        return {
          revalidate: true,
          success: result.success,
          message: result.success
            ? `Toggled ${base}/${quote} to favorites.`
            : undefined,
          error: result.success ? undefined : result.error?.message,
        };
      }

      return { success: false, error: "Invalid action." };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute favorites action.",
      };
    }
  },
});
