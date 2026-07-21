import { assertAuthenticated } from "@/infra/core";
import { revalidateAllPaths } from "@/shared/cache";
import {
  FavoriteEntry,
  FavoritePair,
  FavoriteSuite,
} from "@/shared/currencies";
import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { exFavorites } from "./db/schema";
import { favoriteCache } from "./utils";

export async function getFavorites() {
  try {
    const userId = await assertAuthenticated();
    return favoriteCache.execute(
      `favorites-${userId}`,
      async () =>
        (
          await db.query.exFavorites.findFirst({
            where: eq(exFavorites.userId, userId),
          })
        )?.favoritePairs as FavoriteEntry[] | undefined,
    );
  } catch (error) {
    console.log(error);
  }
}

export async function toggleFavorite({ base, quote }: FavoritePair) {
  "use server";
  try {
    const userId = await assertAuthenticated();
    const pair = (base + "-" + quote) as FavoriteEntry;
    const favorites = (await getFavorites()) ?? [];
    const favoritePairs = favorites.includes(pair)
      ? favorites.filter((p) => p !== pair)
      : [...favorites, pair];
    await db
      .insert(exFavorites)
      .values({ userId, favoritePairs })
      .onConflictDoUpdate({
        target: exFavorites.userId,
        set: { favoritePairs },
      });
    favoriteCache.clearKey(`favorites-${userId}`);
    revalidateAllPaths();
    return { success: true };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

export async function clearAllFavorites() {
  "use server";
  try {
    const userId = await assertAuthenticated();
    await db
      .insert(exFavorites)
      .values({ userId, favoritePairs: [] })
      .onConflictDoUpdate({
        target: exFavorites.userId,
        set: { favoritePairs: [] },
      });
    favoriteCache.clearKey(`favorites-${userId}`);
    revalidateAllPaths();
    return { success: true };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

export const favoriteSuite: FavoriteSuite = { toggleFavorite, getFavorites };
