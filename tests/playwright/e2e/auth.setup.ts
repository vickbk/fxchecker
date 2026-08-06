import { setupTestUser } from "@/infra/core/auth/__testing__";
import { test } from "@playwright/test";
import path from "path";

test.describe("Setup authentication data", () => {
  test("authenticate with Nextjs Programatically", async ({
    page,
    context,
  }) => {
    await setupTestUser(context);
    await page.goto("/");
    await context.storageState({
      path: path.resolve(import.meta.dirname, "../.auth/user.json"),
    });
  });
});
