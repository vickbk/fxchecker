import { deleteLogItem } from "../actions";
import { LogsAIToolSchema } from "../types";
import { findTargetLogId } from "./find-target-log";
import { getLogList } from "./list-logs";

export async function deleteLogs(data: LogsAIToolSchema) {
  if (data.action !== "delete") throw new Error("Invalid action provided");

  let targetId = data.id;

  if (!targetId) {
    const { logs } = await getLogList({
      ...data,
      action: "list",
      limit: 100,
    });

    if (!logs || logs.length === 0) {
      throw new Error("No logs found matching the provided criteria.");
    }

    if (logs.length > 1 && data.position === undefined) {
      throw new Error(
        `Query is vague: found ${logs.length} matching logs. Please specify a position ('latest', 'oldest', 'first', 'last' or index) or log ID.`,
      );
    }

    targetId = findTargetLogId(logs, data.position);
  }

  const result = await deleteLogItem(targetId);

  if (result.success) {
    return {
      revalidate: true,
      success: true,
      message: `Successfully deleted log entry ${targetId}.`,
    };
  }

  throw new Error(result.error?.message || "Failed to delete log entry.");
}
