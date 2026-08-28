import { tool } from "ai";
import { execute } from "./execute";
import { inputSchema } from "./schema";

export const manage_favorites = tool({
  description:
    "Manage the user's favorite currency pairs. Can list, add, or remove currency pairs.",
  inputSchema,

  execute,
});
