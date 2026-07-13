import { shouldNavigateBetweenDiffentChartPeriods } from "@/features/history/__testing__";
import test from "@playwright/test";
import { SimpleTest } from "../../types";

test.describe("Basic History Tests", () => {
  (
    [
      [
        "should navigate between different chart periods",
        shouldNavigateBetweenDiffentChartPeriods,
      ],
    ] as SimpleTest[]
  ).forEach(([title, func]) =>
    test(title, async ({ page }) => {
      await page.goto("/");
      await func(page);
    }),
  );
});
