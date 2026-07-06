import { describe, expect, it } from "vitest";
import {
  getHistoricalCacheKey,
  getLatestCacheKey,
  getTimeSeriesCacheKey,
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
});
