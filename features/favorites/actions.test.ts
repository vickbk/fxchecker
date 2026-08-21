import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { assertAuthenticated, isAuthError } from "@/infra/core";
import * as sharedCache from "@/shared/cache";
import { FavoriteEntry } from "@/shared/currencies";
import * as utils from "@/shared/utils";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { clearAllFavorites, getFavorites, toggleFavorite } from "./actions";
import { db } from "./db/client";
import * as cacheModule from "./utils/cache";

// Explicitly mock core infrastructure as requested
vi.mock("@/infra/core", () => ({
  assertAuthenticated: vi.fn(),
  isAuthError: vi.fn(),
  getDB<T extends Record<string, unknown>>() {
    return {
      query: { exFavorites: { findMany: vi.fn(), findFirst: vi.fn() } },
      insert: vi.fn(),
    } as unknown as NodePgDatabase<T> & {
      $client: Pool;
    };
  },
}));

type DBInsert = Awaited<ReturnType<typeof db.insert>>;

describe("Favorites Server Actions", () => {
  const mockUserId = "usr_test_12345";
  const mockAssertAuthenticated = vi.mocked(assertAuthenticated);
  const mockIsAuthError = vi.mocked(isAuthError);

  beforeEach(() => {
    vi.restoreAllMocks();
    mockAssertAuthenticated.mockResolvedValue(mockUserId);
    mockIsAuthError.mockReturnValue(false);
    vi.spyOn(sharedCache, "revalidateAllPaths").mockImplementation(vi.fn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getFavorites", () => {
    it("fetches favorite pairs for authenticated user via SWR cache", async () => {
      const mockPairs: FavoriteEntry[] = ["USD-EUR", "GBP-JPY"];

      const findFirstSpy = vi
        .spyOn(db.query.exFavorites, "findFirst")
        .mockResolvedValueOnce({
          userId: mockUserId,
          favoritePairs: mockPairs,
        });

      const executeMock = vi
        .fn()
        .mockImplementation(async (_key: string, cb: () => Promise<unknown>) =>
          cb(),
        );

      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValue({
        execute: executeMock,
      } as unknown as sharedCache.SWREngine);

      const result = await getFavorites();

      expect(mockAssertAuthenticated).toHaveBeenCalledTimes(1);
      expect(executeMock).toHaveBeenCalledWith(
        `favorites-${mockUserId}`,
        expect.any(Function),
      );
      expect(findFirstSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPairs);
    });

    it("returns undefined when no database record exists for the user", async () => {
      vi.spyOn(db.query.exFavorites, "findFirst").mockResolvedValueOnce(
        undefined,
      );

      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValue({
        execute: vi.fn().mockImplementation((_, cb) => cb()),
      } as unknown as sharedCache.SWREngine);

      const result = await getFavorites();

      expect(result).toBeUndefined();
    });

    it("catches authentication errors and logs with error flag = false", async () => {
      const authError = new Error("Unauthenticated");
      mockAssertAuthenticated.mockRejectedValueOnce(authError);
      mockIsAuthError.mockReturnValueOnce(true);

      const logErrorSpy = vi
        .spyOn(utils, "logError")
        .mockImplementation(() => {});

      const result = await getFavorites();

      expect(logErrorSpy).toHaveBeenCalledWith(authError, false); // !true => false
      expect(result).toBeUndefined();
    });

    it("catches non-auth system errors and logs with error flag = true", async () => {
      const dbError = new Error("Connection timeout");
      vi.spyOn(cacheModule, "getFavoriteCache").mockImplementationOnce(() => {
        throw dbError;
      });
      mockIsAuthError.mockReturnValueOnce(false);

      const logErrorSpy = vi
        .spyOn(utils, "logError")
        .mockImplementation(() => {});

      const result = await getFavorites();

      expect(logErrorSpy).toHaveBeenCalledWith(dbError, true); // !false => true
      expect(result).toBeUndefined();
    });
  });

  describe("toggleFavorite", () => {
    it("adds a new favorite pair when not currently in user favorites", async () => {
      // Mock existing favorites
      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValue({
        execute: vi.fn().mockResolvedValue(["USD-EUR"]),
        clearKeys: vi.fn(),
      } as unknown as sharedCache.SWREngine);

      const clearKeysSpy = vi.fn();
      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValue({
        execute: vi.fn().mockResolvedValue(["USD-EUR"]),
        clearKeys: clearKeysSpy,
      } as unknown as sharedCache.SWREngine);

      const revalidateSpy = vi
        .spyOn(sharedCache, "revalidateAllPaths")
        .mockImplementation(() => {});

      const onConflictDoUpdateSpy = vi.fn().mockResolvedValue(undefined);
      const valuesSpy = vi.fn().mockReturnValue({
        onConflictDoUpdate: onConflictDoUpdateSpy,
      });

      vi.spyOn(db, "insert").mockReturnValue({
        values: valuesSpy,
      } as unknown as DBInsert);

      const response = await toggleFavorite({ base: "GBP", quote: "JPY" });

      expect(valuesSpy).toHaveBeenCalledWith({
        userId: mockUserId,
        favoritePairs: ["USD-EUR", "GBP-JPY"],
      });
      expect(clearKeysSpy).toHaveBeenCalledWith(
        `favorites-${mockUserId}`,
        "all-favorites",
      );
      expect(revalidateSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ success: true });
    });

    it("removes an existing favorite pair when already present", async () => {
      const clearKeysSpy = vi.fn();
      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValue({
        execute: vi.fn().mockResolvedValue(["USD-EUR", "GBP-JPY"]),
        clearKeys: clearKeysSpy,
      } as unknown as sharedCache.SWREngine);

      const onConflictDoUpdateSpy = vi.fn().mockResolvedValue(undefined);
      const valuesSpy = vi.fn().mockReturnValue({
        onConflictDoUpdate: onConflictDoUpdateSpy,
      });

      vi.spyOn(db, "insert").mockReturnValue({
        values: valuesSpy,
      } as unknown as DBInsert);

      const response = await toggleFavorite({ base: "USD", quote: "EUR" });

      expect(valuesSpy).toHaveBeenCalledWith({
        userId: mockUserId,
        favoritePairs: ["GBP-JPY"],
      });
      expect(response).toEqual({ success: true });
    });

    it("initializes a new list with single pair when existing favorites are undefined", async () => {
      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValue({
        execute: vi.fn().mockResolvedValue(undefined),
        clearKeys: vi.fn(),
      } as unknown as sharedCache.SWREngine);

      const valuesSpy = vi.fn().mockReturnValue({
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      });

      vi.spyOn(db, "insert").mockReturnValue({
        values: valuesSpy,
      } as unknown as DBInsert);

      const response = await toggleFavorite({ base: "EUR", quote: "CAD" });

      expect(valuesSpy).toHaveBeenCalledWith({
        userId: mockUserId,
        favoritePairs: ["EUR-CAD"],
      });
      expect(response).toEqual({ success: true });
    });

    it("catches auth rejection and returns error status object", async () => {
      const authError = new Error("Unauthorized");
      mockAssertAuthenticated.mockRejectedValueOnce(authError);

      const response = await toggleFavorite({ base: "USD", quote: "EUR" });

      expect(response).toEqual({
        success: false,
        error: authError,
      });
    });

    it("catches database failure and returns error status object", async () => {
      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValue({
        execute: vi.fn().mockResolvedValue([]),
      } as unknown as sharedCache.SWREngine);

      const dbError = new Error("DB write exception");
      vi.spyOn(db, "insert").mockImplementationOnce(() => {
        throw dbError;
      });

      const response = await toggleFavorite({ base: "USD", quote: "EUR" });

      expect(response).toEqual({
        success: false,
        error: dbError,
      });
    });
  });

  describe("clearAllFavorites", () => {
    it("resets user favorite pairs to empty array, purges cache, and revalidates paths", async () => {
      const clearKeysSpy = vi.fn();
      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValue({
        clearKeys: clearKeysSpy,
      } as unknown as sharedCache.SWREngine);

      const revalidateSpy = vi
        .spyOn(sharedCache, "revalidateAllPaths")
        .mockImplementation(() => {});

      const onConflictDoUpdateSpy = vi.fn().mockResolvedValue(undefined);
      const valuesSpy = vi.fn().mockReturnValue({
        onConflictDoUpdate: onConflictDoUpdateSpy,
      });

      vi.spyOn(db, "insert").mockReturnValue({
        values: valuesSpy,
      } as unknown as DBInsert);

      const response = await clearAllFavorites();

      expect(mockAssertAuthenticated).toHaveBeenCalledTimes(1);
      expect(valuesSpy).toHaveBeenCalledWith({
        userId: mockUserId,
        favoritePairs: [],
      });
      expect(clearKeysSpy).toHaveBeenCalledWith(
        `favorites-${mockUserId}`,
        "all-favorites",
      );
      expect(revalidateSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ success: true });
    });

    it("catches auth error and returns error response object", async () => {
      const authError = new Error("Authentication failed");
      mockAssertAuthenticated.mockRejectedValueOnce(authError);

      const response = await clearAllFavorites();

      expect(response).toEqual({
        success: false,
        error: authError,
      });
    });

    it("catches DB error during clear operation and returns error response object", async () => {
      const dbError = new Error("Unique constraint violation");
      vi.spyOn(db, "insert").mockImplementationOnce(() => {
        throw dbError;
      });

      const response = await clearAllFavorites();

      expect(response).toEqual({
        success: false,
        error: dbError,
      });
    });
  });
});
