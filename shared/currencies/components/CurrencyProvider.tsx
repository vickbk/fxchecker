"use client";

import { ReactNode, use } from "react";
import { CurrencyContext } from "../hooks/CurrencyProvider";
import { CurrencyContextType } from "../types";

export const CurrencyProvider = ({
  children,
  currencies,
  favorites,
}: {
  children: ReactNode;
  currencies: Promise<CurrencyContextType["currencies"]>;
  favorites: Promise<string[]>;
}) => {
  const resolvedCurrencies = use(currencies);
  const resolvedFavorites = use(favorites);
  return (
    <CurrencyContext
      value={{
        currencies: resolvedCurrencies,
        favorites: resolvedFavorites,
        isLoading: false,
        error: null,
      }}
    >
      {children}
    </CurrencyContext>
  );
};
