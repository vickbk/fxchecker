import {
  shouldHaveUSDToEuroOnStart,
  shouldSwapBetweenUSDandEUR,
} from "@/features/converter/__testing__";
import test from "@playwright/test";

test.describe("Initial Convert Tests", () => {
  const tests = [
    [
      "should load with USD to EUR as initial currencies",
      shouldHaveUSDToEuroOnStart,
    ],
    ["should be able to swap between USD and EUR", shouldSwapBetweenUSDandEUR],
  ] as const;
  tests.forEach(([title, func]) =>
    test(title, async ({ page }) => {
      await page.goto("/");
      await func(page);
    }),
  );
});
