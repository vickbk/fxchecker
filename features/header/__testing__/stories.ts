import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  shouldSeeAtleastOneLiveExchangeRate,
  shouldSeeLiveMarket,
} from "../modules/live-market/__testing__";
import { ECB_TEXT, EOD_TEXT, PAGE_TITLE } from "./utils";

export async function shouldSeePageTitle(page: Page) {
  await shouldSee(page, PAGE_TITLE, EOD_TEXT, ECB_TEXT);
  await shouldSeeLiveMarket(page);
}

export async function shouldSeeLiveMarketWithloadedData(page: Page) {
  await shouldSeeAtleastOneLiveExchangeRate(page);
}
