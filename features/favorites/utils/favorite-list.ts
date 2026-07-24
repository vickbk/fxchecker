import { FavoriteEntry } from "@/shared/currencies";

const DEFAULT_FAVORITES = ["USD", "EUR", "GBP"];

export function getFavoritesList(list: FavoriteEntry[]) {
  if (!list || list.length === 0) return DEFAULT_FAVORITES;

  const counts = new Map<string, number>();

  for (let i = 0; i < list.length; i++) {
    const pair = list[i];
    const dashIndex = pair.indexOf("-");

    if (dashIndex === -1) continue;

    const c1 = pair.slice(0, dashIndex);
    const c2 = pair.slice(dashIndex + 1);

    counts.set(c1, (counts.get(c1) || 0) + 1);
    counts.set(c2, (counts.get(c2) || 0) + 1);
  }

  if (counts.size === 0) return DEFAULT_FAVORITES;

  const sorted = Array.from(counts.keys()).sort(
    (a, b) => counts.get(b)! - counts.get(a)!,
  );

  return sorted.slice(0, 3);
}
