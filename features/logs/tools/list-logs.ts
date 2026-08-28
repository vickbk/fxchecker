import { LogsAIToolSchema } from "../types";
import { getLogs } from "../utils/logs";

export async function getLogList({
  base,
  quote,
  limit,
  amount,
  rate,
}: LogsAIToolSchema) {
  const allLogs = await getLogs();

  const logs = allLogs
    .filter(
      ({ data }) =>
        (!base || data?.base === base) &&
        (!quote || data?.quote === quote) &&
        (amount === undefined || data?.amount === amount) &&
        (rate === undefined || data?.rate === rate),
    )
    .slice(0, limit);

  return {
    success: true,
    count: logs.length,
    logs,
  };
}
