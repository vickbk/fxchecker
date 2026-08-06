import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initConfig, resetConfig } from "./config-test-init";

describe("env resolution with central config setup", () => {
  beforeEach(() => {
    // Populate process.env with standard default test values
    initConfig();
  });

  afterEach(() => {
    // Clean up stubs so tests don't leak state into each other
    resetConfig();
  });

  it("should initialize with default keys", () => {
    expect(process.env.DATABASE_URL).toBe("test_db_url");
    expect(process.env.AUTH_SECRET).toBe("test_auth_secret");
  });

  it("should allow single-test key overrides", () => {
    initConfig({
      DATABASE_URL:
        "postgresql://custom_user:custom_pass@localhost:5432/custom_db",
      NEW_FEATURE_FLAG: "true",
    });

    expect(process.env.DATABASE_URL).toBe(
      "postgresql://custom_user:custom_pass@localhost:5432/custom_db",
    );
    expect(process.env.NEW_FEATURE_FLAG).toBe("true");
  });

  it("should allow unsetting/deleting specific variables", () => {
    initConfig({
      TMDB_API_KEY: undefined,
    });

    expect(process.env.TMDB_API_KEY).toBeUndefined();
  });
});
