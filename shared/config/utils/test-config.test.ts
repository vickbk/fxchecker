import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initConfig, resetConfig } from "./init-helpers.test";

import { checkTestRequest, getTestConfig, testSchema } from "./test-config";

describe("Test Environment Config Module", () => {
  beforeEach(() => {
    initConfig();
    vi.stubGlobal("window", undefined);
  });

  afterEach(() => {
    resetConfig();
    vi.unstubAllGlobals();
  });

  describe("testSchema", () => {
    it("should apply default values when input object is empty", () => {
      const parsed = testSchema.parse({});

      expect(parsed).toEqual({
        TEST_USER_ID: "",
        TEST_USER_EMAIL: "no-email@test.now",
        TEST_USER_NAME: "",
      });
    });

    it("should throw a Zod error for invalid email formats", () => {
      expect(() =>
        testSchema.parse({ TEST_USER_EMAIL: "invalid-email-format" }),
      ).toThrow();
    });

    it("should accept valid custom values", () => {
      const customConfig = {
        TEST_USER_ID: "usr_999",
        TEST_USER_EMAIL: "qa@fxchecker.dev",
        TEST_USER_NAME: "QA Automation Bot",
      };

      const parsed = testSchema.parse(customConfig);
      expect(parsed).toEqual(customConfig);
    });
  });

  describe("getTestConfig", () => {
    it("should extract custom values from process.env when present", () => {
      process.env.TEST_USER_ID = "usr_123";
      process.env.TEST_USER_EMAIL = "developer@fxchecker.dev";
      process.env.TEST_USER_NAME = "Dev Lead";

      const config = getTestConfig();

      expect(config).toEqual({
        TEST_USER_ID: "usr_123",
        TEST_USER_EMAIL: "developer@fxchecker.dev",
        TEST_USER_NAME: "Dev Lead",
      });
    });

    it("should fallback to schema defaults when environment variables are empty strings", () => {
      process.env.TEST_USER_ID = "";
      process.env.TEST_USER_EMAIL = "";
      process.env.TEST_USER_NAME = "";

      const config = getTestConfig();

      expect(config.TEST_USER_EMAIL).toBe("no-email@test.now");
      expect(config.TEST_USER_ID).toBe("");
    });
  });

  describe("checkTestRequest", () => {
    it("should throw an error if accessing TEST_ variables when not in test mode", () => {
      initConfig({
        TEST_ENV: null,
        NODE_ENV: "production",
      });

      expect(() => checkTestRequest("TEST_USER_ID")).toThrow(
        'Attempting to access test environment variable "TEST_USER_ID" in a non-test environment.',
      );
    });

    it("should NOT throw when NODE_ENV is set to 'test'", () => {
      initConfig({
        TEST_ENV: null,
      });

      expect(() => checkTestRequest("TEST_USER_ID")).not.toThrow();
    });

    it("should NOT throw when TEST_ENV boolean flag is active", () => {
      initConfig({
        TEST_ENV: "true",
        NODE_ENV: "production",
      });

      expect(() => checkTestRequest("TEST_USER_ID")).not.toThrow();
    });

    it("should NOT throw when accessing non-TEST_ variables even in production", () => {
      initConfig({
        TEST_ENV: null,
        NODE_ENV: "production",
      });

      expect(() => checkTestRequest("DATABASE_URL")).not.toThrow();
    });
  });

  describe("testEnv Proxy", () => {
    it("should block access and throw when evaluated in production environment", async () => {
      initConfig({
        TEST_ENV: null,
        NODE_ENV: "production",
      });

      const { config } = await import("./env");

      expect(() => config.TEST_USER_EMAIL).toThrow(
        'Attempting to access test environment variable "TEST_USER_EMAIL" in a non-test environment.',
      );
    });
  });
});
