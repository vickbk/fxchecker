import { type Currency } from "@/infra/api/frankfurter";
import { describe, expect, it } from "vitest";
import { filteredCurrencies, highlightedCurrencyIndex } from "./utils";

const mockCurrencies: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "GBP", name: "British Pound Sterling", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
];

describe("filteredCurrencies", () => {
  describe("Empty & Whitespace Queries", () => {
    it("returns all currencies unmodified when query is an empty string", () => {
      const result = filteredCurrencies(mockCurrencies, "");
      expect(result).toEqual(mockCurrencies);
    });

    it("returns all currencies unmodified when query consists solely of whitespace", () => {
      const result = filteredCurrencies(mockCurrencies, "   \t\n  ");
      expect(result).toEqual(mockCurrencies);
    });

    it("returns an empty array when currencies array is empty regardless of query", () => {
      expect(filteredCurrencies([], "USD")).toEqual([]);
      expect(filteredCurrencies([], "")).toEqual([]);
    });
  });

  describe("Search Matching & Sanitization", () => {
    it("filters currencies matching code case-insensitively", () => {
      const resultUpper = filteredCurrencies(mockCurrencies, "USD");
      expect(resultUpper).toHaveLength(1);
      expect(resultUpper[0].code).toBe("USD");

      const resultLower = filteredCurrencies(mockCurrencies, "eur");
      expect(resultLower).toHaveLength(1);
      expect(resultLower[0].code).toBe("EUR");
    });

    it("filters currencies by partial code matches", () => {
      const result = filteredCurrencies(mockCurrencies, "US");
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("USD");
    });

    it("filters currencies matching full or partial name", () => {
      const resultSingle = filteredCurrencies(mockCurrencies, "pound");
      expect(resultSingle).toHaveLength(1);
      expect(resultSingle[0].code).toBe("GBP");

      const resultMultiple = filteredCurrencies(mockCurrencies, "dollar");
      expect(resultMultiple).toHaveLength(2);
      expect(resultMultiple.map((c) => c.code)).toEqual(["USD", "CAD"]);
    });

    it("filters currencies matching currency symbol", () => {
      const resultEuro = filteredCurrencies(mockCurrencies, "€");
      expect(resultEuro).toHaveLength(1);
      expect(resultEuro[0].code).toBe("EUR");

      const resultDollar = filteredCurrencies(mockCurrencies, "$");
      expect(resultDollar).toHaveLength(2);
      expect(resultDollar.map((c) => c.code)).toEqual(["USD", "CAD"]);
    });

    it("matches cross-field queries taking advantage of concatenated haystack structure", () => {
      // Haystack format: `${currency.code} ${currency.name} ${currency.symbol}`
      const result = filteredCurrencies(mockCurrencies, "usd united");
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("USD");
    });

    it("trims search query before filtering", () => {
      const result = filteredCurrencies(mockCurrencies, "   JPY   ");
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("JPY");
    });

    it("returns an empty array when query matches no code, name, or symbol", () => {
      const result = filteredCurrencies(mockCurrencies, "NONEXISTENT_CURRENCY");
      expect(result).toEqual([]);
    });
  });
});

describe("highlightedCurrencyIndex", () => {
  describe("In-Bounds Operations", () => {
    it("returns the index when it is strictly within array bounds", () => {
      expect(highlightedCurrencyIndex(mockCurrencies, 0)).toBe(0);
      expect(highlightedCurrencyIndex(mockCurrencies, 2)).toBe(2);
      expect(highlightedCurrencyIndex(mockCurrencies, 4)).toBe(4); // last element (length 5)
    });
  });

  describe("Out-of-Bounds & Edge Cases", () => {
    it("returns -1 when index equals the currencies array length", () => {
      expect(highlightedCurrencyIndex(mockCurrencies, 5)).toBe(-1);
    });

    it("returns -1 when index exceeds the currencies array length", () => {
      expect(highlightedCurrencyIndex(mockCurrencies, 10)).toBe(-1);
    });

    it("returns -1 when currencies array is empty and index is 0 or greater", () => {
      expect(highlightedCurrencyIndex([], 0)).toBe(-1);
      expect(highlightedCurrencyIndex([], 1)).toBe(-1);
    });

    it("preserves index when negative index is less than array length", () => {
      expect(highlightedCurrencyIndex(mockCurrencies, -1)).toBe(-1);
    });
  });
});
