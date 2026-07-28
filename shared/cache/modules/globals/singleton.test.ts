import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createGlobalSingleton } from "./singleton";

describe("createGlobalSingleton", () => {
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
      const factory = vi.fn(() => ({ service: "cache" }));

      createGlobalSingleton("TEST_LAZY_KEY", factory);

      expect(factory).not.toHaveBeenCalled();
    });

    it("should invoke the factory function only when the getter is called", () => {
      const factory = vi.fn(() => ({ service: "cache" }));
      const getSingleton = createGlobalSingleton("TEST_LAZY_KEY", factory);

      expect(factory).not.toHaveBeenCalled();

      const instance = getSingleton();

      expect(factory).toHaveBeenCalledTimes(1);
      expect(instance).toEqual({ service: "cache" });
    });

    it("should return the exact same instance reference on subsequent calls", () => {
      const factory = vi.fn(() => ({ id: Math.random() }));
      const getSingleton = createGlobalSingleton("TEST_REF_KEY", factory);

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
      const initialFactory = vi.fn(() => ({ version: 1 }));
      const reevaluatedFactory = vi.fn(() => ({ version: 2 }));

      // First module execution
      const getFirstSingleton = createGlobalSingleton(
        "TEST_HMR_KEY",
        initialFactory,
      );
      const instance1 = getFirstSingleton();

      // Second module execution (simulates Next.js HMR or separate bundle chunk)
      const getSecondSingleton = createGlobalSingleton(
        "TEST_HMR_KEY",
        reevaluatedFactory,
      );
      const instance2 = getSecondSingleton();

      expect(instance2).toBe(instance1);
      expect(instance2.version).toBe(1);
      expect(initialFactory).toHaveBeenCalledTimes(1);
      expect(reevaluatedFactory).not.toHaveBeenCalled();
    });

    it("should store the instance directly on globalThis under the specified key", () => {
      const factory = vi.fn(() => ({ name: "DatabaseClient" }));
      const getSingleton = createGlobalSingleton("TEST_REF_KEY", factory);

      const instance = getSingleton();
      const globalStore = globalThis as unknown as Record<string, unknown>;

      expect(globalStore["TEST_REF_KEY"]).toBe(instance);
    });
  });

  describe("Key Isolation", () => {
    it("should maintain distinct instances for different keys", () => {
      const getSingletonA = createGlobalSingleton("TEST_KEY_A", () => ({
        name: "Service A",
      }));
      const getSingletonB = createGlobalSingleton("TEST_KEY_B", () => ({
        name: "Service B",
      }));

      const instanceA = getSingletonA();
      const instanceB = getSingletonB();

      expect(instanceA).not.toBe(instanceB);
      expect(instanceA.name).toBe("Service A");
      expect(instanceB.name).toBe("Service B");
    });
  });

  describe("Error Handling & State Recovery", () => {
    it("should propagate errors thrown by the factory and retry on next call", () => {
      let shouldThrow = true;
      const factory = vi.fn(() => {
        if (shouldThrow) {
          throw new Error("Connection failed");
        }
        return { connected: true };
      });

      const getSingleton = createGlobalSingleton("TEST_ERROR_KEY", factory);

      // First attempt fails
      expect(() => getSingleton()).toThrow("Connection failed");
      expect(factory).toHaveBeenCalledTimes(1);

      // Fix underlying issue
      shouldThrow = false;

      // Second attempt succeeds and caches the result
      const instance = getSingleton();
      expect(instance).toEqual({ connected: true });
      expect(factory).toHaveBeenCalledTimes(2);

      // Third call reuses the successful instance
      getSingleton();
      expect(factory).toHaveBeenCalledTimes(2);
    });
  });

  describe("Edge Cases: Falsy & Non-Object Return Values", () => {
    it("should cache boolean `false` without re-running the factory", () => {
      const factory = vi.fn(() => false);
      const getSingleton = createGlobalSingleton("TEST_FALSY_KEY", factory);

      const val1 = getSingleton();
      const val2 = getSingleton();

      expect(val1).toBe(false);
      expect(val2).toBe(false);
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should cache numerical `0` without re-running the factory", () => {
      const factory = vi.fn(() => 0);
      const getSingleton = createGlobalSingleton("TEST_FALSY_KEY", factory);

      const val1 = getSingleton();
      const val2 = getSingleton();

      expect(val1).toBe(0);
      expect(val2).toBe(0);
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should cache empty string `""` and `null` correctly', () => {
      const factoryNull = vi.fn(() => null);
      const getSingletonNull = createGlobalSingleton(
        "TEST_FALSY_KEY",
        factoryNull,
      );

      expect(getSingletonNull()).toBeNull();
      expect(getSingletonNull()).toBeNull();
      expect(factoryNull).toHaveBeenCalledTimes(1);
    });

    it("should handle complex class instances and frozen objects", () => {
      class ServiceEngine {
        public readonly createdAt = Date.now();
      }

      const factory = vi.fn(() => Object.freeze(new ServiceEngine()));
      const getSingleton = createGlobalSingleton("TEST_REF_KEY", factory);

      const instance1 = getSingleton();
      const instance2 = getSingleton();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(ServiceEngine);
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });
});
