import { fetchHistoricalRates } from "@/infra/api/frankfurter";
import { getLookbackDate } from "@/shared/utils";
import { HistorySearchParams } from "./types";
import { codeToDays } from "./utils/date";

export async function loadHistoricalRates({
  from,
  to,
  period,
}: HistorySearchParams) {
  try {
    const date = getLookbackDate(codeToDays(period));
    return await fetchHistoricalRates(date, from, [to]);
  } catch (error) {
    console.error(error);
  }
  return null;
}
