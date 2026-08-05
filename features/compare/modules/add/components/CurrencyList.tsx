"use client";

import { SROnly } from "@/shared/utils";
import { useCurrencyList } from "../useCurrencyList";
import { CurrencyGroup } from "./CurrencyGroup";

export const CurrencyList = () => {
  const {
    filtered,
    setQuery,
    grouped: { favorites, others },
  } = useCurrencyList();
  const props = { currencies: favorites, title: "Favorites", filtered };
  return (
    <>
      <label className="block sticky -top-4 bg-card">
        <SROnly>Enter currency name</SROnly>
        <input
          className="w-full rounded-md p-2 outline outline-btn hover:outline-lime-500 focus:outline-lime-500"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a currency of your interest"
        />
      </label>
      <fieldset className="flex flex-col gap-2 max-w-full add-compare__list px-1 max-h-80 min-h-64 scrollbar-none overflow-y-auto">
        <CurrencyGroup {...props} />

        <CurrencyGroup
          {...{ ...props, title: "Other currencies", currencies: others }}
        />
      </fieldset>
    </>
  );
};
