import { z } from "zod";

export const testSchema = z.object({
  TEST_USER_ID: z.string().default(""),
  TEST_USER_EMAIL: z.email().default("no-email@test.now"),
  TEST_USER_NAME: z.string().default(""),
});

/**
 * Parses process.env through Zod schema.
 * Empty strings are coerced to undefined so Zod defaults trigger properly.
 */
export function getTestConfig(): z.infer<typeof testSchema> {
  return testSchema.parse({
    TEST_USER_ID: process.env.TEST_USER_ID || undefined,
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || undefined,
    TEST_USER_NAME: process.env.TEST_USER_NAME || undefined,
  });
}

/**
 * Asserts that test environment variables are accessed only in test mode.
 */
export function checkTestRequest(prop: string | symbol): void {
  const propKey = String(prop);

  if (!isTestEnv() && propKey.startsWith("TEST_")) {
    throw new Error(
      `Attempting to access test environment variable "${propKey}" in a non-test environment.`,
    );
  }
}

export const isTestEnv = () =>
  process.env.NODE_ENV === "test" || !!process.env.TEST_ENV || !!process.env.CI;
