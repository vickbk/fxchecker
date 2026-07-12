"use client";

import { ReactNode, use } from "react";
import { CurrencyContext } from "../hooks/CurrencyProvider";
import { CurrencyContextType } from "../types";

export const CurrencyProvider = ({
  children,
  currencies,
}: {
  children: ReactNode;
  currencies: Promise<CurrencyContextType["currencies"]>;
}) => {
  const resolvedCurrencies = use(currencies);
  return (
    <CurrencyContext
      value={{ currencies: resolvedCurrencies, isLoading: false, error: null }}
    >
      {children}
    </CurrencyContext>
  );
};
