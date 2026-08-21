import { describe, expect, test } from "vitest";
import { groupCurrencies } from "./group-currencies";

const MOCK_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "E" },
  { code: "GBP", name: "British Pound", symbol: "P" },
  { code: "JPY", name: "Japanese Yen", symbol: "Y" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C" },
];

describe("groupCurrencies", () => {
  // --- CORE FUNCTIONALITY & ORDERING ---

  test("should split currencies into favorites and others", () => {
    const favorites = ["EUR", "JPY"];
    const result = groupCurrencies(MOCK_CURRENCIES, favorites);

    expect(result.favorites.map((c) => c.code)).toEqual(["EUR", "JPY"]);
    expect(result.others.map((c) => c.code)).toEqual(["USD", "GBP", "CAD"]);
  });

  test("should preserve the exact order specified in the favorites array", () => {
    const favorites = ["JPY", "USD"];
    const result = groupCurrencies(MOCK_CURRENCIES, favorites);

    expect(result.favorites[0].code).toBe("JPY");
    expect(result.favorites[1].code).toBe("USD");
  });

  test("should preserve the original relative order for items in 'others'", () => {
    const favorites = ["EUR"];
    const result = groupCurrencies(MOCK_CURRENCIES, favorites);

    // Remaining order should still be USD -> GBP -> JPY -> CAD
    expect(result.others.map((c) => c.code)).toEqual([
      "USD",
      "GBP",
      "JPY",
      "CAD",
    ]);
  });

  // --- EDGE CASES & RESILIENCE ---

  test("should handle empty or nullish currencies array gracefully", () => {
    // @ts-expect-error Testing runtime JS tolerance
    expect(groupCurrencies(null, ["USD"])).toEqual({
      favorites: [],
      others: [],
    });
    expect(groupCurrencies([], ["USD"])).toEqual({ favorites: [], others: [] });
  });

  test("should return all currencies in 'others' when favorites is empty or nullish", () => {
    const resultEmpty = groupCurrencies(MOCK_CURRENCIES, []);
    expect(resultEmpty.favorites).toEqual([]);
    expect(resultEmpty.others).toEqual(MOCK_CURRENCIES);

    // @ts-expect-error Testing runtime JS tolerance
    const resultNull = groupCurrencies(MOCK_CURRENCIES, null);
    expect(resultNull.favorites).toEqual([]);
    expect(resultNull.others).toEqual(MOCK_CURRENCIES);
  });

  test("should ignore favorite codes that do not exist in currencies", () => {
    const favorites = ["XYZ", "USD", "ABC"];
    const result = groupCurrencies(MOCK_CURRENCIES, favorites);

    expect(result.favorites.map((c) => c.code)).toEqual(["USD"]);
    expect(result.others.length).toBe(4);
  });

  test("should handle duplicate favorite codes without duplicating output items", () => {
    const favorites = ["USD", "USD", "EUR", "USD"];
    const result = groupCurrencies(MOCK_CURRENCIES, favorites);

    expect(result.favorites.map((c) => c.code)).toEqual(["USD", "EUR"]);
    expect(result.others.map((c) => c.code)).toEqual(["GBP", "JPY", "CAD"]);
  });

  test("should handle case where all currencies are favorited", () => {
    const favorites = ["USD", "EUR", "GBP", "JPY", "CAD"];
    const result = groupCurrencies(MOCK_CURRENCIES, favorites);

    expect(result.favorites.length).toBe(5);
    expect(result.others).toEqual([]);
  });

  test("should return shallow copies to ensure input immutability", () => {
    const favorites = ["USD"];
    const result = groupCurrencies(MOCK_CURRENCIES, favorites);

    expect(result.others).not.toBe(MOCK_CURRENCIES);
  });
});
