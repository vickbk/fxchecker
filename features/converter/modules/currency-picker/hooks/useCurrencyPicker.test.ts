import { groupCurrencies, useCurrencies } from "@/shared/currencies";
import { useURLState } from "@/shared/url/hooks";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrencyFilter } from "./useCurrencyFilter";
import { useCurrencyPicker } from "./useCurrencyPicker";

vi.mock("@/shared/url/hooks", () => ({
  useURLState: vi.fn(),
}));

vi.mock("@/shared/currencies", () => ({
  useCurrencies: vi.fn(),
  groupCurrencies: vi.fn(),
}));

vi.mock("./useCurrencyFilter", () => ({
  useCurrencyFilter: vi.fn(),
}));

const mockCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

const mockFavorites = ["USD", "EUR"];

describe("useCurrencyPicker", () => {
  const mockSetFrom = vi.fn();
  const mockSetTo = vi.fn();
  const mockFilterOptions = {
    query: "",
    isOpen: false,
    highlightedIndex: -1,
    setQuery: vi.fn(),
    openMenu: vi.fn(),
    closeMenu: vi.fn(),
    handleKeyDown: vi.fn(),
    handleMouseEnter: vi.fn(),
    selectHighlighted: vi.fn(),
    handleBlur: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useURLState).mockReturnValue({
      from: "USD",
      to: "EUR",
      amount: 100,
      setFrom: mockSetFrom,
      setTo: mockSetTo,
      setAmount: vi.fn(),
      swapCurrencies: vi.fn(),
    });

    vi.mocked(useCurrencies).mockReturnValue({
      currencies: mockCurrencies,
      favorites: mockFavorites,
      isLoading: false,
      error: null,
    });

    vi.mocked(useCurrencyFilter).mockReturnValue({
      filteredCurrencies: mockCurrencies,
      ...mockFilterOptions,
    });

    vi.mocked(groupCurrencies).mockReturnValue({
      favorites: [mockCurrencies[0], mockCurrencies[1]],
      others: [mockCurrencies[2], mockCurrencies[3]],
    });
  });

  describe("Sending Mode (isSend: true)", () => {
    it("initializes choice with 'from' state and resolves matching actualCurr", () => {
      vi.mocked(useURLState).mockReturnValue({
        from: "GBP",
        to: "EUR",
        amount: 100,
        setFrom: mockSetFrom,
        setTo: mockSetTo,
        setAmount: vi.fn(),
        swapCurrencies: vi.fn(),
      });

      const { result } = renderHook(() => useCurrencyPicker({ isSend: true }));

      expect(result.current.choice).toBe("GBP");
      expect(result.current.actualCurr).toEqual(mockCurrencies[2]); // GBP
    });

    it("falls back actualCurr to USD when 'from' is not found in currencies list", () => {
      vi.mocked(useURLState).mockReturnValue({
        from: "UNKNOWN",
        to: "EUR",
        amount: 100,
        setFrom: mockSetFrom,
        setTo: mockSetTo,
        setAmount: vi.fn(),
        swapCurrencies: vi.fn(),
      });

      const { result } = renderHook(() => useCurrencyPicker({ isSend: true }));

      expect(result.current.actualCurr).toEqual(mockCurrencies[0]); // USD
    });

    it("delegates setCurrencyQuery to setFrom when isSend is true", () => {
      const { result } = renderHook(() => useCurrencyPicker({ isSend: true }));

      act(() => {
        result.current.setCurrencyQuery("JPY");
      });

      expect(mockSetFrom).toHaveBeenCalledWith("JPY");
      expect(mockSetTo).not.toHaveBeenCalled();
    });
  });

  describe("Receiving Mode (isSend: false)", () => {
    it("initializes choice with 'to' state and resolves matching actualCurr", () => {
      vi.mocked(useURLState).mockReturnValue({
        from: "USD",
        to: "JPY",
        amount: 100,
        setFrom: mockSetFrom,
        setTo: mockSetTo,
        setAmount: vi.fn(),
        swapCurrencies: vi.fn(),
      });

      const { result } = renderHook(() => useCurrencyPicker({ isSend: false }));

      expect(result.current.choice).toBe("JPY");
      expect(result.current.actualCurr).toEqual(mockCurrencies[3]); // JPY
    });

    it("falls back actualCurr to EUR when 'to' is not found in currencies list", () => {
      vi.mocked(useURLState).mockReturnValue({
        from: "USD",
        to: "INVALID",
        amount: 100,
        setFrom: mockSetFrom,
        setTo: mockSetTo,
        setAmount: vi.fn(),
        swapCurrencies: vi.fn(),
      });

      const { result } = renderHook(() => useCurrencyPicker({ isSend: false }));

      expect(result.current.actualCurr).toEqual(mockCurrencies[1]); // EUR
    });

    it("delegates setCurrencyQuery to setTo when isSend is false", () => {
      const { result } = renderHook(() => useCurrencyPicker({ isSend: false }));

      act(() => {
        result.current.setCurrencyQuery("CAD");
      });

      expect(mockSetTo).toHaveBeenCalledWith("CAD");
      expect(mockSetFrom).not.toHaveBeenCalled();
    });
  });

  describe("Filtering & Currency Grouping Integration", () => {
    it("passes currencies list to useCurrencyFilter and outputs filtered currencies", () => {
      const filteredResult = [mockCurrencies[0]]; // Only USD
      vi.mocked(useCurrencyFilter).mockReturnValue({
        filteredCurrencies: filteredResult,
        ...mockFilterOptions,
      });

      const { result } = renderHook(() => useCurrencyPicker({ isSend: true }));

      expect(useCurrencyFilter).toHaveBeenCalledWith({
        currencies: mockCurrencies,
      });
      expect(result.current.filteredCurrencies).toEqual(filteredResult);
    });

    it("passes filteredCurrencies and favorites to groupCurrencies and exposes partitioned results", () => {
      const { result } = renderHook(() => useCurrencyPicker({ isSend: true }));

      expect(groupCurrencies).toHaveBeenCalledWith(
        mockCurrencies,
        mockFavorites,
      );
      expect(result.current.filteredFavorites).toEqual([
        mockCurrencies[0],
        mockCurrencies[1],
      ]);
      expect(result.current.otherCurrencies).toEqual([
        mockCurrencies[2],
        mockCurrencies[3],
      ]);
    });
  });

  describe("Local State Management (choice / setChoice)", () => {
    it("allows local state choice updates via setChoice", () => {
      const { result } = renderHook(() => useCurrencyPicker({ isSend: true }));

      expect(result.current.choice).toBe("USD");

      act(() => {
        result.current.setChoice("CHF");
      });

      expect(result.current.choice).toBe("CHF");
    });
  });
});
