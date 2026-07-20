import { CacheEntry } from "./types";

export class SWREngine {
  private cache = new Map<string, CacheEntry<unknown>>();
  private inFlightPromises = new Map<string, Promise<unknown>>();
  private ttlMs: number;

  constructor(options: { ttlMs: number }) {
    this.ttlMs = options.ttlMs;
  }

  public async execute<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: { ttlMs?: number },
  ): Promise<T> {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    const now = Date.now();
    const activeTtl = options?.ttlMs ?? this.ttlMs;

    // 1. Fresh Cache Hit
    if (entry && now - entry.createdAt < activeTtl) {
      return entry.data as Readonly<T>;
    }

    // 2. Stale Cache Hit (SWR Trigger)
    if (entry) {
      if (!entry.isRevalidating) {
        entry.isRevalidating = true;
        fetchFn()
          .then((freshData) => {
            this.cache.set(key, {
              data: freshData,
              createdAt: Date.now(),
              isRevalidating: false,
            });
          })
          .catch(() => {
            entry.isRevalidating = false;
          });
      }
      return entry.data as Readonly<T>;
    }

    // 3. Cold Start - Deduplicate In-Flight Promises
    const inFlight = this.inFlightPromises.get(key);
    if (inFlight) {
      return inFlight as Promise<Readonly<T>>;
    }

    const promise = fetchFn()
      .then((data) => {
        this.cache.set(key, {
          data,
          createdAt: Date.now(),
          isRevalidating: false,
        });
        this.inFlightPromises.delete(key);
        return data as Readonly<T>;
      })
      .catch((err) => {
        this.inFlightPromises.delete(key);
        throw err;
      });

    this.inFlightPromises.set(key, promise as Promise<unknown>);
    return promise;
  }

  /**
   * Resets all internal maps. Crucial for test isolation boundaries.
   */
  public clear(): void {
    this.cache.clear();
    this.inFlightPromises.clear();
  }

  public clearKey(key: string): void {
    this.cache.delete(key);
    this.inFlightPromises.delete(key);
  }
}
