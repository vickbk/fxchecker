import { renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CurrencyContextType } from "../types";
import { CurrencyContext, useCurrencies } from "./CurrencyProvider";

describe("useCurrencies", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Suppress React boundary console noise during error boundary tests
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe("Context Guard & Error Handling", () => {
    it("throws an error when consumed outside of a CurrencyProvider", () => {
      expect(() => renderHook(() => useCurrencies())).toThrow(
        "useCurrencies must be used within a CurrencyProvider",
      );
    });
  });

  describe("Context Value Retrieval", () => {
    it("returns context data correctly when rendered within CurrencyContext.Provider", () => {
      const mockContextValue: CurrencyContextType = {
        currencies: [
          { code: "USD", name: "United States Dollar", symbol: "$" },
          { code: "EUR", name: "Euro", symbol: "€" },
        ],
        favorites: ["USD"],
        isLoading: false,
        error: null,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CurrencyContext.Provider value={mockContextValue}>
          {children}
        </CurrencyContext.Provider>
      );

      const { result } = renderHook(() => useCurrencies(), { wrapper });

      expect(result.current).toEqual(mockContextValue);
      expect(result.current.currencies).toHaveLength(2);
      expect(result.current.favorites).toEqual(["USD"]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("exposes loading state accurately when context is loading", () => {
      const mockLoadingContext: CurrencyContextType = {
        currencies: [],
        favorites: [],
        isLoading: true,
        error: null,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CurrencyContext.Provider value={mockLoadingContext}>
          {children}
        </CurrencyContext.Provider>
      );

      const { result } = renderHook(() => useCurrencies(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.currencies).toEqual([]);
    });

    it("exposes error object accurately when context contains an error", () => {
      const customError = new Error("Failed to fetch currencies from API");
      const mockErrorContext: CurrencyContextType = {
        currencies: [],
        favorites: [],
        isLoading: false,
        error: customError,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CurrencyContext.Provider value={mockErrorContext}>
          {children}
        </CurrencyContext.Provider>
      );

      const { result } = renderHook(() => useCurrencies(), { wrapper });

      expect(result.current.error).toBe(customError);
      expect(result.current.error?.message).toBe(
        "Failed to fetch currencies from API",
      );
    });
  });

  describe("Dynamic Context Updates", () => {
    it("reflects updated context values when the provider state updates", () => {
      let contextValue: CurrencyContextType = {
        currencies: [],
        favorites: [],
        isLoading: true,
        error: null,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CurrencyContext.Provider value={contextValue}>
          {children}
        </CurrencyContext.Provider>
      );

      const { result, rerender } = renderHook(() => useCurrencies(), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(true);

      // Simulate provider data load completion
      contextValue = {
        currencies: [
          { code: "USD", name: "United States Dollar", symbol: "$" },
        ],
        favorites: ["USD"],
        isLoading: false,
        error: null,
      };

      rerender();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.currencies).toHaveLength(1);
      expect(result.current.favorites).toContain("USD");
    });
  });
});
