import { logConversion } from "../actions";
import { LogsAIToolSchema } from "../types";

export async function addLogs(data: LogsAIToolSchema) {
  if (data.action !== "add") throw new Error("Invalid action provided");

  const result = await logConversion(data);

  if (result.success) {
    const { amount, base, quote, rate } = data;
    return {
      revalidate: true,
      success: true,
      message: `Logged conversion of ${amount} ${base} to ${quote} at rate ${rate}.`,
    };
  }

  throw new Error(result.error?.message);
}
