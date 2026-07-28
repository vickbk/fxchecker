import { SWREngine } from "../engine";
import { createGlobalSingleton } from "../modules/globals/singleton";

export function createGlobalCache(
  key: string,
  factory: () => SWREngine = () =>
    new SWREngine({ ttlMs: 24 * 60 * 60 * 1000 }),
): () => SWREngine {
  return createGlobalSingleton(key, factory);
}
