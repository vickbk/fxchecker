"use server";

import { getRate } from "@/infra/api/frankfurter";

export async function loadRate(
  _: unknown,
  { from, to }: { from: string; to: string },
) {
  return await getRate(from, to);
}
