import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FrankfurterError,
  FrankfurterOfflineError,
  FrankfurterRateLimitError,
  FrankfurterValidationError,
} from "./errors";
import { fetchLatestRates } from "./service";

const fetchMock = vi.fn();
vi.mock("@/shared/config", () => ({
  config: {
    FRANKFURTER_URL: "https://frankfurtur.mock",
  },
}));

describe("infra/api/frankfurter/service", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
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
});
