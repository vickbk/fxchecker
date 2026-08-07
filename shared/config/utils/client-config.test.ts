import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { getClientConfig } from "./client-config";
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
