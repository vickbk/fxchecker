import { z } from "zod";

export const currencyCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Must be a 3-letter ISO currency code")
  .describe("The 3-letter ISO base currency code (required for add/remove)");
