import { useState } from "react";
import type {
  UseCurrencyFilterOptions,
  UseCurrencyFilterReturn,
} from "../types";
import {
  filteredCurrencies,
  highlightedCurrencyIndex,
} from "../utils/currencies";

const INITIAL_HIGHLIGHT = -1;

export function useCurrencyFilter(
  options: UseCurrencyFilterOptions,
): UseCurrencyFilterReturn {
  const { currencies, onSelect } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(INITIAL_HIGHLIGHT);

  const filtered = filteredCurrencies(currencies, query);

  const handleKeyDown = (event: {
    key: string;
    preventDefault?: () => void;
  }) => {
    if (!["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key))
      return;
    event.preventDefault?.();
    if (event.key === "ArrowDown") {
      if (!isOpen) {
        setIsOpen(true);

        if (filtered.length > 0) {
          setHighlightedIndex(0);
        }

        return;
      }

      if (filtered.length === 0) {
        return;
      }

      setHighlightedIndex((current) => {
        if (current < 0) {
          return 0;
        }

        return Math.min(current + 1, filtered.length - 1);
      });
      return;
    }

    if (event.key === "ArrowUp") {
      if (filtered.length === 0) {
        return;
      }

      setHighlightedIndex((current) => {
        if (current <= 0) {
          return 0;
        }

        return Math.max(current - 1, 0);
      });
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      setHighlightedIndex(INITIAL_HIGHLIGHT);
      return;
    }

    if (event.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        const selectedCurrency = filtered[highlightedIndex];

        if (selectedCurrency) {
          onSelect?.(selectedCurrency);
        }
      }

      setIsOpen(false);
      setQuery("");
      setHighlightedIndex(INITIAL_HIGHLIGHT);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHighlightedIndex(highlightedCurrencyIndex(filtered, index));
  };

  const handleBlur = () => {
    setIsOpen(false);
    setQuery("");
    setHighlightedIndex(INITIAL_HIGHLIGHT);
  };

  const selectHighlighted = () => {
    if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
      const selectedCurrency = filtered[highlightedIndex];

      if (selectedCurrency) {
        onSelect?.(selectedCurrency);
      }
    }

    setIsOpen(false);
    setQuery("");
    setHighlightedIndex(INITIAL_HIGHLIGHT);
  };

  return {
    isOpen,
    query,
    highlightedIndex,
    filteredCurrencies: filtered,
    setQuery: (value: string) => {
      setHighlightedIndex(value !== "" ? 0 : -1);
      setQuery(value);
    },
    openMenu: () => setIsOpen(true),
    closeMenu: () => {
      setIsOpen(false);
      setQuery("");
      setHighlightedIndex(INITIAL_HIGHLIGHT);
    },
    handleKeyDown,
    handleMouseEnter,
    handleBlur,
    selectHighlighted,
  };
}
