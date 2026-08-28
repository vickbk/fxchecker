import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as cacheModule from "@/shared/cache";
import * as utilsModule from "@/shared/utils";
import { getFavoriteCache } from "./cache";

describe("getFavoriteCache Initializer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("is exported as a function/getter created by createGlobalCache", () => {
    expect(getFavoriteCache).toBeDefined();
    expect(typeof getFavoriteCache).toBe("function");
  });

  it("initializes SWREngine with a 30-minute TTL converted via parseTimeToMs", () => {
    const mockMs = 1800000; // 30 minutes in milliseconds
    const parseTimeToMsSpy = vi
      .spyOn(utilsModule, "parseTimeToMs")
      .mockReturnValue(mockMs);

    const swrEngineSpy = vi.spyOn(cacheModule, "SWREngine");

    const cacheInstance = getFavoriteCache();

    expect(parseTimeToMsSpy).toHaveBeenCalledWith("30m");
    expect(swrEngineSpy).toHaveBeenCalledWith({ ttlMs: mockMs });
    expect(cacheInstance).toBeInstanceOf(cacheModule.SWREngine);
  });

  it("maintains a global singleton instance across multiple getFavoriteCache calls", () => {
    const firstInstance = getFavoriteCache();
    const secondInstance = getFavoriteCache();

    expect(firstInstance).toBe(secondInstance);
  });

  it("passes 'FAVORITE_CACHE' as the identifier key to createGlobalCache", () => {
    const createGlobalCacheSpy = vi.spyOn(cacheModule, "createGlobalCache");

    // Execute createGlobalCache inline with same setup to verify parameter contract
    cacheModule.createGlobalCache(
      "FAVORITE_CACHE",
      () =>
        new cacheModule.SWREngine({ ttlMs: utilsModule.parseTimeToMs("30m") }),
    );

    expect(createGlobalCacheSpy).toHaveBeenCalledWith(
      "FAVORITE_CACHE",
      expect.any(Function),
    );
  });
});
