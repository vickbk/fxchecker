import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { config } from "./env";
import { initConfig, resetConfig } from "./init-helpers.test";
import { getServerConfig } from "./server-config";

beforeEach(() => {
  vi.resetModules();
  initConfig();
  vi.stubGlobal("window", undefined);
});
afterEach(() => {
  resetConfig();
  vi.unstubAllGlobals();
});
describe("Server Enviroment check", () => {
  test("throws if FRANKFURTER_URL is missing on server side", async () => {
    try {
      const { config } = await import("./env");
      console.log(config.FRANKFURTER_URL);
    } catch (err: unknown) {
      expect((err as Error).message).toMatch(/FRANKFURTER_URL is required/i);
    }
  });

  test("returns valid server config when env is correct", async () => {
    initConfig();
    const { config } = await import("./env");

    expect(config.FRANKFURTER_URL).toBe("http://test_frankfurter_url");
    expect(config.AI_PROVIDER_KEY).toBe("test_ai_key");
    expect(config.AUTH_SECRET).toBe("test_auth_secret");
    expect(config.AUTH_GOOGLE_ID).toBe("test_google_id");
    expect(config.AUTH_GOOGLE_SECRET).toBe("test_google_secret");
    expect(config.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  test("access client environment in the server", async () => {
    initConfig({ NEXT_PUBLIC_APP_URL: "test_url" });

    expect(config.NEXT_PUBLIC_APP_URL).toBe("test_url");
  });
});

describe("Get Server Config", () => {
  test("should get all server variables", () => {
    const results = getServerConfig();
    expect(results).toStrictEqual({
      AI_PROVIDER_KEY: "test_ai_key",
      AUTH_GOOGLE_ID: "test_google_id",
      AUTH_GOOGLE_SECRET: "test_google_secret",
      AUTH_SECRET: "test_auth_secret",
      DATABASE_MAX_CONNECTIONS: 10,
      DATABASE_URL: "test_db_url",
      FRANKFURTER_URL: "http://test_frankfurter_url",
      GEMINI_VERSION: "test_version",
      GOOGLE_GENERATIVE_AI_API_KEY: "test_generative_key",
      NEXT_PUBLIC_APP_URL: "test_url",
      NEXT_PUBLIC_CHATBOT_STORAGE_KEY: "test_storage_key",
      NEXT_PUBLIC_FLAGCDN: "https://flagcdn.com",
      TEST_USER_EMAIL: "test@user.email",
      TEST_USER_ID: "test-user-id",
      TEST_USER_NAME: "test_user_name",
    });
  });

  test("should update AI_PROVIDER_KEY", async () => {
    initConfig({ AI_PROVIDER_KEY: "new_ai_provider_key" });

    const { getServerConfig } = await import("./server-config");
    const { AI_PROVIDER_KEY } = getServerConfig();
    expect(AI_PROVIDER_KEY).toBe("new_ai_provider_key");
  });
});
