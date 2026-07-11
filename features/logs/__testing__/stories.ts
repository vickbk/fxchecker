import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { EXPORT_CSV, LOGGED_CURRENCIES, LOGS_HEADING } from "./utils";

export async function shouldSeeLogsSection(page: Page) {
  await page.goto("/logs");
  await shouldSee(page, LOGS_HEADING, LOGGED_CURRENCIES, EXPORT_CSV);
}
