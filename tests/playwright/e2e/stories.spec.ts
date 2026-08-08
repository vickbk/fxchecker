import { shouldSeeLoginButton } from "@/features/account/__testing__";
import { shouldOpenAndCloseChatbot } from "@/features/chatbot/__testing__";
import { shouldSeeCompareSection } from "@/features/compare/__testing__";
import { shouldSeeTheConverterSection } from "@/features/converter/__testing__";
import { shouldSeeEmptyFavoriteSection } from "@/features/favorites/__testing__";
import { shouldSeePageTitle } from "@/features/header/__testing__";
import { shouldSeeHistorySection } from "@/features/history/__testing__";
import { shouldSeeEmptyLogs } from "@/features/logs/__testing__";
import { shouldSeeNavbar } from "@/features/navbar/__testing__";
import { shouldHaveCorrectLevelHeading } from "@/shared/heading/__testing__/stories";
import { shouldSeeDarkThemeSwitcher } from "@/shared/theme/__testing__";
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
    ["Should see favorites section", shouldSeeEmptyFavoriteSection],
    ["Should see logs section", shouldSeeEmptyLogs],
    ["Should see chatbot section", shouldOpenAndCloseChatbot],
    ["Should have correct heading hierarchy", shouldHaveCorrectLevelHeading],
  ] as const;

  identicalTests.forEach(([name, t]) =>
    test(name, async ({ page }) => {
      await page.goto("/");
      await t(page);
    }),
  );
});
