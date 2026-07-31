import { clickButton, getButton, shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  EMPTY_LOGS_HEADING,
  EMPTY_LOGS_TEXT,
  LOG_SIGNIN_INTERCEPTOR_MESSAGE,
  MAIN_CONVERSION_LOGGER,
} from "./utils";

export async function shouldSeeEmptyLogs(page: Page) {
  await page.goto("/logs");
  await shouldSee(page, EMPTY_LOGS_HEADING, EMPTY_LOGS_TEXT);
  await getButton(page, MAIN_CONVERSION_LOGGER);
}

export async function shouldSeeInterceptorMessageIfNotSignedIn(page: Page) {
  await getButton(page, MAIN_CONVERSION_LOGGER);
  await clickButton(page, MAIN_CONVERSION_LOGGER);
  await shouldSee(page, LOG_SIGNIN_INTERCEPTOR_MESSAGE);
}
