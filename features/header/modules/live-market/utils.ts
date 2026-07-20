import { Currency, fetchCurrencies } from "@/infra/api/frankfurter";
import { getRandomElements } from "@/shared/random";

export async function getCurrencyPairs(): Promise<[Currency, Currency][]> {
  const currencies = await fetchCurrencies();

  if (!currencies || currencies.length < 2) {
    throw new Error("Unable to fetch sufficient currencies to generate pairs.");
  }

  const selected = getRandomElements(
    currencies,
    Math.min(20, currencies.length),
  );
  const pairs: [Currency, Currency][] = [];

  const pairCount = Math.floor(selected.length / 2);

  for (let index = 0; index < pairCount; index++) {
    const base = selected[index];
    const quote = selected[selected.length - 1 - index];

    if (base.code !== quote.code) {
      pairs.push([base, quote]);
    }
  }

  if (pairs.length === 0) {
    throw new Error("Failed to generate valid currency pairs.");
  }

  return pairs;
}
