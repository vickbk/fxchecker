import { LogsAIToolSchema } from "../types";

export function findTargetLogId(
  logs: { id: string }[],
  position: LogsAIToolSchema["position"],
) {
  let targetLog;
  if (logs.length === 1) {
    targetLog = logs[0];
  } else if (position === "latest" || position === "last") {
    targetLog = logs[0];
  } else if (position === "oldest" || position === "first") {
    targetLog = logs[logs.length - 1];
  } else if (typeof position === "number") {
    targetLog = logs[position];
    if (!targetLog) {
      throw new Error(
        `Invalid position index ${position}. Range is 0 to ${logs.length - 1}.`,
      );
    }
  }

  if (!targetLog?.id) {
    throw new Error("Unable to identify target log to delete.");
  }

  return targetLog.id;
}
