import { PAGE_TITLE } from "@/tests";
import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { shouldSeeLiveMarket } from "../modules/live-market/__testing__";

export async function shouldSeePageTitle(page: Page) {
  await shouldSee(page, PAGE_TITLE, /EOD/i);
  await shouldSeeLiveMarket(page);
}
