import { tool } from "ai";
import { z } from "zod";
import { logConversion } from "../actions";
import { getLogs } from "./logs";

export const manage_conversion_logs = tool({
  description:
    "Retrieve past conversion history logs or record a new conversion in the local log store.",

  inputSchema: z.object({
    action: z
      .enum(["list", "add"])
      .describe(
        "Action to perform: 'list' queries past logs, 'add' saves a new conversion entry.",
      ),

    base: z
      .string()
      .optional()
      .transform((val) => val?.toUpperCase().trim())
      .describe(
        "3-letter ISO base currency code (e.g., 'USD'). Required for 'add', optional filter for 'list'.",
      ),

    quote: z
      .string()
      .optional()
      .transform((val) => val?.toUpperCase().trim())
      .describe(
        "3-letter ISO target/quote currency code (e.g., 'EUR'). Required for 'add'.",
      ),

    amount: z.coerce
      .number()
      .positive("Amount must be greater than zero")
      .optional()
      .describe("The converted amount in base currency. Required for 'add'."),

    rate: z.coerce
      .number()
      .optional()
      .describe("The exchange rate applied. Required for 'add'."),

    limit: z.coerce
      .number()
      .positive()
      .default(10)
      .describe(
        "Maximum number of recent log entries to return when listing (defaults to 10).",
      ),
  }),

  execute: async ({ action, base, quote, amount, rate, limit }) => {
    try {
      if (action === "list") {
        const allLogs = await getLogs();

        const logs = allLogs
          .filter(({ data }) => !base || data.base === base)
          .slice(0, limit);

        return {
          success: true,
          count: logs.length,
          logs,
        };
      }

      if (action === "add") {
        if (!base || !quote || !amount || !rate) {
          return {
            success: false,
            error:
              "Adding a log entry requires 'base', 'quote', 'amount', and 'rate'.",
          };
        }

        const result = await logConversion({ base, quote, amount, rate });

        if (result.success)
          return {
            revalidate: true,
            success: true,
            message: `Logged conversion of ${amount} ${base} to ${quote} at rate ${rate}.`,
          };
        else return { success: false, error: result.error?.message };
      }

      return {
        success: false,
        error: "Unsupported action specified.",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute conversion log action.",
      };
    }
  },
});
