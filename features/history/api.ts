import { fetchHistoricalRates } from "@/infra/api/frankfurter";
import { getLookbackDate, logError } from "@/shared/utils";
import { HistorySearchParams } from "./types";
import { codeToDays } from "./utils/date";

export async function loadHistoricalRates({
  from = "USD",
  to = "EUR",
  period = "3M",
}: HistorySearchParams) {
  try {
    const date = getLookbackDate(codeToDays(period));
    return await fetchHistoricalRates(date, from, [to]);
  } catch (error) {
    logError(error);
  }
  return null;
}
