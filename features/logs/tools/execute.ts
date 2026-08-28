import { z } from "zod";
import { LogsAIToolSchema } from "../types";
import { addLogs } from "./add-log";
import { deleteLogs } from "./delete-log";
import { getLogList } from "./list-logs";
import { inputSchema } from "./schema";

export async function execute(props: LogsAIToolSchema) {
  try {
    const data = z.parse(inputSchema, props);
    const { action } = data;

    if (action === "list") return await getLogList(data);
    if (action === "add") return await addLogs(data);
    if (action === "delete") return await deleteLogs(data);

    throw new Error(`Unsupported action specified (${action}).`);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to execute conversion log action.",
    };
  }
}
