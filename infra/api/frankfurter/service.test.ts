import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FrankfurterError,
  FrankfurterOfflineError,
  FrankfurterRateLimitError,
  FrankfurterValidationError,
} from "./errors";
import { fetchLatestRates, frankfurterCache } from "./service";

const fetchMock = vi.fn();
vi.mock("@/shared/config", () => ({
  config: {
    FRANKFURTER_URL: "https://frankfurtur.mock",
  },
}));

describe("infra/api/frankfurter/service", () => {
  beforeEach(() => {
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
});
