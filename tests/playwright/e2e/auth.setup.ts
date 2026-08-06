import { setupTestUser } from "@/infra/core/auth/__testing__";
import { test } from "@playwright/test";
import path from "path";

test.describe("Setup authentication data", () => {
  test("authenticate with Nextjs Programatically", async ({
    page,
    context,
  }) => {
    const results = await setupTestUser();
    await context.addCookies([
      {
        ...results,
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      },
    ]);
    await page.goto("/");
    await context.storageState({
      path: path.resolve(import.meta.dirname, "../.auth/user.json"),
    });
  });
});
