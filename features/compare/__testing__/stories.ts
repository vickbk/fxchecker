import { Page } from "@playwright/test";
import { shouldSee } from "@vickbk/tests/playwright";
import { ADD_COMPARE_BTN, COMPARE_HEADING } from "./utils";

export async function shouldSeeCompareSection(page: Page) {
  await page.goto("/compare");
  await shouldSee(page, COMPARE_HEADING, ADD_COMPARE_BTN);
}
