import { shouldSeeSignInInformation } from "@/features/account/__testing__";
import { test } from "@playwright/test";

test("should see test user", async ({ page }) => {
  await page.goto("/");

  await shouldSeeSignInInformation(page);
});
