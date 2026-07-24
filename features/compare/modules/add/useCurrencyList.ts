import { groupCurrencies, useCurrencies } from "@/shared/currencies";
import { useMemo, useState } from "react";

export function useCurrencyList() {
  const { currencies, favorites } = useCurrencies();
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      new Set(
        currencies
          .filter(({ name, code, symbol }) =>
            [name, code, symbol].some((name) =>
              name.toLowerCase().includes(query.toLowerCase()),
            ),
          )
          .map(({ code }) => code),
      ),
    [query, currencies],
  );
  const grouped = groupCurrencies(currencies, favorites);

  return {
    setQuery,
    filtered,
    currencies,
    grouped,
  };
}
