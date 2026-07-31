import { createGlobalCache, SWREngine } from "@/shared/cache";
import { parseTimeToMs } from "@/shared/utils";

export const getFavoriteCache = createGlobalCache(
  "FAVORITE_CACHE",
  () => new SWREngine({ ttlMs: parseTimeToMs("30m") }),
);
