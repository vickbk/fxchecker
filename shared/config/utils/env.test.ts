import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Config } from "../types";

beforeEach(() => {
  vi.resetModules();
  delete process.env.FRANKFURTER_URL;
  delete process.env.AI_PROVIDER_KEY;
  delete process.env.AUTH_SECRET;
  delete process.env.AUTH_GOOGLE_ID;
  delete process.env.AUTH_GOOGLE_SECRET;
  delete process.env.NEXT_PUBLIC_APP_URL;
});

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
});

function initConfig(conf: Partial<Config> = {}) {
  process.env.FRANKFURTER_URL = "http://test_frankfurter_url";
  process.env.TMDB_API_KEY = "test_tmdb_key";
  process.env.AI_PROVIDER_KEY = "test_ai_key";
  process.env.AUTH_SECRET = "test_auth_secret";
  process.env.AUTH_GOOGLE_ID = "test_google_id";
  process.env.AUTH_GOOGLE_SECRET = "test_google_secret";
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  process.env.DATABASE_URL = "test_db_url";

  Object.keys(conf).forEach(
    (key) => (process.env[key] = conf[key as keyof Config] as string),
  );
}
