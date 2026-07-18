import { useCurrencies } from "@/shared/currencies";
import { useMemo, useState } from "react";

export function useCurrencyList() {
  const { currencies } = useCurrencies();
  const [query, setQuery] = useState("");

  return {
    setQuery,
    filtered: useMemo(
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
    ),
    currencies,
  };
}
