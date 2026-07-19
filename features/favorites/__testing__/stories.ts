import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { WITH_NO_FAVORITES_TEXT, WITH_NO_FAVORITES_TITLE } from "./utils";

export async function shouldSeeEmptyFavoriteSection(page: Page) {
  await page.goto("/favorites");
  await shouldSee(page, WITH_NO_FAVORITES_TITLE, WITH_NO_FAVORITES_TEXT);
}
