"use client";

import { BiIcon, Flag, getCurrencyCountry, SROnly } from "@/shared/utils";
import { useCurrencyList } from "../useCurrencyList";

export const CurrencyList = () => {
  const { filtered, setQuery, currencies } = useCurrencyList();

  return (
    <fieldset className="flex flex-col gap-2 max-h-104 min-h-78 overflow-y-auto py-4">
      <label className="block sticky -top-4 bg-background-secondary p-4">
        <SROnly>Search query</SROnly>
        <input
          className="w-full p-2"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a currency of your interest"
        />
      </label>
      <p>Currency List ({filtered.length})</p>

      {currencies.map(({ code }) => (
        <input
          type="checkbox"
          key={code}
          name="currency"
          id={`add-currency-${code}`}
          className="sr-only"
        />
      ))}
      {filtered.map(({ code, name, symbol }) => (
        <label
          className="p-2 flex gap-4 border-b border-card justify-between items-center text-start"
          key={`select-label-${code}`}
          htmlFor={`add-currency-${code}`}
        >
          <Flag
            src={`https://flagcdn.com/${getCurrencyCountry(code)}.svg`}
            alt=""
          />
          <span className="grid gap">
            {code} ({symbol}){" "}
            <span className="text-foreground-secondary truncate w-60">
              {name}
            </span>{" "}
          </span>
          <BiIcon name="check ml-auto block" />
        </label>
      ))}
    </fieldset>
  );
};
