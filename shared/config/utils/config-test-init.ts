import { vi } from "vitest";
import { Config } from "../types";

export const DEFAULT_TEST_ENV: Config = {
  FRANKFURTER_URL: "http://test_frankfurter_url",
  AI_PROVIDER_KEY: "test_ai_key",
  AUTH_SECRET: "test_auth_secret",
  AUTH_GOOGLE_ID: "test_google_id",
  AUTH_GOOGLE_SECRET: "test_google_secret",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  DATABASE_URL: "test_db_url",
  GOOGLE_GENERATIVE_AI_API_KEY: "test_generative_key",
  GEMINI_VERSION: "test_version",
  NEXT_PUBLIC_CHATBOT_STORAGE_KEY: "test_storage_key",
  TEST_USER_EMAIL: "test@user.email",
  TEST_USER_ID: "test-user-id",
  TEST_USER_NAME: "test_user_name",
  DATABASE_MAX_CONNECTIONS: 10,
};

/**
 * Initializes process.env with baseline test defaults and applies optional overrides.
 * Uses `vi.stubEnv` when available to enable automatic cleanup with `vi.unstubAllEnvs()`.
 */
export function initConfig(
  overrides: Record<string, string | undefined | null> = {},
): void {
  const merged: Config = {
    ...DEFAULT_TEST_ENV,
    ...overrides,
  };

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === null) {
      delete process.env[key];
    } else if (typeof vi !== "undefined" && typeof vi.stubEnv === "function") {
      vi.stubEnv(key, value as string);
    } else {
      process.env[key] = value as string;
    }
  }
}

/**
 * Restores process.env to its un-stubbed state.
 */
export function resetConfig(): void {
  if (isTestEnv()) {
    vi.unstubAllEnvs();
  }
}

export function isTestEnv() {
  return typeof vi !== "undefined" && typeof vi.unstubAllEnvs === "function";
}
