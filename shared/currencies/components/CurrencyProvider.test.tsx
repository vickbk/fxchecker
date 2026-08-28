import {
  rejectedPromise,
  resolvedPromise,
  shouldHaveTestId,
  shouldNotHaveTestId,
} from "@/tests";
import { render, renderHook } from "@testing-library/react";
import React, { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrencies } from "../hooks/CurrencyProvider";
import { CurrencyContextType } from "../types";
import { CurrencyProvider } from "./CurrencyProvider";

const mockCurrencies: CurrencyContextType["currencies"] = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
];

const mockFavorites = ["USD", "EUR"];

class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="error-boundary">{this.state.error?.message}</div>
      );
    }
    return this.props.children;
  }
}

describe("CurrencyProvider & useCurrencies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCurrencies Hook", () => {
    it("throws an explicit error when invoked outside of CurrencyProvider", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => renderHook(() => useCurrencies())).toThrow(
        "useCurrencies must be used within a CurrencyProvider",
      );

      consoleSpy.mockRestore();
    });

    it("returns context state synchronously when consumed inside CurrencyProvider", () => {
      const currenciesPromise = resolvedPromise(mockCurrencies);
      const favoritesPromise = resolvedPromise(mockFavorites);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CurrencyProvider
          currencies={currenciesPromise}
          favorites={favoritesPromise}
        >
          {children}
        </CurrencyProvider>
      );

      const { result } = renderHook(() => useCurrencies(), { wrapper });

      expect(result.current).toEqual({
        currencies: mockCurrencies,
        favorites: mockFavorites,
        isLoading: false,
        error: null,
      });
    });
  });

  describe("CurrencyProvider Component", () => {
    it("renders children without alteration", () => {
      const currenciesPromise = resolvedPromise(mockCurrencies);
      const favoritesPromise = resolvedPromise(mockFavorites);

      render(
        <CurrencyProvider
          currencies={currenciesPromise}
          favorites={favoritesPromise}
        >
          <div data-testid="child-node">App Content</div>
        </CurrencyProvider>,
      );

      const [content] = shouldHaveTestId("child-node");
      expect(content).toHaveTextContent("App Content");
    });

    it("provides correct context schema defaults (isLoading: false, error: null)", () => {
      const currenciesPromise = resolvedPromise(mockCurrencies);
      const favoritesPromise = resolvedPromise([]);

      const TestConsumer = () => {
        const { currencies, favorites, isLoading, error } = useCurrencies();
        return (
          <div>
            <span data-testid="currency-count">{currencies.length}</span>
            <span data-testid="fav-count">{favorites.length}</span>
            <span data-testid="is-loading">{String(isLoading)}</span>
            <span data-testid="error-state">{String(error)}</span>
          </div>
        );
      };

      render(
        <CurrencyProvider
          currencies={currenciesPromise}
          favorites={favoritesPromise}
        >
          <TestConsumer />
        </CurrencyProvider>,
      );

      const [currencyCount, favCount, loading, error] = shouldHaveTestId(
        "currency-count",
        "fav-count",
        "is-loading",
        "error-state",
      );

      expect(currencyCount).toHaveTextContent("2");
      expect(favCount).toHaveTextContent("0");
      expect(loading).toHaveTextContent("false");
      expect(error).toHaveTextContent("null");
    });

    it("updates consuming components when props receive fresh resolved promises", () => {
      const initialCurrencies = resolvedPromise([mockCurrencies[0]]);
      const initialFavorites = resolvedPromise(["USD"]);

      const updatedCurrencies = resolvedPromise(mockCurrencies);
      const updatedFavorites = resolvedPromise(["USD", "EUR"]);

      const TestConsumer = () => {
        const { currencies, favorites } = useCurrencies();
        return (
          <div>
            <span data-testid="codes">
              {currencies.map((c) => c.code).join(", ")}
            </span>
            <span data-testid="favs">{favorites.join(", ")}</span>
          </div>
        );
      };

      const { rerender } = render(
        <CurrencyProvider
          currencies={initialCurrencies}
          favorites={initialFavorites}
        >
          <TestConsumer />
        </CurrencyProvider>,
      );

      const tests = shouldHaveTestId("codes", "favs");
      tests.forEach((test) => expect(test).toHaveTextContent("USD"));

      rerender(
        <CurrencyProvider
          currencies={updatedCurrencies}
          favorites={updatedFavorites}
        >
          <TestConsumer />
        </CurrencyProvider>,
      );

      const tests2 = shouldHaveTestId("codes", "favs");
      tests2.forEach((test) => expect(test).toHaveTextContent("USD, EUR"));
    });

    it("triggers Suspense boundary when promises remain pending", async () => {
      const pendingCurrencies = new Promise<typeof mockCurrencies>(() => {});
      const resolvedFavorites = resolvedPromise(mockFavorites);

      const TestConsumer = () => {
        const { currencies } = useCurrencies();
        return <div data-testid="content">{currencies.length} loaded</div>;
      };

      render(
        <Suspense
          fallback={<div data-testid="fallback">Loading currencies...</div>}
        >
          <CurrencyProvider
            currencies={pendingCurrencies}
            favorites={resolvedFavorites}
          >
            <TestConsumer />
          </CurrencyProvider>
        </Suspense>,
      );

      shouldHaveTestId("fallback");
      shouldNotHaveTestId("content");
    });

    it("bubbles promise rejection to nearest Error Boundary when use() rejects", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const rejectedCurrencies = rejectedPromise(
        new Error("API Network Failure"),
      );
      const resolvedFavorites = resolvedPromise(mockFavorites);

      render(
        <TestErrorBoundary>
          <CurrencyProvider
            currencies={rejectedCurrencies}
            favorites={resolvedFavorites}
          >
            <div>Render Attempt</div>
          </CurrencyProvider>
        </TestErrorBoundary>,
      );

      const [error] = shouldHaveTestId("error-boundary");
      expect(error).toHaveTextContent("API Network Failure");

      consoleSpy.mockRestore();
    });
  });
});
