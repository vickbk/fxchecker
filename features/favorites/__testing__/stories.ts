import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  CLEAR_FAVORITES,
  FAVORITES_TITLE,
  TOTAL_FAVORITES_COUNTS,
} from "./utils";

export async function shouldSeeFavoriteFunction(page: Page) {
  await page.goto("/favorites");
  await shouldSee(
    page,
    FAVORITES_TITLE,
    TOTAL_FAVORITES_COUNTS,
    CLEAR_FAVORITES,
  );
}
