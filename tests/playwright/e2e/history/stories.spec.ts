import { shouldNavigateBetweenDiffentChartPeriods } from "@/features/history/__testing__";
import test from "@playwright/test";
import { runSimilarTests } from "@vickbk/tests/playwright";

test.describe("Basic History Tests", () => {
  runSimilarTests([
    "should navigate between different chart periods",
    shouldNavigateBetweenDiffentChartPeriods,
  ]);
});
