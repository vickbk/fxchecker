import { currencyCodeSchema } from "@/shared/currencies/schema";
import { z } from "zod";

export const inputSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("list").describe("The favorite list action"),
    base: currencyCodeSchema.optional(),
    quote: currencyCodeSchema.optional(),
  }),
  z.object({
    action: z
      .enum(["add", "remove"])
      .describe("The favorite management action to perform"),
    base: currencyCodeSchema,
    quote: currencyCodeSchema,
  }),
]);
