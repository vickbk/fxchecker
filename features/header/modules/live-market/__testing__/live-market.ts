import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";

export async function shouldSeeLiveMarket(page: Page) {
  await shouldSee(page, /Live Market/i);
}
