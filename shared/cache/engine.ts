import { revalidateTag, unstable_cache } from "next/cache";

export class SWREngine {
  private defaultTtlSeconds: number;

  constructor(options: { ttlMs: number }) {
    this.defaultTtlSeconds = Math.max(1, Math.ceil(options.ttlMs / 1000));
  }

  public async execute<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: { ttlMs?: number },
  ): Promise<T> {
    const ttlSeconds = options?.ttlMs
      ? Math.max(1, Math.ceil(options.ttlMs / 1000))
      : this.defaultTtlSeconds;

    // Create a stable cached wrapper using Next.js native infrastructure
    const cachedFetcher = unstable_cache(
      async () => {
        return await fetchFn();
      },
      [key],
      {
        revalidate: ttlSeconds,
        tags: [key, "swr-engine"],
      },
    );

    return (await cachedFetcher()) as T;
  }

  public clear(): void {
    revalidateTag("swr-engine", { expire: 0 });
  }

  public clearKey(key: string): void {
    revalidateTag(key, { expire: 0 });
  }

  public clearKeys(...keys: string[]): void {
    keys.forEach((key) => this.clearKey(key));
  }
}
