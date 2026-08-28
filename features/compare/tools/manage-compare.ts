import { tool } from "ai";
import { execute } from "./execute";
import { inputSchema } from "./schema";

export const manage_compare = tool({
  description:
    "Manage the user's currency comparison list. Can list current currencies, or add/remove 3-letter ISO currency codes (e.g., USD, EUR, JPY).",
  inputSchema,
  execute,
});
