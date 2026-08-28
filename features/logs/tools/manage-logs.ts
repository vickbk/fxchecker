import { tool } from "ai";
import { execute } from "./execute";
import { inputSchema } from "./schema";

export const manage_conversion_logs = tool({
  description:
    "Retrieve past conversion history logs or record a new conversion in the local log store.",
  inputSchema,
  execute,
});
