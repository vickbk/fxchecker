import { beforeEach, describe, expect, it, vi } from "vitest";

// 1. Define reactive state using vi.hoisted
const navigationState = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  pathname: "/converter",
  searchParams: new URLSearchParams(),
}));

const mockReplace = navigationState.mockReplace;
// 2. Mock next/navigation module at the top level
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => navigationState.pathname,
  useSearchParams: () => navigationState.searchParams,
}));

import { act, renderHook } from "@testing-library/react";
import * as nextNavigation from "next/navigation";
import { useURLState } from "./useURLState";

describe("useURLState", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Initial State Reading & Normalization", () => {
    it("returns default values when search parameters are empty", () => {
      const { result } = renderHook(() => useURLState());

      expect(result.current.from).toBe("USD");
      expect(result.current.to).toBe("EUR");
      expect(result.current.amount).toBe(100);
    });

    it("parses valid URL search parameters correctly", () => {
      vi.spyOn(nextNavigation, "useSearchParams").mockReturnValue(
        new URLSearchParams({
          from: "GBP",
          to: "JPY",
          amount: "250",
        }) as nextNavigation.ReadonlyURLSearchParams,
      );
      const { result } = renderHook(() => useURLState());

      expect(result.current.from).toBe("GBP");
      expect(result.current.to).toBe("JPY");
      expect(result.current.amount).toBe(250);
    });

    it("normalizes case and whitespace in currency parameters", () => {
      vi.spyOn(nextNavigation, "useSearchParams").mockReturnValue(
        new URLSearchParams({
          from: "cad",
          to: "   chf   ",
          ref: "affiliate",
        }) as nextNavigation.ReadonlyURLSearchParams,
      );
      const { result } = renderHook(() => useURLState());

      expect(result.current.from).toBe("CAD");
      expect(result.current.to).toBe("CHF");
    });

    it("falls back to default amount (100) when amount parameter is invalid or negative", () => {
      const { result: invalidResult } = renderHook(() => useURLState());
      expect(invalidResult.current.amount).toBe(100);

      const { result: NaNResult } = renderHook(() => useURLState());
      expect(NaNResult.current.amount).toBe(100);
    });
  });

  describe("setFrom Handler", () => {
    it("updates 'from' query parameter and calls router.replace with scroll disabled", () => {
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.setFrom("CAD");
      });

      expect(mockReplace).toHaveBeenCalledWith("/converter?from=CAD", {
        scroll: false,
      });
    });

    it("preserves existing 'to', 'amount', and unmanaged query parameters when setting 'from'", () => {
      vi.spyOn(nextNavigation, "useSearchParams").mockReturnValue(
        new URLSearchParams({
          to: "JPY",
          amount: "500",
          theme: "dark",
        }) as nextNavigation.ReadonlyURLSearchParams,
      );
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.setFrom("GBP");
      });

      expect(mockReplace).toHaveBeenCalledWith(
        "/converter?to=JPY&amount=500&theme=dark&from=GBP",
        { scroll: false },
      );
    });
  });

  describe("setTo Handler", () => {
    it("updates 'to' query parameter and calls router.replace with scroll disabled", () => {
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.setTo("JPY");
      });

      expect(mockReplace).toHaveBeenCalledWith("/converter?to=JPY", {
        scroll: false,
      });
    });

    it("preserves existing 'from' and 'amount' parameters when setting 'to'", () => {
      vi.spyOn(nextNavigation, "useSearchParams").mockReturnValue(
        new URLSearchParams({
          from: "EUR",
          amount: "300",
        }) as nextNavigation.ReadonlyURLSearchParams,
      );
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.setTo("AUD");
      });

      expect(mockReplace).toHaveBeenCalledWith(
        "/converter?from=EUR&amount=300&to=AUD",
        { scroll: false },
      );
    });
  });

  describe("setAmount Handler", () => {
    it("updates 'amount' query parameter and calls router.replace", () => {
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.setAmount(500);
      });

      expect(mockReplace).toHaveBeenCalledWith("/converter?amount=500", {
        scroll: false,
      });
    });

    it("normalizes and updates valid amount input", () => {
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.setAmount(1250);
      });

      expect(mockReplace).toHaveBeenCalledWith("/converter?amount=1250", {
        scroll: false,
      });
    });
  });

  describe("swapCurrencies Handler", () => {
    it("swaps 'from' and 'to' values using current state", () => {
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.swapCurrencies();
      });

      expect(mockReplace).toHaveBeenCalledWith("/converter?from=EUR&to=USD", {
        scroll: false,
      });
    });

    it("swaps default currency values when URL parameters are not set", () => {
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.swapCurrencies();
      });

      // Swapping default from: USD, to: EUR -> new from: EUR, new to: USD
      expect(mockReplace).toHaveBeenCalledWith("/converter?from=EUR&to=USD", {
        scroll: false,
      });
    });

    it("preserves unmanaged URL query parameters during currency swap", () => {
      vi.spyOn(nextNavigation, "useSearchParams").mockReturnValue(
        new URLSearchParams({
          from: "GBP",
          to: "JPY",
          ref: "affiliate",
        }) as nextNavigation.ReadonlyURLSearchParams,
      );
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.swapCurrencies();
      });

      expect(mockReplace).toHaveBeenCalledWith(
        "/converter?from=JPY&to=GBP&ref=affiliate",
        { scroll: false },
      );
    });
  });

  describe("Pathname Integration", () => {
    it("constructs navigation URL dynamically based on active pathname", async () => {
      vi.spyOn(nextNavigation, "usePathname").mockReturnValue(
        "/exchange/rates",
      );
      const { result } = renderHook(() => useURLState());

      act(() => {
        result.current.setFrom("CAD");
      });

      expect(mockReplace).toHaveBeenCalledWith("/exchange/rates?from=CAD", {
        scroll: false,
      });
    });
  });
});
