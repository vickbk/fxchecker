import { Currency } from "@/infra/api/frankfurter";

export function filteredCurrencies(currencies: Currency[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === "") {
    return currencies;
  }

  return currencies.filter((currency) => {
    const haystack =
      `${currency.code} ${currency.name} ${currency.symbol}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function highlightedCurrencyIndex(
  currencies: Currency[],
  index: number,
) {
  const { length } = currencies;
  if (index < length) return index;
  return -1;
}
