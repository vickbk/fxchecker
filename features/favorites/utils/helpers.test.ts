import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock(import("@/infra/core"), async () => {
  return {
    getDB<T extends Record<string, unknown>>() {
      return {
        query: { exFavorites: { findMany: vi.fn() } },
      } as unknown as NodePgDatabase<T> & {
        $client: Pool;
      };
    },
    assertAuthenticated: vi.fn(),
  };
});

import { SWREngine } from "@/shared/cache";
import * as utils from "@/shared/utils";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as actions from "../actions";
import { db } from "../db/client";
import * as cacheModule from "./cache";
import * as favoriteListModule from "./favorite-list";
import {
  getAllFavorites,
  getFavoritesCount,
  mainToggleFavorite,
} from "./helpers";

type FavoriteResults = Awaited<
  ReturnType<typeof db.query.exFavorites.findMany>
>;
describe("Favorites Service Helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("mainToggleFavorite", () => {
    it("extracts base and quote from FormData and calls toggleFavorite action", async () => {
      const toggleFavoriteSpy = vi
        .spyOn(actions, "toggleFavorite")
        .mockResolvedValueOnce({ success: true });

      const formData = new FormData();
      formData.append("base", "USD");
      formData.append("quote", "EUR");

      await mainToggleFavorite(formData);

      expect(toggleFavoriteSpy).toHaveBeenCalledTimes(1);
      expect(toggleFavoriteSpy).toHaveBeenCalledWith({
        base: "USD",
        quote: "EUR",
      });
    });

    it("handles missing form fields gracefully by passing null values to toggleFavorite", async () => {
      const toggleFavoriteSpy = vi
        .spyOn(actions, "toggleFavorite")
        .mockResolvedValueOnce({ success: true });

      const formData = new FormData(); // empty FormData

      await mainToggleFavorite(formData);

      expect(toggleFavoriteSpy).toHaveBeenCalledWith({
        base: null,
        quote: null,
      });
    });

    it("propagates unexpected errors thrown by toggleFavorite", async () => {
      vi.spyOn(actions, "toggleFavorite").mockRejectedValueOnce(
        new Error("Database write failure"),
      );

      const formData = new FormData();
      formData.append("base", "USD");
      formData.append("quote", "EUR");

      await expect(mainToggleFavorite(formData)).rejects.toThrow(
        "Database write failure",
      );
    });
  });

  describe("getFavoritesCount", () => {
    it("returns the total count when getFavorites resolves with an array of items", async () => {
      vi.spyOn(actions, "getFavorites").mockResolvedValueOnce([
        "USD-EUR",
        "GBP-JPY",
      ]);

      const count = await getFavoritesCount();

      expect(count).toBe(2);
    });

    it("returns 0 when getFavorites resolves with an empty array", async () => {
      vi.spyOn(actions, "getFavorites").mockResolvedValueOnce([]);

      const count = await getFavoritesCount();

      expect(count).toBe(0);
    });

    it("returns 0 when getFavorites resolves with null or undefined", async () => {
      // @ts-expect-error Testing runtime null return
      vi.spyOn(actions, "getFavorites").mockResolvedValueOnce(null);

      const count = await getFavoritesCount();

      expect(count).toBe(0);
    });

    it("catches error, logs it via logError, and returns 0 fallback when getFavorites throws", async () => {
      const mockError = new Error("Failed to fetch favorites");
      vi.spyOn(actions, "getFavorites").mockRejectedValueOnce(mockError);

      const count = await getFavoritesCount();

      expect(count).toBe(0);
    });
  });

  describe("getAllFavorites", () => {
    it("fetches cached favorites, flattens query results, and passes them to getFavoritesList", async () => {
      const parsedMs = 86400000;
      const parseTimeToMsSpy = vi
        .spyOn(utils, "parseTimeToMs")
        .mockReturnValueOnce(parsedMs);

      const dbRecords = [
        { favoritePairs: ["USD-EUR", "USD-GBP"] },
        { favoritePairs: ["EUR-JPY"] },
      ];

      const findManySpy = vi
        .spyOn(db.query.exFavorites, "findMany")
        .mockResolvedValueOnce(dbRecords as FavoriteResults);

      const expectedFavoritesList = ["USD-EUR", "USD-GBP", "EUR-JPY"];

      const getFavoritesListSpy = vi
        .spyOn(favoriteListModule, "getFavoritesList")
        .mockReturnValueOnce(expectedFavoritesList);

      // Spy on cache and simulate cache execution by immediately invoking the callback
      const executeMock = vi
        .fn()
        .mockImplementation(
          async (_key: string, callback: () => Promise<unknown>) => {
            return await callback();
          },
        );

      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValueOnce({
        execute: executeMock,
      } as unknown as SWREngine);

      const result = await getAllFavorites();

      expect(parseTimeToMsSpy).toHaveBeenCalledWith("1d");
      expect(executeMock).toHaveBeenCalledWith(
        "all-favorites",
        expect.any(Function),
        { ttlMs: parsedMs },
      );
      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(getFavoritesListSpy).toHaveBeenCalledWith([
        "USD-EUR",
        "USD-GBP",
        "EUR-JPY",
      ]);
      expect(result).toEqual(expectedFavoritesList);
    });

    it("handles empty database results by passing an empty array to getFavoritesList", async () => {
      vi.spyOn(utils, "parseTimeToMs").mockReturnValueOnce(86400000);
      vi.spyOn(db.query.exFavorites, "findMany").mockResolvedValueOnce([]);

      const getFavoritesListSpy = vi
        .spyOn(favoriteListModule, "getFavoritesList")
        .mockReturnValueOnce([]);

      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValueOnce({
        execute: vi.fn().mockImplementation((_, cb) => cb()),
      } as unknown as SWREngine);

      const result = await getAllFavorites();

      expect(getFavoritesListSpy).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });

    it("catches errors thrown inside cache callback, logs via logError, and returns empty array", async () => {
      const dbError = new Error("Database connection lost");
      vi.spyOn(utils, "parseTimeToMs").mockReturnValueOnce(86400000);
      vi.spyOn(db.query.exFavorites, "findMany").mockRejectedValueOnce(dbError);

      const logErrorSpy = vi
        .spyOn(utils, "logError")
        .mockImplementation(() => {});

      vi.spyOn(cacheModule, "getFavoriteCache").mockReturnValueOnce({
        execute: vi.fn().mockImplementation((_, cb) => cb()),
      } as unknown as SWREngine);

      const result = await getAllFavorites();

      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledWith(dbError);
      expect(result).toEqual([]);
    });

    it("catches error if getFavoriteCache or parseTimeToMs throws directly", async () => {
      const cacheError = new Error("Cache store unreachable");
      vi.spyOn(cacheModule, "getFavoriteCache").mockImplementationOnce(() => {
        throw cacheError;
      });

      const logErrorSpy = vi
        .spyOn(utils, "logError")
        .mockImplementation(() => {});

      const result = await getAllFavorites();

      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledWith(cacheError);
      expect(result).toEqual([]);
    });
  });
});
