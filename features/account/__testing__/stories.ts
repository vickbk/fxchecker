import { clickBodyCorner, clickButton, shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { SIGN_IN_BUTTON, SIGN_IN_HEADER, SIGN_IN_WITH_GOOGLE } from "./utils";

export async function shouldSeeLoginButton(page: Page) {
  await shouldSee(page, [SIGN_IN_BUTTON, 1]);
}

export async function shouldSeeTheHeaderOnLoginModal(page: Page) {
  await clickButton(page, SIGN_IN_BUTTON);
  await shouldSee(page, SIGN_IN_HEADER, SIGN_IN_WITH_GOOGLE);
}

export async function shouldCloseTheLoginDialogByClickingOutise(page: Page) {
  await shouldSeeTheHeaderOnLoginModal(page);
  await clickBodyCorner(page);
}

export async function shouldLoginWithGoogle(page: Page) {
  await shouldSeeTheHeaderOnLoginModal(page);
  await clickButton(page, SIGN_IN_WITH_GOOGLE);
}
