import { useURLState } from "@/shared/url/hooks";
import { renderHook } from "@testing-library/react";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadRate } from "../actions";
import { useAutoDispatch } from "./useAutoDispatch";
import { useRate } from "./useRate";

vi.mock("@/shared/url/hooks", () => ({
  useURLState: vi.fn(),
}));

vi.mock("../actions", () => ({
  loadRate: vi.fn(),
}));

vi.mock("./useAutoDispatch", () => ({
  useAutoDispatch: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

describe("useRate Hook", () => {
  const mockGetRate = vi.fn();
  const defaultURLState = {
    from: "USD",
    to: "EUR",
    amount: 100,
    setFrom: vi.fn(),
    setTo: vi.fn(),
    setAmount: vi.fn(),
    swapCurrencies: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useURLState).mockReturnValue(defaultURLState);
    vi.mocked(React.useActionState).mockReturnValue([null, mockGetRate, false]);
  });

  describe("Initial State & Action Setup", () => {
    it("returns rate as 0 when action state results is null", () => {
      const { result } = renderHook(() => useRate());

      expect(result.current).toEqual({
        from: "USD",
        to: "EUR",
        rate: 0,
        amount: 100,
        loading: false,
      });
    });

    it("initializes useActionState with loadRate server action and initial state null", () => {
      renderHook(() => useRate());

      expect(React.useActionState).toHaveBeenCalledWith(loadRate, null);
    });

    it("delegates auto-dispatch execution to useAutoDispatch with action dispatch, payload, and deps", () => {
      renderHook(() => useRate());

      expect(useAutoDispatch).toHaveBeenCalledWith(
        mockGetRate,
        { from: "USD", to: "EUR" },
        ["USD", "EUR"],
      );
    });
  });

  describe("Rate Calculation & Action Results", () => {
    it("extracts and returns calculated rate from successful action results", () => {
      vi.mocked(React.useActionState).mockReturnValue([
        { rate: 0.92 },
        mockGetRate,
        false,
      ]);

      const { result } = renderHook(() => useRate());

      expect(result.current.rate).toBe(0.92);
    });

    it("defaults rate to 0 when results object lacks rate property or rate is nullish", () => {
      vi.mocked(React.useActionState).mockReturnValue([
        { rate: null } as unknown as { rate: number },
        mockGetRate,
        false,
      ]);

      const { result } = renderHook(() => useRate());

      expect(result.current.rate).toBe(0);
    });

    it("preserves zero (0) rate value without defaulting to fallback", () => {
      vi.mocked(React.useActionState).mockReturnValue([
        { rate: 0 },
        mockGetRate,
        false,
      ]);

      const { result } = renderHook(() => useRate());

      expect(result.current.rate).toBe(0);
    });
  });

  describe("Loading State Synchronization", () => {
    it("reflects true loading state when useActionState is pending", () => {
      vi.mocked(React.useActionState).mockReturnValue([
        null,
        mockGetRate,
        true,
      ]);

      const { result } = renderHook(() => useRate());

      expect(result.current.loading).toBe(true);
    });
  });

  describe("URL State Dynamics & Reactive Updates", () => {
    it("updates hook return value and re-triggers auto dispatch when URL params change", () => {
      const { result, rerender } = renderHook(() => useRate());

      expect(result.current.from).toBe("USD");
      expect(result.current.to).toBe("EUR");

      vi.mocked(useURLState).mockReturnValue({
        ...defaultURLState,
        from: "GBP",
        to: "JPY",
        amount: 50,
      });

      rerender();

      expect(result.current).toEqual({
        from: "GBP",
        to: "JPY",
        rate: 0,
        amount: 50,
        loading: false,
      });

      expect(useAutoDispatch).toHaveBeenLastCalledWith(
        mockGetRate,
        { from: "GBP", to: "JPY" },
        ["GBP", "JPY"],
      );
    });
  });

  describe("Memoization & Reference Stability", () => {
    it("maintains strict object reference identity across renders when state is unchanged", () => {
      const { result, rerender } = renderHook(() => useRate());

      const initialRef = result.current;
      rerender();

      expect(result.current).toBe(initialRef);
    });

    it("produces a new object reference when rate updates", () => {
      const { result, rerender } = renderHook(() => useRate());

      const initialRef = result.current;

      vi.mocked(React.useActionState).mockReturnValue([
        { rate: 1.25 },
        mockGetRate,
        false,
      ]);

      rerender();

      expect(result.current).not.toBe(initialRef);
      expect(result.current.rate).toBe(1.25);
    });
  });
});
