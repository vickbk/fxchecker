// eslint-disable-next-line boundaries/dependencies
import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { COMPARE_TAB, FAVORITE_TAB, HISTORY_TAB, LOG_TAB } from "./utils";

export async function shouldSeeNavbar(page: Page) {
  await shouldSee(
    page,
    [HISTORY_TAB, 0],
    [COMPARE_TAB, 0],
    [LOG_TAB, 1],
    [FAVORITE_TAB, 1],
  );
}
