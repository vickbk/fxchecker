import { getFavorites } from "../actions";

export async function listFavorites() {
  const favorites = await getFavorites();
  return { success: !!favorites, favorites };
}
