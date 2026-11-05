import { SWREngine } from "@/shared/cache";
import { revalidateTag, unstable_cache } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: vi.fn((fn) => fn),
  revalidateTag: vi.fn(),
}));

describe("shared/cache/SWREngine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("executes fetch function and returns data", async () => {
    const engine = new SWREngine({ ttlMs: 5 * 60 * 1000 });
    const mockData = { hello: "world" };
    const fetchFn = vi.fn().mockResolvedValue(mockData);

    const result = await engine.execute("key", fetchFn);

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  it("passes custom ttlMs options down to unstable_cache configuration", async () => {
    const engine = new SWREngine({ ttlMs: 60_000 });
    const mockData = { value: 1 };
    const fetchFn = vi.fn().mockResolvedValue(mockData);

    const result = await engine.execute("override-ttl", fetchFn, {
      ttlMs: 10_000,
    });

    expect(unstable_cache).toHaveBeenCalledWith(
      expect.any(Function),
      ["override-ttl"],
      expect.objectContaining({ revalidate: 10 }), // 10,000ms converted to 10s
    );
    expect(result).toEqual(mockData);
  });

  it("clear() triggers global tag revalidation for swr-engine", async () => {
    const engine = new SWREngine({ ttlMs: 1000 });

    engine.clear();

    expect(revalidateTag).toHaveBeenCalledWith("swr-engine", { expire: 0 });
  });

  it("clearKey() triggers tag revalidation for a specific key", async () => {
    const engine = new SWREngine({ ttlMs: 1000 });

    engine.clearKey("target-key");

    expect(revalidateTag).toHaveBeenCalledWith("target-key", { expire: 0 });
  });

  it("clearKeys() triggers tag revalidation for multiple keys", async () => {
    const engine = new SWREngine({ ttlMs: 1000 });

    engine.clearKeys("key-1", "key-2");

    expect(revalidateTag).toHaveBeenCalledWith("key-1", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith("key-2", { expire: 0 });
  });
});
