"use client";

import { BiIcon, Flag, getCurrencyCountry, SROnly } from "@/shared/utils";
import { Fragment } from "react/jsx-runtime";
import { useCurrencyList } from "../useCurrencyList";

export const CurrencyList = () => {
  const { filtered, setQuery, currencies } = useCurrencyList();

  return (
    <fieldset className="flex flex-col gap-2 max-h-104 min-h-78 max-w-full overflow-y-auto py-4 add-compare__list">
      <label className="block sticky -top-4 bg-card p-4">
        <SROnly>Search query</SROnly>
        <input
          className="w-full p-2 outline outline-background"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a currency of your interest"
        />
      </label>
      <p>Currency List ({filtered.size})</p>

      {currencies.map(({ code, symbol, name }) => (
        <Fragment key={code}>
          <input
            type="checkbox"
            name="currency"
            value={code}
            id={`add-currency-${code}`}
            className={`add-compare__option`}
          />
          <label
            className={`add-compare__option-label ${!filtered.has(code) ? "hidden" : "flex"}`}
            htmlFor={`add-currency-${code}`}
          >
            <Flag country={getCurrencyCountry(code)} alt="" />
            <span className="grid gap mr-auto">
              {code} ({symbol}){" "}
              <span className="text-foreground-secondary truncate max-w-50">
                {name}
              </span>{" "}
            </span>
            <BiIcon name="check add-compare__check" />
          </label>
        </Fragment>
      ))}
    </fieldset>
  );
};
