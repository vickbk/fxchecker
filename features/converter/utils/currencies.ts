export function filteredCurrencies(
  currencies: CurrencyOption[],
  query: string,
) {
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
  currencies: CurrencyOption[],
  index: number,
) {
  const { length } = currencies;
  if (index < length) return index;
  return -1;
}
