/**
 * Ensures a single shared instance of a resource exists across
 * Next.js server module boundaries, HMR re-evaluations, and route bundles.
 */
export function createGlobalSingleton<T>(
  key: string,
  factory: () => T,
): () => T {
  const globalStore = globalThis as unknown as Record<string, T | undefined>;

  return () => {
    if (!(key in globalStore)) {
      globalStore[key] = factory();
    }
    return globalStore[key]!;
  };
}
