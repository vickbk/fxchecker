import { getFavorites, toggleFavorite } from "./actions";

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
    console.error(error);
    return 0;
  }
}
