import { getCompareRates } from "../actions";
import { CompareAIToolSchema } from "../types";

export async function getCompareList(data: CompareAIToolSchema) {
  if (data.action !== "list") throw new Error("Invalid action provided");

  const compareList = await getCompareRates();
  return { success: true, compareList };
}
