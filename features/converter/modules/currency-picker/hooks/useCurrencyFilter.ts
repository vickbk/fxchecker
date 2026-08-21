import { useCallback, useReducer } from "react";
import type {
  UseCurrencyFilterOptions,
  UseCurrencyFilterReturn,
} from "../types";
import { filteredCurrencies, highlightedCurrencyIndex } from "../utils";
import {
  currencyFilterReducer,
  initialFilterState,
} from "./currencyFilterReducer";

export function useCurrencyFilter(
  options: UseCurrencyFilterOptions,
): UseCurrencyFilterReturn {
  const { currencies, onSelect } = options;
  const [state, dispatch] = useReducer(
    currencyFilterReducer,
    initialFilterState,
  );

  const filtered = filteredCurrencies(currencies, state.query);

  const closeAndReset = useCallback(() => dispatch({ type: "RESET" }), []);

  const selectHighlighted = useCallback(() => {
    const index = state.highlightedIndex;
    if (onSelect && index >= 0 && index < filtered.length) {
      onSelect(filtered[index]);
    }
    closeAndReset();
  }, [state.highlightedIndex, closeAndReset, filtered, onSelect]);

  const handleKeyDown = useCallback(
    (event: { key: string; preventDefault?: () => void }) => {
      if (!["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key))
        return;

      event.preventDefault?.();

      if (event.key === "Escape") {
        closeAndReset();
        return;
      }

      if (event.key === "Enter") {
        selectHighlighted();
        return;
      }

      dispatch({
        type: "KEY_NAVIGATE",
        key: event.key as "ArrowDown",
        totalLength: filtered.length,
      });
    },
    [dispatch, closeAndReset, selectHighlighted, filtered.length],
  );

  return {
    isOpen: state.isOpen,
    query: state.query,
    highlightedIndex: state.highlightedIndex,
    filteredCurrencies: filtered,
    setQuery: (value: string) =>
      dispatch({ type: "SET_QUERY", payload: value }),
    openMenu: () => dispatch({ type: "OPEN" }),
    closeMenu: closeAndReset,
    handleKeyDown,
    handleMouseEnter: (index: number) =>
      dispatch({
        type: "SET_HIGHLIGHT",
        payload: highlightedCurrencyIndex(filtered, index),
      }),
    handleBlur: closeAndReset,
    selectHighlighted,
  };
}
