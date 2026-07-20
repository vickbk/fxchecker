import { type Currency, fetchCurrencies } from "@/infra/api/frankfurter";
import { getRandomElements } from "@/shared/random";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrencyPairs } from "./utils";

vi.mock("@/infra/api/frankfurter", () => ({
  fetchCurrencies: vi.fn(),
}));

vi.mock("@/shared/random", () => ({
  getRandomElements: vi.fn(),
}));

const mockedFetchCurrencies = vi.mocked(fetchCurrencies);
const mockedGetRandomElements = vi.mocked(getRandomElements);

function createCurrency(code: string): Currency {
  return { code, name: code, symbol: code } as Currency;
}

describe("getCurrencyPairs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchCurrencies.mockReset();
    mockedGetRandomElements.mockReset();
    mockedGetRandomElements.mockImplementation((items) => items);
  });

  it("produces valid currency pairs when enough currencies are returned", async () => {
    const currencies = Array.from({ length: 20 }, (_, index) =>
      createCurrency(`C${index}`),
    );

    mockedFetchCurrencies.mockResolvedValue(currencies);
    mockedGetRandomElements.mockReturnValue(currencies);

    const pairs = await getCurrencyPairs();

    expect(pairs).toHaveLength(10);
    expect(pairs.every(([base, quote]) => base.code !== quote.code)).toBe(true);
    expect(pairs[0]).toEqual([currencies[0], currencies[19]]);
  });

  it("avoids self-pairing when the selected list has an odd length", async () => {
    const currencies = Array.from({ length: 15 }, (_, index) =>
      createCurrency(`C${index}`),
    );

    mockedFetchCurrencies.mockResolvedValue(currencies);
    mockedGetRandomElements.mockReturnValue(currencies);

    const pairs = await getCurrencyPairs();

    expect(pairs).toHaveLength(7);
    expect(pairs.every(([base, quote]) => base.code !== quote.code)).toBe(true);
  });

  it("throws when fetchCurrencies returns an empty array", async () => {
    mockedFetchCurrencies.mockResolvedValue([] as Currency[]);

    await expect(getCurrencyPairs()).rejects.toThrow(
      "Unable to fetch sufficient currencies to generate pairs.",
    );
  });

  it("throws when fetchCurrencies returns a single currency", async () => {
    mockedFetchCurrencies.mockResolvedValue([{ code: "USD" }] as Currency[]);

    await expect(getCurrencyPairs()).rejects.toThrow(
      "Unable to fetch sufficient currencies to generate pairs.",
    );
  });

  it("allows upstream errors from fetchCurrencies to bubble up", async () => {
    mockedFetchCurrencies.mockRejectedValue(new Error("network down"));

    await expect(getCurrencyPairs()).rejects.toThrow("network down");
  });
});
