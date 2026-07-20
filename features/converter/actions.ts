"use server";

import { getRate } from "@/infra/api/frankfurter";
import { FavoriteSuite } from "@/shared/currencies";
import { LogCoversionAction } from "./types";

export async function updateFavoriteStatus(
  func: FavoriteSuite["toggleFavorite"],
) {
  return async (form: FormData) => {
    "use server";
    const base = form.get("base") as string;
    const quote = form.get("quote") as string;

    await func({ base, quote });
  };
}

export async function loadRate(
  _: unknown,
  { from, to }: { from: string; to: string },
) {
  return getRate(from, to);
}

export async function saveConversion(
  logConversion: LogCoversionAction,
  form: FormData,
) {
  "use server";
  await logConversion({
    base: form.get("base") as string,
    quote: form.get("quote") as string,
    rate: form.get("rate") as unknown as number,
    amount: form.get("amount") as unknown as number,
  });
}
