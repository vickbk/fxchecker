import { Currency, fetchCurrencies } from "@/infra/api/frankfurter";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { defaultCurrencies, resolveCompareList } from "./helpers";

vi.mock("@/infra/api/frankfurter", () => {
  return {
    fetchCurrencies: vi.fn(),
  };
});

describe("Tests for utility functions", () => {
  describe("Resolve compare list", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(fetchCurrencies).mockResolvedValue([
        { code: "NZD" },
        { code: "SGD" },
        { code: "HKD" },
        { code: "SEK" },
        { code: "NOK" },
        { code: "MXN" },
      ] as Currency[]);
    });

    test("It returns the default list as the base is not in it", async () => {
      const list = await resolveCompareList("CDF");
      expect(list).toEqual(defaultCurrencies);
    });

    test("It should replace the base currency from the default list", async () => {
      const list = await resolveCompareList("EUR");
      expect(list).not.toContain("EUR");
      expect(list).not.toEqual([]);
    });

    test("should remove currency even when it comes in lower case", async () => {
      const list = await resolveCompareList("eur");
      expect(list).not.toContain("EUR");
    });

    test("should return empty list if empty list provided", async () => {
      const list = await resolveCompareList("eur", []);
      expect(list).toEqual([]);
    });

    test("should return the given list when currencyFetchRequest is empty", async () => {
      vi.mocked(fetchCurrencies).mockReturnValue(Promise.resolve([]));

      const initialList = ["EUR", "USD", "CDF"];
      const list = await resolveCompareList("eur", initialList);

      expect(list).toEqual(initialList);
    });

    test("should resturn the given list when there is no new replacement currency", async () => {
      const initialList = ["EUR", "USD", "CDF"];
      vi.mocked(fetchCurrencies).mockReturnValue(
        Promise.resolve([{ code: "EUR" }] as Currency[]),
      );

      const list = await resolveCompareList("EUR", initialList);
      expect(list).toEqual(initialList);
    });
  });
});
