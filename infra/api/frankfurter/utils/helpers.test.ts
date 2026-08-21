import { describe, expect, it } from "vitest";
import {
  getHistoricalCacheKey,
  getLatestCacheKey,
  getTimeSeriesCacheKey,
  toCurrency,
} from "./helpers";

describe("infra/api/frankfurter/utils", () => {
  it("normalizes latest cache keys with different sorting and defaults", () => {
    const key1 = getLatestCacheKey("EUR", ["USD", "GBP"]);
    const key2 = getLatestCacheKey("EUR", ["GBP", "USD"]);
    expect(key1).toBe("latest:EUR:GBP,USD");
    expect(key2).toBe("latest:EUR:GBP,USD");

    const keyDefault = getLatestCacheKey();
    expect(keyDefault).toBe("latest::");
  });

  it("formats historical cache keys correctly", () => {
    const key = getHistoricalCacheKey("2026-07-06", "USD", ["CAD", "EUR"]);
    expect(key).toBe("historical:2026-07-06:USD:CAD,EUR");
  });

  it("formats timeseries cache keys correctly", () => {
    const key = getTimeSeriesCacheKey("2026-07-01", "2026-07-06", undefined, [
      "USD",
    ]);
    expect(key).toBe("timeseries:2026-07-01:2026-07-06::USD");
  });

  describe("getTimeSeriesCacheKey", () => {
    const startDate = "2026-01-01";
    const endDate = "2026-01-31";

    it("generates a cache key with default empty values when base and symbols are omitted", () => {
      const key = getTimeSeriesCacheKey(startDate, endDate);
      expect(key).toBe("timeseries:2026-01-01:2026-01-31::");
    });

    it("includes the base currency when specified", () => {
      const key = getTimeSeriesCacheKey(startDate, endDate, "USD");
      expect(key).toBe("timeseries:2026-01-01:2026-01-31:USD:");
    });

    it("sorts and joins target symbols alphabetically", () => {
      const symbols = ["GBP", "AUD", "EUR", "JPY"];
      const key = getTimeSeriesCacheKey(startDate, endDate, "USD", symbols);
      expect(key).toBe("timeseries:2026-01-01:2026-01-31:USD:AUD,EUR,GBP,JPY");
    });

    it("guarantees deterministic cache keys regardless of the input order of symbols", () => {
      const keyA = getTimeSeriesCacheKey(startDate, endDate, "EUR", [
        "USD",
        "CAD",
        "GBP",
      ]);
      const keyB = getTimeSeriesCacheKey(startDate, endDate, "EUR", [
        "GBP",
        "USD",
        "CAD",
      ]);

      expect(keyA).toBe(keyB);
      expect(keyA).toBe("timeseries:2026-01-01:2026-01-31:EUR:CAD,GBP,USD");
    });

    it("does not mutate the original symbols array during sorting", () => {
      const originalSymbols = ["USD", "AUD", "EUR"];
      const symbolsCopy = [...originalSymbols];

      getTimeSeriesCacheKey(startDate, endDate, "GBP", originalSymbols);

      expect(originalSymbols).toEqual(symbolsCopy);
    });

    it("handles an empty symbols array gracefully", () => {
      const key = getTimeSeriesCacheKey(startDate, endDate, "EUR", []);
      expect(key).toBe("timeseries:2026-01-01:2026-01-31:EUR:");
    });

    it("handles a single item in the symbols array", () => {
      const key = getTimeSeriesCacheKey(startDate, endDate, "USD", ["JPY"]);
      expect(key).toBe("timeseries:2026-01-01:2026-01-31:USD:JPY");
    });
  });

  describe("toCurrency", () => {
    describe("Non-object or null payloads", () => {
      it.each([
        ["null", null],
        ["undefined", undefined],
        ["primitive number", 404],
        ["primitive string", "USD"],
        ["boolean true", true],
        ["boolean false", false],
        ["symbol", Symbol("currency")],
      ])("returns fallback structure when payload is %s", (_, payload) => {
        const result = toCurrency(payload, "DEFAULT");
        expect(result).toEqual({
          code: "DEFAULT",
          name: "",
          symbol: "",
        });
      });

      it("defaults code to empty string when fallbackCode is omitted for non-object payloads", () => {
        const result = toCurrency(null);
        expect(result).toEqual({
          code: "",
          name: "",
          symbol: "",
        });
      });
    });

    describe("Valid object payloads", () => {
      it("maps valid FrankfurterCurrency object properties accurately", () => {
        const payload = {
          iso_code: "EUR",
          name: "Euro",
          symbol: "€",
        };

        const result = toCurrency(payload);
        expect(result).toEqual({
          code: "EUR",
          name: "Euro",
          symbol: "€",
        });
      });

      it("ignores fallbackCode if payload is a valid object", () => {
        const payload = {
          iso_code: "USD",
          name: "United States Dollar",
          symbol: "$",
        };

        const result = toCurrency(payload, "EUR");
        expect(result.code).toBe("USD");
      });

      it("sanitizes non-string name and symbol properties to empty strings", () => {
        const payload = {
          iso_code: "JPY",
          name: 12345, // invalid type
          symbol: null, // invalid type
        };

        const result = toCurrency(payload);
        expect(result).toEqual({
          code: "JPY",
          name: "",
          symbol: "",
        });
      });

      it("handles objects missing name or symbol properties completely", () => {
        const payload = {
          iso_code: "GBP",
        };

        const result = toCurrency(payload);
        expect(result).toEqual({
          code: "GBP",
          name: "",
          symbol: "",
        });
      });

      it("handles empty object payload by returning undefined code and empty strings", () => {
        const result = toCurrency({});
        expect(result).toEqual({
          code: undefined,
          name: "",
          symbol: "",
        });
      });
    });
  });
});
