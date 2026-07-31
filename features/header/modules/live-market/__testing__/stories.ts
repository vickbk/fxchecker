import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { EXCHANGE_ELEMENT_TEXT, LIVE_TITLE } from "./utils";

export async function shouldSeeLiveMarket(page: Page) {
  await shouldSee(page, LIVE_TITLE);
}

export async function shouldSeeAtleastOneLiveExchangeRate(page: Page) {
  await shouldSee(page, [EXCHANGE_ELEMENT_TEXT, 1]);
}
