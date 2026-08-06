import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initConfig, resetConfig } from "./init-helpers.test";

beforeEach(() => {
  vi.resetModules();
  delete process.env.FRANKFURTER_URL;
  delete process.env.AI_PROVIDER_KEY;
  delete process.env.AUTH_SECRET;
  delete process.env.AUTH_GOOGLE_ID;
  delete process.env.AUTH_GOOGLE_SECRET;
  delete process.env.NEXT_PUBLIC_APP_URL;
});

afterEach(resetConfig);

describe("Client Environment", () => {
  test("throws if client attempts to access private keys", async () => {
    let hasThrown = false;
    try {
      const { config } = await import("./env");
      console.log(config.FRANKFURTER_URL);
    } catch (err: unknown) {
      hasThrown = true;
      expect((err as Error).message).toBe(
        "Attempted to access server-side environment variable FRANKFURTER_URL from a Client Component.",
      );
    }

    expect(hasThrown).toBe(true);
  });

  test("allows client to access NEXT_PUBLIC_APP_URL", async () => {
    const { config } = await import("./env");

    expect(config.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });
});

describe("Server Enviroment check", () => {
  beforeEach(() => {
    vi.stubGlobal("window", undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

    const { config } = await import("./env");
    expect(config.NEXT_PUBLIC_APP_URL).toBe("test_url");
  });

  describe("Test environment check", () => {
    test("should return validated config properties cleanly in test mode", async () => {
      initConfig({
        TEST_USER_EMAIL: "proxy-test@fxchecker.dev",
        TEST_USER_ID: undefined,
      });

      const { config } = await import("./env");
      expect(config.TEST_USER_EMAIL).toBe("proxy-test@fxchecker.dev");
      expect(config.TEST_USER_ID).toBe("");
    });

    test("should throw when trying to access test variables outside test environment", async () => {
      initConfig({
        NODE_ENV: "production",
      });
      const { config } = await import("./env");

      expect(() => config.TEST_USER_EMAIL).toThrow(
        `Attempting to access test environment variable "TEST_USER_EMAIL" in a non-test environment.`,
      );
    });
  });
});

describe("testEnv Proxy", () => {
  beforeEach(() => {
    vi.stubGlobal("window", undefined);
    initConfig();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  test("should block access and throw when evaluated in production environment", async () => {
    initConfig({
      TEST_ENV: null,
      CI: null,
      NODE_ENV: "production",
    });

    const { config } = await import("./env");

    expect(() => config.TEST_USER_EMAIL).toThrow(
      'Attempting to access test environment variable "TEST_USER_EMAIL" in a non-test environment.',
    );
  });

  test("should render normally in test environment", async () => {
    const { config } = await import("./env");
    expect(config.TEST_USER_NAME).toBeDefined();
  });
});
