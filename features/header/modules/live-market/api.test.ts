import type { Currency } from "@/infra/api/frankfurter";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLatestRates } from "./api";
import { getCurrencyPairs } from "./utils";

const { mockExecute } = vi.hoisted(() => ({
  mockExecute: vi.fn(),
}));

vi.mock("@/shared/cache", () => ({
  SWREngine: class {
    execute = mockExecute;

    constructor() {
      // no-op for test isolation
    }
  },
}));

vi.mock("@/shared/utils", () => ({
  parseTimeToMs: vi.fn(() => 86_400_000),
}));

vi.mock("@/infra/api/frankfurter", () => ({
  getRate: vi.fn(),
}));

vi.mock("./utils", () => ({
  getCurrencyPairs: vi.fn(),
}));

const { getRate } = await import("@/infra/api/frankfurter");
const mockedGetRate = vi.mocked(getRate);
const mockedGetCurrencyPairs = vi.mocked(getCurrencyPairs);

function createCurrency(code: string): Currency {
  return { code, name: code, symbol: code } as Currency;
}

describe("getLatestRates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockReset();
    mockedGetCurrencyPairs.mockReset();
    mockedGetRate.mockReset();
  });

  it("returns the full set of formatted rates when every request resolves", async () => {
    const pairs: [Currency, Currency][] = [
      [createCurrency("USD"), createCurrency("EUR")],
      [createCurrency("GBP"), createCurrency("JPY")],
    ];
    const rates = [
      {
        date: "2024-01-01",
        base: "USD",
        quote: "EUR",
        rate: 0.92,
        change: 0.01,
      },
      {
        date: "2024-01-01",
        base: "GBP",
        quote: "JPY",
        rate: 188.1,
        change: 0.3,
      },
    ];

    mockExecute.mockResolvedValue(pairs);
    mockedGetCurrencyPairs.mockResolvedValue(pairs);
    mockedGetRate
      .mockResolvedValueOnce(rates[0] as never)
      .mockResolvedValueOnce(rates[1] as never);

    await expect(getLatestRates()).resolves.toEqual(rates);
    expect(mockExecute).toHaveBeenCalledWith(
      "header-pairs-selection",
      expect.any(Function),
    );
    expect(mockedGetRate).toHaveBeenCalledTimes(2);
  });

  it("does not fail when one rate request rejects and returns the successful rates", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const pairs = Array.from(
      { length: 10 },
      (_, index) =>
        [createCurrency(`C${index}`), createCurrency(`D${index}`)] as [
          Currency,
          Currency,
        ],
    );

    mockExecute.mockResolvedValue(pairs);
    mockedGetCurrencyPairs.mockResolvedValue(pairs);

    mockedGetRate.mockImplementation(async (_base, _quote) => {
      if (_base === "C0") {
        throw new Error("network error");
      }

      return {
        date: "2024-01-01",
        base: _base,
        quote: _quote,
        rate: 1,
        change: 0,
      };
    });

    await expect(getLatestRates()).resolves.toHaveLength(9);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockedGetRate).toHaveBeenCalledTimes(10);
  });

  it("returns an empty array when pair generation throws", async () => {
    mockExecute.mockRejectedValue(new Error("cache failed"));
    mockedGetCurrencyPairs.mockRejectedValue(new Error("cache failed"));

    await expect(getLatestRates()).resolves.toEqual([]);
    expect(mockedGetRate).not.toHaveBeenCalled();
  });

  it("returns an empty array immediately when no pairs are available", async () => {
    mockExecute.mockResolvedValue([]);
    mockedGetCurrencyPairs.mockResolvedValue([]);

    await expect(getLatestRates()).resolves.toEqual([]);
    expect(mockedGetRate).not.toHaveBeenCalled();
  });
});
