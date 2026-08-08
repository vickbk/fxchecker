import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SWREngine } from "../engine";
import { createGlobalCache } from "./singleton";

describe("createGlobalCache", () => {
  const TEST_KEYS = [
    "TEST_LAZY_KEY",
    "TEST_REF_KEY",
    "TEST_HMR_KEY",
    "TEST_KEY_A",
    "TEST_KEY_B",
    "TEST_ERROR_KEY",
    "TEST_FALSY_KEY",
  ];

  beforeEach(() => {
    TEST_KEYS.forEach((key) => {
      delete (globalThis as Record<string, unknown>)[key];
    });
  });

  afterEach(() => {
    TEST_KEYS.forEach((key) => {
      delete (globalThis as Record<string, unknown>)[key];
    });
  });

  describe("Lifecycle & Lazy Evaluation", () => {
    it("should not invoke the factory function upon declaration", () => {
      const factory = vi.fn(() => new SWREngine({ ttlMs: 30 * 1000 }));

      createGlobalCache("TEST_LAZY_KEY", factory);

      expect(factory).not.toHaveBeenCalled();
    });

    it("should invoke the factory function only when the getter is called", () => {
      const factory = vi.fn(() => new SWREngine({ ttlMs: 30 * 1000 }));
      const getSingleton = createGlobalCache("TEST_LAZY_KEY", factory);

      expect(factory).not.toHaveBeenCalled();

      const instance = getSingleton();

      expect(factory).toHaveBeenCalledTimes(1);
      expect(instance).toBeInstanceOf(SWREngine);
    });

    it("should return the exact same instance reference on subsequent calls", () => {
      const factory = vi.fn(() => new SWREngine({ ttlMs: 30 * 1000 }));
      const getSingleton = createGlobalCache("TEST_REF_KEY", factory);

      const firstCall = getSingleton();
      const secondCall = getSingleton();
      const thirdCall = getSingleton();

      expect(firstCall).toBe(secondCall);
      expect(secondCall).toBe(thirdCall);
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });

  describe("Global Scope & Module Re-evaluation (HMR Simulation)", () => {
    it("should reuse an existing global instance when re-declared with the same key", () => {
      const initialFactory = vi.fn(() => new SWREngine({ ttlMs: 30 * 1000 }));
      const reevaluatedFactory = vi.fn(
        () => new SWREngine({ ttlMs: 30 * 1000 }),
      );

      const getFirstSingleton = createGlobalCache(
        "TEST_HMR_KEY",
        initialFactory,
      );
      const instance1 = getFirstSingleton();

      const getSecondSingleton = createGlobalCache(
        "TEST_HMR_KEY",
        reevaluatedFactory,
      );
      const instance2 = getSecondSingleton();

      expect(instance2).toBe(instance1);
      expect(initialFactory).toHaveBeenCalledTimes(1);
      expect(reevaluatedFactory).not.toHaveBeenCalled();
    });
  });

  describe("Key Isolation", () => {
    it("should maintain distinct instances for different keys", () => {
      const getSingletonA = createGlobalCache(
        "TEST_KEY_A",
        () => new SWREngine({ ttlMs: 30 * 1000 }),
      );
      const getSingletonB = createGlobalCache(
        "TEST_KEY_B",
        () => new SWREngine({ ttlMs: 30 * 1000 }),
      );

      const instanceA = getSingletonA();
      const instanceB = getSingletonB();

      expect(instanceA).not.toBe(instanceB);
    });
  });

  describe("Default cache setter", () => {
    it("should initiate a cache instance for a key when the init function is not set", () => {
      const singleton = createGlobalCache("TEST_KEY_A");

      expect(singleton).toBeDefined();
      expect(typeof singleton).toBe("function");
      expect(singleton()).toBeInstanceOf(SWREngine);
    });
  });
});
