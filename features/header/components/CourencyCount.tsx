import { Currency, fetchCurrencies } from "@/infra/api/frankfurter";
import { logError } from "@/shared/utils";

export const CourencyCount = async () => {
  let currencies: Currency[] | null = null;
  try {
    currencies = await fetchCurrencies();
  } catch (error) {
    logError(error);
  }
  if (!currencies) return null;

  return <>{currencies.length} currencies</>;
};
