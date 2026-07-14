import { Currency, fetchCurrencies } from "@/infra/api/frankfurter";

export const CourencyCount = async () => {
  let currencies: Currency[] | null = null;
  try {
    currencies = await fetchCurrencies();
  } catch (error) {
    console.error(error);
  }
  if (!currencies) return null;

  return <>{currencies.length} currencies</>;
};
