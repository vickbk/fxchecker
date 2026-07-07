import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CurrencyOption, UseCurrencyFilterOptions } from "../types";
import { useCurrencyFilter } from "./useCurrencyFilter";

const currencies: CurrencyOption[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

describe("useCurrencyFilter", () => {
  it("initializes with a closed menu, empty query, unset highlight, and all currencies", () => {
    const onSelect = vi.fn();
    const options: UseCurrencyFilterOptions = { currencies, onSelect };

    const { result } = renderHook(() => useCurrencyFilter(options));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.query).toBe("");
    expect(result.current.highlightedIndex).toBe(-1);
    expect(result.current.filteredCurrencies).toEqual(currencies);
  });

  it("filters currencies by case-insensitive, trimmed query text", () => {
    const { result } = renderHook(() => useCurrencyFilter({ currencies }));

    act(() => {
      result.current.setQuery("  ch  ");
    });

    expect(result.current.filteredCurrencies).toEqual([currencies[2]]);

    act(() => {
      result.current.setQuery("eur");
    });

    expect(result.current.filteredCurrencies).toEqual([currencies[1]]);
  });

  it("returns no matches for an unmatched query", () => {
    const { result } = renderHook(() => useCurrencyFilter({ currencies }));

    act(() => {
      result.current.setQuery("zzz");
    });

    expect(result.current.filteredCurrencies).toEqual([]);
  });

  it("moves the highlighted index forward and backward without exceeding bounds", () => {
    const { result } = renderHook(() => useCurrencyFilter({ currencies }));

    act(() => {
      result.current.openMenu();
      result.current.setQuery("");
    });

    act(() => {
      result.current.handleKeyDown({ key: "ArrowDown" });
      result.current.handleKeyDown({ key: "ArrowDown" });
    });

    expect(result.current.highlightedIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({ key: "ArrowUp" });
    });

    expect(result.current.highlightedIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown({ key: "ArrowUp" });
    });

    expect(result.current.highlightedIndex).toBe(0);
  });

  it("closes the menu, clears the query, and resets highlight on Escape", () => {
    const { result } = renderHook(() => useCurrencyFilter({ currencies }));

    act(() => {
      result.current.openMenu();
      result.current.setQuery("usd");
      result.current.handleKeyDown({ key: "ArrowDown" });
    });

    act(() => {
      result.current.handleKeyDown({ key: "Escape" });
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.query).toBe("");
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it("selects the highlighted currency and closes the menu on Enter", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useCurrencyFilter({ currencies, onSelect }),
    );

    act(() => {
      result.current.openMenu();
      result.current.setQuery("");
      result.current.handleKeyDown({ key: "ArrowDown" });
    });

    act(() => {
      result.current.selectHighlighted();
    });

    expect(onSelect).toHaveBeenCalledWith(currencies[0]);
    expect(result.current.isOpen).toBe(false);
  });

  it("uses mouse hover as the starting point for subsequent keyboard navigation", () => {
    const { result } = renderHook(() => useCurrencyFilter({ currencies }));

    act(() => {
      result.current.openMenu();
      result.current.handleMouseEnter(2);
    });

    expect(result.current.highlightedIndex).toBe(2);

    act(() => {
      result.current.handleKeyDown({ key: "ArrowDown" });
    });

    expect(result.current.highlightedIndex).toBe(3);
  });

  it("closes the menu, clears the query, and resets highlight on blur", () => {
    const { result } = renderHook(() => useCurrencyFilter({ currencies }));

    act(() => {
      result.current.openMenu();
      result.current.setQuery("usd");
      result.current.handleKeyDown({ key: "ArrowDown" });
    });

    act(() => {
      result.current.handleBlur();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.query).toBe("");
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it("clips the highlighted index when filtering shrinks the result set", () => {
    const { result } = renderHook(() => useCurrencyFilter({ currencies }));

    act(() => {
      result.current.openMenu();
      result.current.handleMouseEnter(3);
    });

    act(() => {
      result.current.setQuery("ch");
    });

    expect(result.current.filteredCurrencies).toEqual([currencies[2]]);
    expect(result.current.highlightedIndex).toBe(0);
  });

  it("aligns the highlighted index with the active selection when the menu opens", () => {
    const { result } = renderHook(() =>
      useCurrencyFilter({ currencies, onSelect: vi.fn() }),
    );

    act(() => {
      result.current.openMenu();
    });

    expect(result.current.highlightedIndex).toBe(-1);
  });
});
