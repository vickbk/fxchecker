import { CurrencyContextType } from "./types";

export function groupCurrencies(
  currencies: CurrencyContextType["currencies"],
  favorites: string[],
) {
  const currencyLength = currencies?.length ?? 0;
  if (currencyLength === 0) {
    return { favorites: [], others: [] };
  }

  const favoriteLength = favorites?.length ?? 0;
  if (favoriteLength === 0) {
    return { favorites: [], others: [...currencies] };
  }

  const currencyMap = new Map<
    string,
    CurrencyContextType["currencies"][number]
  >();
  for (let i = 0; i < currencyLength; i++) {
    currencyMap.set(currencies[i].code, currencies[i]);
  }

  const favoritesList: CurrencyContextType["currencies"] = [];

  for (let i = 0; i < favoriteLength; i++) {
    const code = favorites[i];
    const currency = currencyMap.get(code);

    if (currency) {
      favoritesList.push(currency);
      currencyMap.delete(code);
    }
  }

  const othersList = Array.from(currencyMap.values());
  return { favorites: favoritesList, others: othersList };
}
