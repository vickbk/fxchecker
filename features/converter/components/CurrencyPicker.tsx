import { useId } from "react";
import { useCurrencyFilter } from "../hooks/useCurrencyFilter";
import type { CurrencyPickerProps } from "../types";

export function CurrencyPicker({ currencies, onSelect }: CurrencyPickerProps) {
  const listboxId = useId();
  const inputId = useId();
  const {
    filteredCurrencies,
    handleBlur,
    handleKeyDown,
    handleMouseEnter,
    highlightedIndex,
    isOpen,
    openMenu,
    query,
    selectHighlighted,
    setQuery,
  } = useCurrencyFilter({ currencies, onSelect });

  return (
    <div className="w-full max-w-sm rounded-md border border-slate-300 p-3">
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `${inputId}-${highlightedIndex}`
            : undefined
        }
        tabIndex={0}
        onBlur={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            handleBlur();
          }
        }}
        onClick={() => {
          if (!isOpen) {
            openMenu();
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <label htmlFor={inputId} className="sr-only">
          Search currencies
        </label>
        <input
          id={inputId}
          type="text"
          placeholder="Search currencies"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (!isOpen) {
              openMenu();
            }
          }}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      {isOpen ? (
        <>
          <style>{`.currency-picker-options { min-height: 12rem; height: 12rem; }`}</style>
          <div
            id={listboxId}
            role="listbox"
            aria-label="Currencies"
            data-testid="currency-picker-options"
            className="currency-picker-options min-h-48"
          >
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency, index) => (
                <button
                  key={currency.code}
                  id={`${inputId}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => {
                    handleMouseEnter(index);
                    selectHighlighted();
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left ${
                    index === highlightedIndex ? "bg-slate-100" : ""
                  }`}
                >
                  <span>{currency.code}</span>
                  <span className="text-sm text-slate-500">
                    {currency.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No results found
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
