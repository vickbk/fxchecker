"use server";

import { getRate } from "@/infra/api/frankfurter";
import { FavoriteSuite } from "@/shared/currencies";

export async function updateFavoriteStatus(
  func: FavoriteSuite["toggleFavorite"],
) {
  return async (form: FormData) => {
    "use server";
    const base = form.get("base") as string;
    const quote = form.get("quote") as string;

    console.log(base, quote);
    await func({ base, quote });
  };
}

export async function loadRate(
  _: unknown,
  { from, to }: { from: string; to: string },
) {
  return getRate(from, to);
}
