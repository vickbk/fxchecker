"use client";
import { createContext, useContext } from "react";
import { CurrencyContextType } from "../types";

export const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function useCurrencies() {
  const ctx = useContext(CurrencyContext);

  if (!ctx)
    throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
