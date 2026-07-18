import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchCurrencies,
  fetchCurrencyDetails,
  fetchHistoricalRates,
  fetchLatestRates,
  frankfurterCache,
  getRate,
} from "./service";
import {
  FrankfurterError,
  FrankfurterOfflineError,
  FrankfurterRateLimitError,
  FrankfurterValidationError,
} from "./utils/errors";

const fetchMock = vi.fn();
const executeMock = vi.fn();

vi.mock("@/shared/config", () => ({
  config: {
    FRANKFURTER_URL: "https://frankfurtur.mock",
  },
}));

describe("infra/api/frankfurter/service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    frankfurterCache.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("evaluates success path for /latest endpoint", async () => {
    const mockPayload = {
      amount: 1,
      base: "EUR",
      date: "2026-07-06",
      rates: { USD: 1.09, GBP: 0.85 },
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    } as Response);

    const result = await fetchLatestRates();
    expect(result).toEqual(mockPayload);
  });

  it("handles rate limit boundary (HTTP 429)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    } as Response);

    let thrownError: unknown;
    try {
      await fetchLatestRates();
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeInstanceOf(FrankfurterRateLimitError);
    expect(thrownError).toBeInstanceOf(FrankfurterError);
  });

  it("handles payload validation failure (HTTP 422)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: "Unprocessable Content",
    } as Response);

    let thrownError: unknown;
    try {
      await fetchLatestRates();
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeInstanceOf(FrankfurterValidationError);
    expect(thrownError).toBeInstanceOf(FrankfurterError);
  });

  it("handles catastrophic offline state (TypeError)", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));

    let thrownError: unknown;
    try {
      await fetchLatestRates();
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeInstanceOf(FrankfurterOfflineError);
    expect(thrownError).toBeInstanceOf(FrankfurterError);
  });

  describe("Frankfurter API V2 Endpoint Layout", () => {
    it("maps the full currency dictionary to the application currency model", async () => {
      const mockPayload = {
        USD: {
          iso_code: "USD",
          iso_numeric: "840",
          name: "US Dollar",
          symbol: "$",
          start_date: "1999-01-04",
          end_date: "",
          providers: ["ECB"],
        },
        EUR: {
          iso_code: "EUR",
          iso_numeric: "978",
          name: "Euro",
          symbol: "€",
          start_date: "1999-01-04",
          end_date: "",
          providers: ["ECB"],
        },
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      } as Response);

      const result = await fetchCurrencies();

      expect(fetchMock).toHaveBeenCalledWith(
        "https://frankfurtur.mock/v2/currencies",
      );
      expect(result).toEqual([
        { code: "USD", name: "US Dollar", symbol: "$" },
        { code: "EUR", name: "Euro", symbol: "€" },
      ]);
    });

    it("targets an isolated currency detail endpoint with the requested code", async () => {
      const mockPayload = {
        iso_code: "USD",
        iso_numeric: "840",
        name: "US Dollar",
        symbol: "$",
        start_date: "1999-01-04",
        end_date: "",
        providers: ["ECB"],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      } as Response);

      const result = await fetchCurrencyDetails("USD");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://frankfurtur.mock/v2/currency/USD",
      );
      expect(result).toEqual({ code: "USD", name: "US Dollar", symbol: "$" });
    });

    it("assembles current live rates requests from the /rates root", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          date: "2026-07-11",
          base: "EUR",
          rates: { USD: 1.09 },
        }),
      } as Response);

      await fetchLatestRates();

      expect(fetchMock).toHaveBeenCalledWith(
        "https://frankfurtur.mock/v2/rates",
      );
    });

    it("appends the historical from parameter to the /rates endpoint", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          date: "2026-07-11",
          base: "EUR",
          rates: { USD: 1.09 },
        }),
      } as Response);

      await fetchHistoricalRates("2026-07-11");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://frankfurtur.mock/v2/rates?from=2026-07-11",
      );
    });

    it("serializes base and quote filters using the V2 query contract", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          date: "2026-07-11",
          base: "USD",
          rates: { EUR: 0.92, GBP: 0.79 },
        }),
      } as Response);

      await fetchLatestRates("USD", ["EUR", "GBP"]);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://frankfurtur.mock/v2/rates?base=USD&quotes=EUR,GBP",
      );
    });

    it("flattens a rate response into the V2 FrankfurterRate shape", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          date: "2026-07-11",
          base: "USD",
          rate: 0.92,
          change: 0,
        }),
      } as Response);

      const result = await getRate("USD", "EUR");

      expect(result).toEqual({
        date: "2026-07-11",
        base: "USD",
        quote: "EUR",
        rate: 0.92,
        change: 0,
      });
    });
  });

  describe("SWR Caching Layer", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("deduplicates requests and retrieves from cache", async () => {
      const mockPayload = {
        amount: 1,
        base: "EUR",
        date: "2026-07-06",
        rates: { USD: 1.09, GBP: 0.85 },
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      } as Response);

      const [res1, res2] = await Promise.all([
        fetchLatestRates(),
        fetchLatestRates(),
      ]);

      expect(res1).toEqual(mockPayload);
      expect(res2).toEqual(mockPayload);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("performs asynchronous refresh when stale (SWR)", async () => {
      const stalePayload = {
        amount: 1,
        base: "EUR",
        date: "2026-07-06",
        rates: { USD: 1.09, GBP: 0.85 },
      };

      const freshPayload = {
        amount: 1,
        base: "EUR",
        date: "2026-07-06",
        rates: { USD: 1.1, GBP: 0.86 },
      };

      // Seed the cache with stale data
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => stalePayload,
      } as Response);

      const firstRes = await fetchLatestRates();
      expect(firstRes).toEqual(stalePayload);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Advance time past the TTL (4 minutes = 240,000 ms)
      vi.advanceTimersByTime(240000);

      // Secondary mock return value representing "Fresh Data"
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => freshPayload,
      } as Response);

      // Trigger a new call
      const secondRes = await fetchLatestRates();

      // Assert it resolves immediately with the stale data
      expect(secondRes).toEqual(stalePayload);

      // Assert that the global fetch mock has been called exactly 2 times (seed + background refresh)
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("fetchCurrenciesMap", () => {
    it("transforms a flat currency array into a code-indexed record", async () => {
      executeMock.mockImplementation(async (_key, fallback) => fallback());
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => [
          { iso_code: "USD", name: "US Dollar", symbol: "$" },
          { iso_code: "EUR", name: "Euro", symbol: "€" },
        ],
      } as Response);

      const { fetchCurrenciesMap } = await import("./service");
      const result = await fetchCurrenciesMap();

      expect(result).toEqual({
        USD: { code: "USD", name: "US Dollar", symbol: "$" },
        EUR: { code: "EUR", name: "Euro", symbol: "€" },
      });
    });

    it("returns an empty object when the upstream array is empty", async () => {
      executeMock.mockImplementation(async (_key, fallback) => fallback());
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => [],
      } as Response);

      const { fetchCurrenciesMap } = await import("./service");
      const result = await fetchCurrenciesMap();

      expect(result).toEqual({});
    });

    it("propagates upstream failures without capturing partial state", async () => {
      executeMock.mockImplementation(async (_key, fallback) => fallback());
      fetchMock.mockRejectedValueOnce(new Error("network timeout"));

      const { fetchCurrenciesMap } = await import("./service");

      await expect(fetchCurrenciesMap()).rejects.toThrow(
        "Network connectivity issue / offline: network timeout",
      );
    });
  });
});
