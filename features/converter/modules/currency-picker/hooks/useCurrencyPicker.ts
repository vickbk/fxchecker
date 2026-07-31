import { groupCurrencies, useCurrencies } from "@/shared/currencies";
import { useURLState } from "@/shared/url";
import { useState } from "react";
import { useCurrencyFilter } from "./useCurrencyFilter";

export function useCurrencyPicker({ isSend }: { isSend: boolean }) {
  const { from, to, setFrom, setTo } = useURLState();
  const { currencies, favorites } = useCurrencies();

  const { filteredCurrencies, ...filterOptions } = useCurrencyFilter({
    currencies,
  });
  const [choice, setChoice] = useState(isSend ? from : to);
  const actualCurr =
    currencies.find(({ code }) => code === (isSend ? from : to)) ??
    currencies.find(({ code }) => code === (isSend ? "USD" : "EUR"));

  const { favorites: filteredFavorites, others } = groupCurrencies(
    filteredCurrencies,
    favorites,
  );

  return {
    setCurrencyQuery: (code: string) => (isSend ? setFrom(code) : setTo(code)),
    filterOptions,
    choice,
    setChoice,
    actualCurr,
    filteredFavorites,
    filteredCurrencies,
    otherCurrencies: others,
  };
}
