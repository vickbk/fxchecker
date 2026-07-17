import { useCurrencies } from "@/shared/currencies";
import { useMemo, useState } from "react";

export function useCurrencyList() {
  const { currencies } = useCurrencies();
  const [query, setQuery] = useState("");

  return {
    setQuery,
    filtered: useMemo(
      () =>
        currencies.filter(({ name, code, symbol }) =>
          [name, code, symbol].some((name) =>
            name.toLowerCase().includes(query.toLowerCase()),
          ),
        ),
      [query, currencies],
    ),
    currencies,
  };
}
