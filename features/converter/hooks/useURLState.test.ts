import { act, renderHook } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useURLState } from "./useURLState";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe("useURLState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue("/converter");
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
    } as never);
  });

  it("falls back to the default currency values when search params are empty", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as never);

    const { result } = renderHook(() => useURLState());

    expect(result.current.from).toBe("USD");
    expect(result.current.to).toBe("EUR");
    expect(result.current.amount).toBe(100);
  });

  it("serializes state updates into the URL query string", () => {
    const push = vi.fn();
    const replace = vi.fn();

    vi.mocked(useRouter).mockReturnValue({ push, replace } as never);
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockImplementation((key: string) => {
        switch (key) {
          case "from":
            return "GBP";
          case "to":
            return "JPY";
          case "amount":
            return "100";
          default:
            return null;
        }
      }),
      toString: vi.fn().mockReturnValue("from=GBP&to=JPY&amount=100"),
    } as never);

    const { result } = renderHook(() => useURLState());

    act(() => {
      result.current.setAmount(500);
    });

    const navigationCall =
      push.mock.calls[0]?.[0] ?? replace.mock.calls[0]?.[0];

    expect(navigationCall).toBe("?from=GBP&to=JPY&amount=500");
  });

  it("hydrates partial URL params with system defaults", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockImplementation((key: string) => {
        if (key === "from") {
          return "GBP";
        }

        return null;
      }),
    } as never);

    const { result } = renderHook(() => useURLState());

    expect(result.current.from).toBe("GBP");
    expect(result.current.to).toBe("EUR");
    expect(result.current.amount).toBe(100);
  });

  it("sanitizes malformed values and normalizes currency codes", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockImplementation((key: string) => {
        switch (key) {
          case "amount":
            return "not-a-number";
          case "from":
            return "usd";
          case "to":
            return "eur";
          default:
            return null;
        }
      }),
    } as never);

    const { result } = renderHook(() => useURLState());

    expect(result.current.amount).toBe(100);
    expect(result.current.from).toBe("USD");
    expect(result.current.to).toBe("EUR");
  });

  it("reacts when browser navigation updates the search params", () => {
    const searchParamsState = new Map<string, string | null>([
      ["from", "USD"],
      ["to", "EUR"],
      ["amount", "100"],
    ]);

    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockImplementation((key: string) => {
        return searchParamsState.get(key) ?? null;
      }),
    } as never);

    const { rerender } = renderHook(() => useURLState());

    searchParamsState.set("from", "GBP");
    searchParamsState.set("to", "JPY");
    searchParamsState.set("amount", "500");

    rerender();
  });
});
