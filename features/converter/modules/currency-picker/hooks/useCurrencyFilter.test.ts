import { Currency } from "@/infra/api/frankfurter";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { UseCurrencyFilterOptions } from "../types";
import { useCurrencyFilter } from "./useCurrencyFilter";

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

describe("useCurrencyFilter", () => {
  describe("Initial State & Defaults", () => {
    it("initializes with menu closed, empty query, unset highlight, and full currency list", () => {
      const onSelect = vi.fn();
      const options: UseCurrencyFilterOptions = { currencies, onSelect };

      const { result } = renderHook(() => useCurrencyFilter(options));

      expect(result.current.isOpen).toBe(false);
      expect(result.current.query).toBe("");
      expect(result.current.highlightedIndex).toBe(-1);
      expect(result.current.filteredCurrencies).toEqual(currencies);
    });

    it("handles an empty currencies array gracefully without crashing", () => {
      const { result } = renderHook(() =>
        useCurrencyFilter({ currencies: [] }),
      );

      expect(result.current.filteredCurrencies).toEqual([]);
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it("operates safely when onSelect callback is omitted", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
        result.current.setQuery("usd");
        result.current.selectHighlighted();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.query).toBe("");
    });
  });

  describe("Query & Filtering Behavior", () => {
    it("filters currencies by code, name, or symbol case-insensitively with trimmed input", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      // Search by code with extra whitespace
      act(() => {
        result.current.setQuery("   chf   ");
      });
      expect(result.current.filteredCurrencies).toEqual([currencies[2]]);

      // Search by name
      act(() => {
        result.current.setQuery("japanese");
      });
      expect(result.current.filteredCurrencies).toEqual([currencies[3]]);

      // Search by symbol
      act(() => {
        result.current.setQuery("€");
      });
      expect(result.current.filteredCurrencies).toEqual([currencies[1]]);
    });

    it("automatically sets highlightedIndex to 0 on non-empty query input", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.setQuery("eur");
      });

      expect(result.current.highlightedIndex).toBe(0);
    });

    it("resets highlightedIndex to -1 when query is cleared to an empty string", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.setQuery("eur");
      });
      expect(result.current.highlightedIndex).toBe(0);

      act(() => {
        result.current.setQuery("");
      });
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it("returns empty array for non-matching query terms", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.setQuery("nonexistent");
      });

      expect(result.current.filteredCurrencies).toEqual([]);
    });
  });

  describe("Keyboard Event Navigation (handleKeyDown)", () => {
    it("ignores unhandled keys without triggering preventDefault or altering state", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.handleKeyDown({ key: "Tab" });
        result.current.handleKeyDown({ key: "a" });
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it("opens menu and sets highlight to 0 on ArrowDown when menu is closed and items exist", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.handleKeyDown({ key: "ArrowDown" });
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.highlightedIndex).toBe(0);
    });

    it("opens menu on ArrowDown but keeps highlight at -1 if filtered list is empty", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.setQuery("zzz"); // 0 matches
      });

      act(() => {
        result.current.handleKeyDown({ key: "ArrowDown" });
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it("increments and clamps highlightedIndex on successive ArrowDown presses", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
        result.current.handleKeyDown({ key: "ArrowDown" }); // 0
        result.current.handleKeyDown({ key: "ArrowDown" }); // 1
        result.current.handleKeyDown({ key: "ArrowDown" }); // 2
        result.current.handleKeyDown({ key: "ArrowDown" }); // 3 (max index for 4 items)
        result.current.handleKeyDown({ key: "ArrowDown" }); // Clamped to 3
      });

      expect(result.current.highlightedIndex).toBe(3);
    });

    it("decrements and clamps highlightedIndex to 0 on ArrowUp presses", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
        result.current.handleMouseEnter(2); // index 2
      });

      act(() => {
        result.current.handleKeyDown({ key: "ArrowUp" }); // 1
      });
      expect(result.current.highlightedIndex).toBe(1);

      act(() => {
        result.current.handleKeyDown({ key: "ArrowUp" }); // 0
        result.current.handleKeyDown({ key: "ArrowUp" }); // Clamped to 0
      });
      expect(result.current.highlightedIndex).toBe(0);
    });

    it("resets filter state completely on Escape key press", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
        result.current.setQuery("eur");
        result.current.handleKeyDown({ key: "Escape" });
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.query).toBe("");
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it("executes selection and closes menu when pressing Enter key", async () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useCurrencyFilter({ currencies, onSelect }),
      );

      act(() => {
        result.current.openMenu();
        result.current.setQuery("usd"); // highlights index 0
      });

      act(() => {
        result.current.handleKeyDown({ key: "Enter" });
      });

      expect(onSelect).toHaveBeenCalledWith(currencies[0]);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.query).toBe("");
    });
  });

  describe("Mouse Interaction (handleMouseEnter)", () => {
    it("updates highlightedIndex when hovering over a valid currency item", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
        result.current.handleMouseEnter(2);
      });

      expect(result.current.highlightedIndex).toBe(2);
    });

    it("resets highlightedIndex to -1 if hovered index is out of bounds", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
        result.current.handleMouseEnter(99); // Out of bounds
      });

      expect(result.current.highlightedIndex).toBe(-1);
    });
  });

  describe("Selection Logic (selectHighlighted)", () => {
    it("invokes onSelect with the highlighted currency and resets state", () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useCurrencyFilter({ currencies, onSelect }),
      );

      act(() => {
        result.current.openMenu();
        result.current.handleMouseEnter(1); // EUR
      });
      act(() => {
        result.current.selectHighlighted();
      });

      expect(onSelect).toHaveBeenCalledWith(currencies[1]);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.query).toBe("");
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it("does not call onSelect if highlightedIndex is -1 but still closes menu and resets state", () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useCurrencyFilter({ currencies, onSelect }),
      );

      act(() => {
        result.current.openMenu();
        result.current.selectHighlighted();
      });

      expect(onSelect).not.toHaveBeenCalled();
      expect(result.current.isOpen).toBe(false);
      expect(result.current.query).toBe("");
      expect(result.current.highlightedIndex).toBe(-1);
    });
  });

  describe("Lifecycle & Focus Handlers (openMenu, closeMenu, handleBlur)", () => {
    it("sets isOpen to true without altering query or highlight when calling openMenu", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.query).toBe("");
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it("resets state completely on closeMenu", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
        result.current.setQuery("yen");
        result.current.closeMenu();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.query).toBe("");
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it("resets state completely on handleBlur", () => {
      const { result } = renderHook(() => useCurrencyFilter({ currencies }));

      act(() => {
        result.current.openMenu();
        result.current.setQuery("yen");
        result.current.handleBlur();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.query).toBe("");
      expect(result.current.highlightedIndex).toBe(-1);
    });
  });

  describe("Dynamic Props Updates", () => {
    it("re-evaluates filteredCurrencies when currencies prop updates dynamically", () => {
      let currentCurrencies = [currencies[0], currencies[1]];
      const { result, rerender } = renderHook(
        ({ currs }) => useCurrencyFilter({ currencies: currs }),
        { initialProps: { currs: currentCurrencies } },
      );

      expect(result.current.filteredCurrencies).toHaveLength(2);

      currentCurrencies = currencies; // Expand to 4 items
      rerender({ currs: currentCurrencies });

      expect(result.current.filteredCurrencies).toHaveLength(4);
    });
  });
});
