import { auth } from "@/infra/core";
import { FavoritePair } from "@/shared/currencies";
import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { exFavorites } from "./db/schema";

export async function getFavorites() {
  const session = await auth();
  if (!session?.user || !session.user.id) return;
  try {
    return (
      await db.query.exFavorites.findFirst({
        where: eq(exFavorites.userId, session.user.id),
      })
    )?.favoritePairs;
  } catch (error) {
    console.log(error);
  }
}

export async function toggleFavorite({ base, quote }: FavoritePair) {
  const session = await auth();
  if (!session?.user || !session.user.id)
    return { success: false, error: new Error("Authentication required") };
  try {
    const userId = session.user?.id;
    const pair = `${base}-${quote}`;
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
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error as Error };
  }
}

export async function clearAllFavorites() {
  const session = await auth();
  if (!session?.user || !session.user.id)
    return { success: false, error: new Error("Authentication required") };
  try {
    const userId = session.user?.id;
    await db
      .insert(exFavorites)
      .values({ userId, favoritePairs: [] })
      .onConflictDoUpdate({
        target: exFavorites.userId,
        set: { favoritePairs: [] },
      });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error as Error };
  }
}
