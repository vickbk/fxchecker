"use client";
import { useCurrencies } from "@/shared/currencies";
import { Article } from "@/shared/heading";
import {
  BiIcon,
  Flag,
  getCurrencyCountry,
  LoadingPlaceholder,
  SROnly,
} from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import { useId, useState } from "react";
import { useCurrencyFilter } from "../hooks/useCurrencyFilter";
import { useURLState } from "../hooks/useURLState";

export const CurrencyCard = ({ isSend = false }: { isSend: boolean }) => {
  const id = useId();
  const searchId = useId();
  const popover = useId();

  const { from, to, setFrom, setTo } = useURLState();
  const { currencies } = useCurrencies();
  const { filteredCurrencies, setQuery, isOpen, openMenu, closeMenu } =
    useCurrencyFilter({
      currencies,
    });
  const [choice, setChoice] = useState(isSend ? from : to);

  const actualCurr =
    currencies.find(({ code }) => code === (isSend ? from : to)) ??
    currencies.find(({ code }) => code === (isSend ? "USD" : "EUR"));

  if (!actualCurr) return null;
  const country = getCurrencyCountry(actualCurr!.code);

  return (
    <Article id={`${id}`}>
      <button
        className={`p-4 rounded-md bg-btn flex gap-2 items-center hover:scale-105 action-btn [anchor-name:--${popover}]`}
        type="button"
        popoverTarget={popover}
      >
        <Flag country={country} alt={`${actualCurr.name} flag`} />{" "}
        <SROnly>Change {isSend ? "send" : "receive"} currency(</SROnly>
        {actualCurr.code}
        <SROnly>)</SROnly> <BiIcon name="caret-down-fill" />
      </button>
      <form
        popover=""
        id={popover}
        aria-live="polite"
        onToggle={(e) => {
          if (e.newState === "open") openMenu();
          else {
            (isSend ? setFrom : setTo)(choice);
            closeMenu();
          }
        }}
        className={`bg-btn inset-auto [position-anchor:--${popover}] [position-area:bottom_span-left] [position-try:flip-block] mt-4 p-4 rounded-lg text-foreground`}
      >
        <label className="relative w-full">
          <SROnly>Enter the currency you like</SROnly>{" "}
          <BiIcon name="search absolute left-2 top-[.005em]" />
          <input
            type="text"
            id={searchId}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for currencies..."
            className="pl-8 outline outline-foreground-secondary rounded-sm p-2 w-full"
          />
        </label>
        <fieldset>
          <legend className="w-full flex justify-between border-b border-foreground-secondary py-4 text-foreground-secondary">
            Currencies <span> {filteredCurrencies.length}</span>
          </legend>
          <div className="mt-4 max-h-[40vh] min-h-[30vh] w-64 p-1 overflow-y-auto scrollbar-none">
            {!isOpen ? (
              <LoadingPlaceholder className="h-[30vh] bg-card" />
            ) : (
              <>
                {filteredCurrencies.map(({ name, code }) => (
                  <label
                    key={code}
                    className="relative rounded-lg flex gap-2 text-sm text-foreground-secondary items-center p-2 w-full hover:outline hover:outline-foreground-secondary has-focus-visible:outline has-focus-visible:outline-lime-500 action-btn"
                  >
                    <input
                      type="radio"
                      name="convert-currency"
                      className="absolute scale-0 opacity-0"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setChoice(code);
                        }
                      }}
                      onKeyDown={(e) => {
                        if ([" ", "Enter"].includes(e.key))
                          document.getElementById(popover)?.hidePopover();
                      }}
                      onClick={(e) => {
                        if (e.detail !== 0)
                          document.getElementById(popover)?.hidePopover();
                      }}
                    />
                    <Flag alt="" country={getCurrencyCountry(code)} />{" "}
                    <SRHidden className="text-lg text-foreground">
                      {code}
                    </SRHidden>{" "}
                    <span className="truncate max-w-48">{name}</span>
                    {(code === actualCurr.code || code === choice) && (
                      <BiIcon name="check text-lg ml-auto" />
                    )}
                  </label>
                ))}
                {filteredCurrencies.length === 0 && (
                  <label className="flex h-full items-center justify-center text-sm">
                    No results found
                  </label>
                )}
              </>
            )}
          </div>
        </fieldset>
      </form>
    </Article>
  );
};
