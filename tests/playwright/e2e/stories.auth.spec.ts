import { test } from "@playwright/test";
import { shouldSee } from "../utils/dsl";

test("should see test user", async ({ page }) => {
  await page.goto("/");

  await shouldSee(page, [/Test User/i, 1]);
});
