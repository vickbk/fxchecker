import { SWREngine } from "@/shared/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("shared/cache/SWREngine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deduplicates concurrent fetches (cold start)", async () => {
    const engine = new SWREngine({ ttlMs: 5 * 60 * 1000 });

    const mockData = { hello: "world" };

    let resolveFetch: (val: unknown) => void;
    const fetchFn = vi.fn(
      () =>
        new Promise((res) => {
          resolveFetch = res;
        }),
    );

    const p1 = engine.execute(
      "key",
      fetchFn as unknown as () => Promise<typeof mockData>,
    );
    const p2 = engine.execute(
      "key",
      fetchFn as unknown as () => Promise<typeof mockData>,
    );

    expect(fetchFn).toHaveBeenCalledTimes(1);

    // Resolve the underlying fetch
    resolveFetch!(mockData);

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toEqual(mockData);
    expect(r2).toEqual(mockData);
  });

  it("returns stale value immediately and revalidates in background (SWR)", async () => {
    vi.useFakeTimers();
    const ttl = 240000; // 4 minutes
    const engine = new SWREngine({ ttlMs: ttl });

    const stale = { v: 1 };
    const fresh = { v: 2 };

    // Seed cache with initial value
    await engine.execute("k", () => Promise.resolve(stale));

    // Advance past TTL so the entry becomes stale
    vi.advanceTimersByTime(ttl + 1);

    const fetchFn = vi.fn(() => Promise.resolve(fresh));

    const res = await engine.execute("k", fetchFn);
    expect(res).toEqual(stale);
    expect(fetchFn).toHaveBeenCalledTimes(1);

    // Allow microtasks to flush so background update completes
    await Promise.resolve();

    const after = await engine.execute("k", () => Promise.resolve({}));
    expect(after).toEqual(fresh);

    vi.useRealTimers();
  });

  it("uses a request-specific TTL to trigger early revalidation", async () => {
    vi.useFakeTimers();

    try {
      const engine = new SWREngine({ ttlMs: 60_000 });
      const initialValue = { value: 1 };
      const freshValue = { value: 2 };

      await engine.execute("override-short", () =>
        Promise.resolve(initialValue),
      );

      vi.advanceTimersByTime(200);

      const fetchFn = vi.fn(() => Promise.resolve(freshValue));
      const result = await engine.execute(
        "override-short",
        fetchFn as unknown as () => Promise<typeof initialValue>,
        { ttlMs: 100 },
      );

      expect(result).toEqual(initialValue);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("uses a request-specific TTL to extend cache vitality", async () => {
    vi.useFakeTimers();

    try {
      const engine = new SWREngine({ ttlMs: 100 });
      const initialValue = { value: 1 };
      const fetchFn = vi.fn(() => Promise.resolve({ value: 2 }));

      await engine.execute("override-long", () =>
        Promise.resolve(initialValue),
      );

      vi.advanceTimersByTime(500);

      const result = await engine.execute(
        "override-long",
        fetchFn as unknown as () => Promise<typeof initialValue>,
        { ttlMs: 60_000 },
      );

      expect(result).toEqual(initialValue);
      expect(fetchFn).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("clear() resets cache and in-flight maps", async () => {
    const engine = new SWREngine({ ttlMs: 1000 });
    const first = { a: 1 };
    await engine.execute("x", () => Promise.resolve(first));

    engine.clear();

    const fetchFn = vi.fn(() => Promise.resolve({ a: 2 }));
    const res = await engine.execute(
      "x",
      fetchFn as unknown as () => Promise<{ a: number }>,
    );
    expect(res).toEqual({ a: 2 });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("clears a specific key while keeping other keys", async () => {
    const engine = new SWREngine({ ttlMs: 1000 });
    const first = { a: 1 };
    await engine.execute("keep", () => Promise.resolve(first));
    await engine.execute("clear", () => Promise.resolve(first));

    engine.clearKey("clear");

    const fetchFn = vi.fn(() => Promise.resolve({ a: 2 }));
    const keep = await engine.execute(
      "keep",
      fetchFn as unknown as () => Promise<{ a: number }>,
    );
    const clear = await engine.execute(
      "clear",
      fetchFn as unknown as () => Promise<{ a: number }>,
    );
    expect(keep).toEqual({ a: 1 });
    expect(clear).toEqual({ a: 2 });

    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
  it("clearKeys clears multiple keys while keeping unrelated keys", async () => {
    const engine = new SWREngine({ ttlMs: 1000 });
    const first = { a: 1 };
    await engine.execute("keep", () => Promise.resolve(first));
    await engine.execute("clear-1", () => Promise.resolve(first));
    await engine.execute("clear-2", () => Promise.resolve(first));

    engine.clearKeys("clear-1", "clear-2");

    const fetchFn = vi.fn(() => Promise.resolve({ a: 2 }));
    const keep = await engine.execute(
      "keep",
      fetchFn as unknown as () => Promise<{ a: number }>,
    );
    const clear1 = await engine.execute(
      "clear-1",
      fetchFn as unknown as () => Promise<{ a: number }>,
    );
    const clear2 = await engine.execute(
      "clear-2",
      fetchFn as unknown as () => Promise<{ a: number }>,
    );
    expect(keep).toEqual({ a: 1 });
    expect(clear1).toEqual({ a: 2 });
    expect(clear2).toEqual({ a: 2 });

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
