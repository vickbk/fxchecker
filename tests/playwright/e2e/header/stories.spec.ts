import {
  shouldSeeLiveMarketWithloadedData,
  shouldSeePageTitle,
} from "@/features/header/__testing__";
import test from "@playwright/test";
import { shouldSeeLoginButton } from "@/features/account/__testing__";

test.describe("Main header checks", () => {
  test("should see the main header with live market", async ({ page }) => {
    await page.goto("/");
    await shouldSeePageTitle(page);
    await shouldSeeLoginButton(page);
    await shouldSeeLiveMarketWithloadedData(page);
  });
});
