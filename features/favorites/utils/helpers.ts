import { logError, parseTimeToMs } from "@/shared/utils";
import { getFavorites, toggleFavorite } from "../actions";
import { db } from "../db/client";
import { getFavoriteCache } from "./cache";
import { getFavoritesList } from "./favorite-list";

export async function mainToggleFavorite(form: FormData) {
  "use server";
  const base = form.get("base") as string;
  const quote = form.get("quote") as string;

  await toggleFavorite({ base, quote });
}

export async function getFavoritesCount() {
  try {
    const favorites = await getFavorites();

    return favorites?.length || 0;
  } catch (error) {
    logError(error);
    return 0;
  }
}

export async function getAllFavorites() {
  try {
    return await getFavoriteCache().execute(
      "all-favorites",
      async () => {
        const favorites = (await db.query.exFavorites.findMany()).map(
          (fav) => fav.favoritePairs,
        );
        return getFavoritesList(favorites.flat());
      },
      {
        ttlMs: parseTimeToMs("1d"),
      },
    );
  } catch (error) {
    logError(error);
    return [];
  }
}
