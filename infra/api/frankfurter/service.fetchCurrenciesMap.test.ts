import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const executeMock = vi.fn();
const fetchMock = vi.fn();

vi.mock("@/shared/cache", () => ({
  SWREngine: vi.fn().mockImplementation(function () {
    return {
      execute: executeMock,
      clear: vi.fn(),
    };
  }),
}));

vi.mock("@/shared/config", () => ({
  config: {
    FRANKFURTER_URL: "https://frankfurtur.mock",
  },
}));

describe("fetchCurrenciesMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the cache wrapper with the expected key and 7-day ttl", async () => {
    executeMock.mockImplementation(async (_key, fallback) => fallback());
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => [{ iso_code: "USD", name: "US Dollar", symbol: "$" }],
    } as Response);

    const { fetchCurrenciesMap } = await import("./service");
    await fetchCurrenciesMap();

    expect(executeMock).toHaveBeenCalledWith(
      "currencies-map",
      expect.any(Function),
      { ttlMs: 604800000 },
    );
  });
});
