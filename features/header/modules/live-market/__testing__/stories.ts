import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { EXCHANGE_ELEMENT_TEXT, LIVE_TITLE, LOADING_RATES_TEXT } from "./utils";

export async function shouldSeeLiveMarket(page: Page) {
  await shouldSee(page, LIVE_TITLE);
}

export async function shouldSeeLoadingMessage(page: Page) {
  await shouldSee(page, LOADING_RATES_TEXT);
}

export async function shouldSeeAtleastOneLiveExchangeRate(page: Page) {
  await shouldSee(page, [EXCHANGE_ELEMENT_TEXT, 1]);
}
