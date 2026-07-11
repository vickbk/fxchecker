import { shouldSeeLoginButton } from "@/features/account/__testing__/login";
import { shouldSeeTheConverterSection } from "@/features/converter/__testing__";
import { shouldSeePageTitle } from "@/features/header/__testing__";
import { shouldSeeLightThemeSwitcher } from "@/shared/theme/__testing__";
import { test } from "@playwright/test";

test.describe("Main Page tests", () => {
  test("Header should have titles, theme switcher and login button", async ({
    page,
  }) => {
    await page.goto("/");

    await shouldSeePageTitle(page);
    await shouldSeeLightThemeSwitcher(page);
    await shouldSeeLoginButton(page);
  });

  test("should have the converter section", async ({ page }) => {
    await page.goto("/");
    await shouldSeeTheConverterSection(page);
  });
});
