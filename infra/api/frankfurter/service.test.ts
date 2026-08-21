import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchCurrencies,
  fetchCurrencyDetails,
  fetchHistoricalRates,
  fetchLatestRates,
  getFrankfurterCache,
  getRate,
  request,
} from "./service";
import {
  FrankfurterError,
  FrankfurterOfflineError,
  FrankfurterRateLimitError,
  FrankfurterValidationError,
} from "./utils/errors";
import * as assertModule from "./utils/request-helpers";

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
    getFrankfurterCache().clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("request helper", () => {
    beforeEach(() => {
      vi.spyOn(assertModule, "assertSafeRequestPath");
    });

    describe("Successful Requests (HTTP 200)", () => {
      it("fetches data successfully and parses JSON response", async () => {
        const mockData = { amount: 1.0, base: "USD", date: "2026-08-21" };
        fetchMock.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockData,
        });

        const result = await request<typeof mockData>("/latest");

        expect(assertModule.assertSafeRequestPath).toHaveBeenCalledWith(
          "/latest",
        );
        expect(fetchMock).toHaveBeenCalledWith(
          "https://frankfurtur.mock/v2/latest",
        );
        expect(result).toEqual(mockData);
      });

      it("accepts application/json content types with charset parameters", async () => {
        const mockData = { rates: { EUR: 0.85 } };
        fetchMock.mockResolvedValueOnce(
          new Response(JSON.stringify(mockData), {
            status: 200,
            headers: { "content-type": "application/json; charset=utf-8" },
          }),
        );

        const result = await request<typeof mockData>("/latest");
        expect(result).toEqual(mockData);
      });

      it("allows responses when content-type header is omitted", async () => {
        const mockData = { success: true };
        fetchMock.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockData,
        });

        const result = await request<typeof mockData>("/status");
        expect(result).toEqual(mockData);
      });

      it("throws FrankfurterError if HTTP 200 content-type is not JSON", async () => {
        fetchMock.mockResolvedValue(
          new Response("<html><body>Error</body></html>", {
            status: 200,
            headers: { "content-type": "text/html" },
          }),
        );

        await expect(request("/latest")).rejects.toThrow(FrankfurterError);
        await expect(request("/latest")).rejects.toThrow(
          "Invalid content-type: expected application/json but received text/html",
        );
      });
    });

    describe("Query Parameter Serialization", () => {
      it("constructs URL without query string when queryParams is empty or undefined", async () => {
        fetchMock.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

        await request("/latest", {});
        expect(fetchMock).toHaveBeenCalledWith(
          "https://frankfurtur.mock/v2/latest",
        );
      });

      it("serializes primitive string query parameters with standard encoding", async () => {
        fetchMock.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

        await request("/latest", { base: "USD", search: "hello world" });
        expect(fetchMock).toHaveBeenCalledWith(
          "https://frankfurtur.mock/v2/latest?base=USD&search=hello%20world",
        );
      });

      it("joins array query parameters with commas and encodes them", async () => {
        fetchMock.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

        await request("/latest", { symbols: ["USD", "EUR", "GBP"] });
        expect(fetchMock).toHaveBeenCalledWith(
          "https://frankfurtur.mock/v2/latest?symbols=USD%2CEUR%2CGBP",
        );
      });

      it("bypasses URL encoding specifically for the 'quotes' query key", async () => {
        fetchMock.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

        await request("/latest", { quotes: ["USD", "EUR"], base: "GBP" });
        expect(fetchMock).toHaveBeenCalledWith(
          "https://frankfurtur.mock/v2/latest?quotes=USD,EUR&base=GBP",
        );
      });

      it("ignores null, undefined, and empty string/array values", async () => {
        fetchMock.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

        await request("/latest", {
          valid: "USD",
          // @ts-expect-error Testing runtime null filter
          nullish: null,
          missing: undefined,
          emptyStr: "",
          emptyArr: [],
        });

        expect(fetchMock).toHaveBeenCalledWith(
          "https://frankfurtur.mock/v2/latest?valid=USD",
        );
      });
    });

    describe("HTTP Error Status Handling", () => {
      it("throws FrankfurterRateLimitError on HTTP 429", async () => {
        fetchMock.mockResolvedValue(
          new Response("Too Many Requests", { status: 429 }),
        );

        await expect(request("/latest")).rejects.toThrow(
          FrankfurterRateLimitError,
        );
        await expect(request("/latest")).rejects.toThrow(
          "Frankfurter API rate limit exceeded (429).",
        );
      });

      it("throws FrankfurterValidationError on HTTP 422", async () => {
        fetchMock.mockResolvedValue(
          new Response("Unprocessable Entity", { status: 422 }),
        );

        await expect(request("/latest")).rejects.toThrow(
          FrankfurterValidationError,
        );
        await expect(request("/latest")).rejects.toThrow(
          "Invalid currency parameters or malformed request payload (422).",
        );
      });

      it.each([400, 401, 403, 404, 500, 502, 503])(
        "throws unclassified FrankfurterError for HTTP %i",
        async (statusCode) => {
          fetchMock.mockResolvedValue(
            new Response("Server Error", { status: statusCode }),
          );

          await expect(request("/latest")).rejects.toThrow(FrankfurterError);
          await expect(request("/latest")).rejects.toThrow(
            `Frankfurter API returned unclassified response: HTTP ${statusCode}`,
          );
        },
      );
    });

    describe("Network and Catch Block Resilience", () => {
      it("re-throws instances of FrankfurterError without wrapping in FrankfurterOfflineError", async () => {
        vi.mocked(assertModule.assertSafeRequestPath).mockImplementationOnce(
          () => {
            throw new FrankfurterValidationError("Unsafe path");
          },
        );

        await expect(request("/unsafe..path")).rejects.toThrow(
          FrankfurterValidationError,
        );
      });

      it("wraps native fetch network failure in FrankfurterOfflineError", async () => {
        fetchMock.mockRejectedValue(new Error("Failed to fetch"));

        await expect(request("/latest")).rejects.toThrow(
          FrankfurterOfflineError,
        );
        await expect(request("/latest")).rejects.toThrow(
          "Network connectivity issue / offline: Failed to fetch",
        );
      });

      it("wraps unknown error failure in FrankfurterOfflineError in string format", async () => {
        fetchMock.mockRejectedValue("Failed to fetch");

        await expect(request("/latest")).rejects.toThrow(
          FrankfurterOfflineError,
        );
        await expect(request("/latest")).rejects.toThrow(
          "Network connectivity issue / offline: Failed to fetch",
        );
      });

      it("wraps JSON parse failure (SyntaxError) in FrankfurterOfflineError", async () => {
        fetchMock.mockResolvedValueOnce(
          new Response("invalid json payload", {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        );

        await expect(request("/latest")).rejects.toThrow(
          FrankfurterOfflineError,
        );
      });
    });
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
    describe("FetchCurrencies Endpoint", () => {
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

      it("replaces missing values with empty strings", async () => {
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
          OTH: null,
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
          { code: "OTH", name: "", symbol: "" },
        ]);
      });

      it("processes a returned array", async () => {
        const mockPayload = [
          {
            iso_code: "USD",
            iso_numeric: "840",
            name: "US Dollar",
            symbol: "$",
            start_date: "1999-01-04",
            end_date: "",
            providers: ["ECB"],
          },
          {
            iso_code: "EUR",
            iso_numeric: "978",
            name: "Euro",
            symbol: "€",
            start_date: "1999-01-04",
            end_date: "",
            providers: ["ECB"],
          },
        ];
        fetchMock.mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => mockPayload,
        });

        const results = await fetchCurrencies();
        expect(fetchMock).toHaveBeenCalledWith(
          "https://frankfurtur.mock/v2/currencies",
        );
        expect(results).toEqual([
          { code: "USD", name: "US Dollar", symbol: "$" },
          { code: "EUR", name: "Euro", symbol: "€" },
        ]);
      });

      it("processes a returned array and add empty object for non-resolved objects as well as empty values for missing ones", async () => {
        const mockPayload = [
          {
            iso_code: "USD",
            iso_numeric: "840",
            name: "US Dollar",
            symbol: "$",
            start_date: "1999-01-04",
            end_date: "",
            providers: ["ECB"],
          },
          {
            iso_code: "EUR",
            iso_numeric: "978",
            name: "Euro",
            symbol: "€",
            start_date: "1999-01-04",
            end_date: "",
            providers: ["ECB"],
          },
          null,
          {
            iso_code: "OTH",
            iso_numeric: "978",
            start_date: "1999-01-04",
            end_date: "",
            providers: ["ECB"],
          },
        ];
        fetchMock.mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => mockPayload,
        });

        const results = await fetchCurrencies();
        expect(fetchMock).toHaveBeenCalledWith(
          "https://frankfurtur.mock/v2/currencies",
        );
        expect(results).toEqual([
          { code: "USD", name: "US Dollar", symbol: "$" },
          { code: "EUR", name: "Euro", symbol: "€" },
          { code: "", name: "", symbol: "" },
          { code: "OTH", name: "", symbol: "" },
        ]);
      });

      it("returns an empty array when the payload is undefined", async () => {
        fetchMock.mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => undefined,
        });

        const results = await fetchCurrencies();
        expect(results).toEqual([]);
      });
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

    it("appends the historical from, base and quotes parameters to the /rates endpoint", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          date: "2026-07-11",
          base: "EUR",
          rates: { USD: 1.09 },
        }),
      } as Response);

      await fetchHistoricalRates("2026-07-11", "EUR");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://frankfurtur.mock/v2/rates?from=2026-07-11&base=EUR",
      );

      await fetchHistoricalRates("2026-07-11", "EUR", ["USD", ""]);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://frankfurtur.mock/v2/rates?from=2026-07-11&base=EUR&quotes=USD",
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

    it("returns an empty date when from date is missing and 0 rate when rate missing from response", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          base: "USD",
          change: 0,
        }),
      } as Response);

      const result = await getRate("USD", "EUR");

      expect(result).toEqual({
        date: "",
        base: "USD",
        quote: "EUR",
        rate: 0,
        change: NaN,
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
