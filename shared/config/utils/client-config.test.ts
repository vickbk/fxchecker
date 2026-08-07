import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { checkClientRequest, getClientConfig } from "./client-config";
import { initConfig, resetConfig } from "./init-helpers.test";

beforeEach(() => {
  initConfig();
});

afterEach(() => {
  resetConfig();
});

describe("get client config", () => {
  test("should return default values when none is set", () => {
    initConfig({
      NEXT_PUBLIC_APP_URL: null,
      NEXT_PUBLIC_CHATBOT_STORAGE_KEY: null,
      NEXT_PUBLIC_FLAGCDN: null,
    });

    const {
      NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_CHATBOT_STORAGE_KEY,
      NEXT_PUBLIC_FLAGCDN,
    } = getClientConfig();

    expect(NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(NEXT_PUBLIC_CHATBOT_STORAGE_KEY).toBeDefined();
    expect(NEXT_PUBLIC_FLAGCDN).toBeDefined();
  });

  test("should return the set value when requested", () => {
    const testLink = "http://test.link";
    initConfig({ NEXT_PUBLIC_APP_URL: testLink });

    const { NEXT_PUBLIC_APP_URL } = getClientConfig();
    expect(NEXT_PUBLIC_APP_URL).toBe(testLink);
  });
});

describe("Check client side environment", () => {
  test("should return true in client side environment", () => {
    expect(checkClientRequest("NEXT_PUBLIC_VARIABLE")).toBe(true);
  });

  test("should throw if trying to access server variables in client side environment", () => {
    expect(() => checkClientRequest("MY_SERVER_VARIABLE")).toThrow(
      "Attempted to access server-side environment variable MY_SERVER_VARIABLE from a Client Component.",
    );
  });

  describe("server access", () => {
    beforeEach(() => {
      vi.resetModules();
      vi.stubGlobal("window", undefined);
    });
    afterEach(() => {
      vi.unstubAllGlobals();
    });
    test("should return false in server environment", () => {
      expect(checkClientRequest("NEXT_PUBLIC_MY_VARIABLE")).toBeFalsy();
    });

    test("should not throw when trying to access server variables", () => {
      expect(() => checkClientRequest("MY_SERVER_VARIABLE")).not.toThrow();
      expect(checkClientRequest("MY_SERVER_VARIABLE")).toBeFalsy();
    });
  });
});
