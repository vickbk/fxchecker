import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { SIGN_IN_BUTTON } from "./utils";

export async function shouldSeeLoginButton(page: Page) {
  await shouldSee(page, [SIGN_IN_BUTTON, 1]);
}
