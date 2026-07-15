import { beforeEach, describe, expect, test, vi } from "vitest";
import { defaultCurrencies, resolveCompareList } from "./utils";

const fetchCurrenciesMock = vi.fn();

vi.mock("@/infra/api/frankfurter", () => {
  return {
    fetchCurrencies: vi.fn(),
  };
});

describe("Tests for utility functions", () => {
  describe("Resolve compare list", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(fetchCurrenciesMock).mockReturnValue(
        Promise.resolve([
          { code: "NZD" },
          { code: "SGD" },
          { code: "HKD" },
          { code: "SEK" },
          { code: "NOK" },
          { code: "MXN" },
        ]),
      );
    });

    test("It returns the default list as the base is not in it", async () => {
      const list = await resolveCompareList("CDF");
      expect(list).toEqual(defaultCurrencies);
    });

    test("It should replace the base currency from the default list", async () => {
      const list = await resolveCompareList("USD");
      expect(list).not.toContain("USD");
      expect(list).not.toEqual([]);
    });

    test("should remove currency even when it comes in lower case", async () => {
      const list = await resolveCompareList("usd");
      expect(list).not.toContain("USD");
    });
  });
});
