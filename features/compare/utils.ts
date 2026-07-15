import { fetchCurrencies } from "@/infra/api/frankfurter";
import { getRandomElement } from "@/shared/random";

export const defaultCurrencies = [
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "ZAR",
];

export async function resolveCompareList(
  base: string,
  list: string[] = defaultCurrencies,
) {
  const index = list.indexOf(base);
  const copy = [...list];

  if (index === -1) return copy;

  const currencies = await fetchCurrencies();
  if (currencies.length === 0) return copy;

  const alternativeCurrencies = currencies.filter(({ code }) => base !== code);
  if (alternativeCurrencies.length === 0) return copy;

  const { code } = getRandomElement(alternativeCurrencies);
  copy[index] = code;

  return copy;
}
