import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { expandEnv } from "./expand-env";

// Store initial environment state for teardown
const ORIGINAL_ENV = { ...process.env };

function initConfig(conf: Record<string, string> = {}) {
  process.env.TMDB_API_KEY = "test_tmdb_key";
  process.env.AI_PROVIDER_KEY = "test_ai_key";
  process.env.AUTH_SECRET = "test_auth_secret";
  process.env.AUTH_GOOGLE_ID = "test_google_id";
  process.env.AUTH_GOOGLE_SECRET = "test_google_secret";
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  process.env.DATABASE_URL = "test_db_url";
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test_generative_key";

  Object.keys(conf).forEach((key) => {
    process.env[key] = conf[key];
  });
}

describe("expandEnv", () => {
  beforeEach(() => {
    // Reset process.env before each test run
    process.env = ORIGINAL_ENV;
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("should expand basic variable placeholders", () => {
    initConfig({
      POSTGRES_USER: "admin",
      POSTGRES_PASSWORD: "test_password",
      CUSTOM_DB_URL:
        "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/test_db",
    });

    expandEnv();

    expect(process.env.CUSTOM_DB_URL).toBe(
      "postgresql://admin:test_password@localhost:5432/test_db",
    );
  });

  it("should expand multi-level nested references", () => {
    initConfig({
      HOST: "localhost",
      PORT: "3000",
      BASE_URL: "http://${HOST}:${PORT}",
      API_ENDPOINT: "${BASE_URL}/api/v1",
    });

    expandEnv();

    expect(process.env.BASE_URL).toBe("http://localhost:3000");
    expect(process.env.API_ENDPOINT).toBe("http://localhost:3000/api/v1");
  });

  it("should replace missing environment variables with empty strings without crashing", () => {
    initConfig({
      TEST_VAR: "prefix_${NON_EXISTENT_VAR}_suffix",
    });

    expandEnv();

    expect(process.env.TEST_VAR).toBe("prefix__suffix");
  });

  it("should prevent infinite loops on self-referential variables", () => {
    initConfig({
      SELF_REF: "${SELF_REF}",
    });

    // Should complete immediately without hanging or throwing maximum call stack errors
    expect(() => expandEnv()).not.toThrow();
    expect(process.env.SELF_REF).toBe("${SELF_REF}");
  });

  it("should prevent infinite loops on circular dependencies between variables", () => {
    initConfig({
      VAR_A: "${VAR_B}",
      VAR_B: "${VAR_A}",
    });

    expect(() => expandEnv()).not.toThrow();
    expect(process.env.VAR_A).toBe("${VAR_A}");
    expect(process.env.VAR_B).toBe("${VAR_A}");
  });

  it("should preserve strings without placeholders untouched", () => {
    initConfig({
      PLAIN_STRING: "just_a_normal_string",
    });

    expandEnv();

    expect(process.env.PLAIN_STRING).toBe("just_a_normal_string");
  });

  it("should handle multiple placeholders within a single environment variable", () => {
    initConfig({
      PROTOCOL: "https",
      DOMAIN: "fxchecker.test",
      FULL_URL: "${PROTOCOL}://${DOMAIN}/dashboard",
    });

    expandEnv();

    expect(process.env.FULL_URL).toBe("https://fxchecker.test/dashboard");
  });
});
