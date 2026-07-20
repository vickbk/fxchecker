import { clickButton, shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  EMPTY_LOGS_HEADING,
  EMPTY_LOGS_TEXT,
  EXPORT_CSV,
  LOG_SIGNIN_INTERCEPTOR_MESSAGE,
  LOGGED_CURRENCIES,
  MAIN_CONVERSION_LOGGER,
  NO_EMPTY_LOGS_HEADING,
} from "./utils";

export async function shouldSeeLogsSection(page: Page) {
  await page.goto("/logs");
  await shouldSee(page, NO_EMPTY_LOGS_HEADING, LOGGED_CURRENCIES, EXPORT_CSV);
}

export async function shouldSeeEmptyLogs(page: Page) {
  await page.goto("/logs");
  await shouldSee(
    page,
    EMPTY_LOGS_HEADING,
    EMPTY_LOGS_TEXT,
    MAIN_CONVERSION_LOGGER,
  );
}

export async function shouldSeeInterceptorMessageIfNotSignedIn(page: Page) {
  await shouldSee(page, MAIN_CONVERSION_LOGGER);
  await clickButton(page, MAIN_CONVERSION_LOGGER);
  await shouldSee(page, LOG_SIGNIN_INTERCEPTOR_MESSAGE);
}
