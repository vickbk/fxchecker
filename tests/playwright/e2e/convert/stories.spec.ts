import {
  shouldHaveUSDToEuroOnStart,
  shouldOpenReceiveSearchPopover,
  shouldOpenSendSearchPopover,
  shouldSearchForGBPAndSetItAsBaseCurrency,
  shouldSearchForJPYAndSetItAsQuoteCurrency,
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
    ["should open from search popover", shouldOpenSendSearchPopover],
    ["should open to search popover", shouldOpenReceiveSearchPopover],
    [
      "should search for GBP and set it as base currency",
      shouldSearchForGBPAndSetItAsBaseCurrency,
    ],
    [
      "should search for JPY and set it as quote currency",
      shouldSearchForJPYAndSetItAsQuoteCurrency,
    ],
  ] as const;
  tests.forEach(([title, func]) =>
    test(title, async ({ page }) => {
      await page.goto("/");
      await func(page);
    }),
  );
});
