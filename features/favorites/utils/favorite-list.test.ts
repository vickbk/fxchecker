import { FavoriteEntry } from "@/shared/currencies";
import { describe, expect, test } from "vitest";
import { getFavoritesList } from "./favorite-list";

describe("Favorite Utility tests", () => {
  describe("Get Favorite List", () => {
    test("Should return USD EUR GBP for empty list", () => {
      expect(getFavoritesList([])).toStrictEqual(["USD", "EUR", "GBP"]);
    });

    test("should return EUR USD GBP when EUR has greater precedence than USD", () => {
      const list: FavoriteEntry[] = ["EUR-USD", "EUR-GBP", "USD-GBP"];
      expect(getFavoritesList(list)).toStrictEqual(["EUR", "USD", "GBP"]);
    });

    test("should not contain USD when not included in top 3 occurences", () => {
      expect(
        getFavoritesList([
          "EUR-CDF",
          "CDF-USD",
          "CDF-EUR",
          "GBP-CDF",
          "EUR-GBP",
        ]),
      ).not.toContain("USD");
    });
    test("should return a two list currency when only two currencies show in the list", () => {
      expect(getFavoritesList(["USD-EUR", "EUR-USD"]).length).toBe(2);
    });

    test("should return default list when the provided list does not have dashes", () => {
      // @ts-expect-error Testing runtime non dash values
      expect(getFavoritesList(["USD", "EUR"])).toEqual(["USD", "EUR", "GBP"]);
    });
  });
});
