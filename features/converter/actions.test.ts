import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(async () => {
  vi.stubGlobal("window", undefined);
  const { initConfig } =
    await import("@/shared/config/utils/init-helpers.test");

  initConfig();
});

import * as frankfurterModule from "@/infra/api/frankfurter";
import * as actionsModule from "./actions";

describe("loadRate Server Action", () => {
  const mockGetRate = vi.spyOn(frankfurterModule, "getRate");
  const loadRate = vi.spyOn(actionsModule, "loadRate");

  const mockRateResult = {
    date: "2026-08-23",
    base: "USD",
    quote: "EUR",
    rate: 0.92,
    change: 0.005,
  };

  beforeEach(() => {
    vi.stubGlobal("window", undefined);
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("API Delegation & Argument Passing", () => {
    it("calls getRate with the correct currency codes", async () => {
      mockGetRate.mockResolvedValueOnce(mockRateResult);

      const payload = { from: "USD", to: "EUR" };
      await loadRate(null, payload);

      expect(mockGetRate).toHaveBeenCalledTimes(1);
      expect(mockGetRate).toHaveBeenCalledWith("USD", "EUR");
    });

    it("returns the exact FrankfurterRate object returned by getRate", async () => {
      mockGetRate.mockResolvedValueOnce(mockRateResult);

      const result = await loadRate(undefined, { from: "GBP", to: "JPY" });

      expect(result).toEqual(mockRateResult);
      expect(result.base).toBe("USD");
      expect(result.quote).toBe("EUR");
      expect(result.rate).toBe(0.92);
      expect(result.change).toBe(0.005);
    });

    it("handles rate objects without optional change property", async () => {
      const mockResultWithoutChange = {
        date: "2026-08-23",
        base: "CAD",
        quote: "CHF",
        rate: 0.65,
      };

      mockGetRate.mockResolvedValueOnce(mockResultWithoutChange);

      const result = await loadRate(null, { from: "CAD", to: "CHF" });

      expect(result).toEqual(mockResultWithoutChange);
      expect(result.change).toBeUndefined();
    });
  });

  describe("First Argument (prevState) Independence", () => {
    it("executes identically regardless of previous state parameter value", async () => {
      mockGetRate.mockResolvedValue(mockRateResult);

      const payload = { from: "USD", to: "EUR" };

      await loadRate(null, payload);
      await loadRate({ error: "Previous error" }, payload);
      await loadRate("arbitrary state string", payload);
      await loadRate(42, payload);

      expect(mockGetRate).toHaveBeenCalledTimes(4);
      mockGetRate.mock.calls.forEach((call) => {
        expect(call).toEqual(["USD", "EUR"]);
      });
    });
  });

  describe("Error Handling & Promise Rejection", () => {
    it("propagates API rejection errors when getRate fails", async () => {
      const apiError = new Error("Frankfurter API unreachable");
      mockGetRate.mockRejectedValueOnce(apiError);

      await expect(loadRate(null, { from: "USD", to: "EUR" })).rejects.toThrow(
        "Frankfurter API unreachable",
      );
    });

    it("bubbles up network/fetch failure rejections", async () => {
      mockGetRate.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(
        loadRate(null, { from: "INVALID", to: "EUR" }),
      ).rejects.toThrow(TypeError);
    });
  });
});
