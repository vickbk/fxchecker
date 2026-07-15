import { Page } from "@playwright/test";
import { clickButton, shouldSee } from "./#inner";
import { SWITCH_TO_DARK, SWITCH_TO_LIGHT } from "./utils";

export async function shouldSeeLightThemeSwitcher(page: Page) {
  await shouldSee(page, SWITCH_TO_LIGHT);
}

export async function shouldSeeDarkThemeSwitcher(page: Page) {
  await shouldSee(page, SWITCH_TO_DARK);
}

async function switchToLight(page: Page) {
  await clickButton(page, SWITCH_TO_LIGHT);
  await shouldSee(page, SWITCH_TO_DARK);
}

async function switchToDark(page: Page) {
  await clickButton(page, SWITCH_TO_DARK);
  await shouldSee(page, SWITCH_TO_LIGHT);
}

export async function inPrefersDarkShouldLoadPageInDarkMode(page: Page) {
  await shouldSee(page, SWITCH_TO_LIGHT);
}

export async function inPrefersDarkShouldSwitchToLight(page: Page) {
  await switchToLight(page);
}

export async function inPrefersDarkLightModeShouldPersistAfterPageRefresh(
  page: Page,
) {
  await switchToLight(page);
  await page.reload();
  await shouldSee(page, SWITCH_TO_DARK);
}

export async function inPrefersDarkShouldSwitchBackToDarkAfterSwitchingToLight(
  page: Page,
) {
  await switchToLight(page);
  await switchToDark(page);
}

export async function inPrefersDarkAfterMultipleSwitchDarkShouldPersistOnPageReload(
  page: Page,
) {
  await switchToLight(page);
  await page.reload();
  await shouldSee(page, SWITCH_TO_DARK);

  await switchToDark(page);
  await shouldSee(page, SWITCH_TO_LIGHT);

  await page.reload();
  await shouldSee(page, SWITCH_TO_LIGHT);
}

export async function inPrefersLightPageShouldStartInLightTheme(page: Page) {
  await shouldSee(page, SWITCH_TO_DARK);
}

export async function inPrefersLightShouldSwitchToDark(page: Page) {
  await switchToDark(page);
}

export async function inPrefersLightDarkThemeShouldPersistOnPageReload(
  page: Page,
) {
  await switchToDark(page);
  await page.reload();
  await shouldSee(page, SWITCH_TO_LIGHT);
}

export async function inPrefersLightThemeShouldReturnToLightAfterBeingDark(
  page: Page,
) {
  await switchToDark(page);
  await switchToLight(page);
}

export async function inPrefersLightLightThemeShouldPersistAfterPageRefresh(
  page: Page,
) {
  await switchToDark(page);
  await page.reload();
  await shouldSee(page, SWITCH_TO_LIGHT);

  await switchToLight(page);
  await shouldSee(page, SWITCH_TO_DARK);

  await page.reload();
  await shouldSee(page, SWITCH_TO_DARK);
}

export const themeTests = {
  light: [
    [
      "Page should start in light theme",
      inPrefersLightPageShouldStartInLightTheme,
    ],
    ["Theme should change to dark", inPrefersLightShouldSwitchToDark],
    [
      "Dark theme should persist on page reload",
      inPrefersLightDarkThemeShouldPersistOnPageReload,
    ],
    [
      "After switching to dark, user should be able to switch back to light",
      inPrefersLightThemeShouldReturnToLightAfterBeingDark,
    ],
    [
      "After switching back to light, theme should persist on page refresh",
      inPrefersLightLightThemeShouldPersistAfterPageRefresh,
    ],
  ],
  dark: [
    ["Page should start in dark theme", inPrefersDarkShouldLoadPageInDarkMode],
    ["Page should switch to light theme", inPrefersDarkShouldSwitchToLight],
    [
      "Page should persist light theme on page refresh",
      inPrefersDarkLightModeShouldPersistAfterPageRefresh,
    ],
    [
      "Page should switch back to dark after switching to light",
      inPrefersDarkShouldSwitchBackToDarkAfterSwitchingToLight,
    ],
    [
      "Page should persist dark theme after switching to light",
      inPrefersDarkAfterMultipleSwitchDarkShouldPersistOnPageReload,
    ],
  ],
} as const;
