import { Page } from "@playwright/test";
import { shouldSee } from "./#inner";
import { SWITCH_TO_DARK } from "./utils";

export async function shouldSeeLightThemeSwitcher(page: Page) {
  await shouldSee(page, SWITCH_TO_DARK);
}

export async function shouldSeeDarkThemeSwitcher(page: Page) {
  await shouldSee(page, SWITCH_TO_DARK);
}
