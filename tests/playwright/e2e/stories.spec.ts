import { shouldSeeLoginButton } from "@/features/account/__testing__";
import { shouldSeeCompareSection } from "@/features/compare/__testing__";
import { shouldSeeTheConverterSection } from "@/features/converter/__testing__";
import { shouldSeeFavoriteSection } from "@/features/favorites/__testing__";
import { shouldSeePageTitle } from "@/features/header/__testing__";
import { shouldSeeHistorySection } from "@/features/history/__testing__";
import { shouldSeeLogsSection } from "@/features/logs/__testing__";
import { shouldSeeDarkThemeSwitcher } from "@/shared/theme/__testing__";
import { shouldSeeNavbar } from "@/shared/utils/modules/navbar/__testing__";
import { test } from "@playwright/test";

test.describe("Main Page tests", () => {
  test("Header should have titles, theme switcher and login button", async ({
    page,
  }) => {
    await page.goto("/");

    await shouldSeePageTitle(page);
    await shouldSeeDarkThemeSwitcher(page);
    await shouldSeeLoginButton(page);
  });

  const identicalTests = [
    ["should have the converter section", shouldSeeTheConverterSection],
    ["should see navigation section", shouldSeeNavbar],
    ["should see history section", shouldSeeHistorySection],
    ["should see compare section", shouldSeeCompareSection],
    ["Should see favorites section", shouldSeeFavoriteSection],
    ["Should see logs section", shouldSeeLogsSection],
  ] as const;

  identicalTests.forEach(([name, t]) =>
    test(name, async ({ page }) => {
      await page.goto("/");
      await t(page);
    }),
  );
});
