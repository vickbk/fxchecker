import { Page, expect } from "@playwright/test";
import { TEXT_PATTERN } from "./types";

export const shouldSee = async (page: Page, ...texts: (string | RegExp)[]) => {
  for (const text of texts) {
    const locator =
      typeof text === "string"
        ? page.getByText(text, { exact: false })
        : page.getByText(text);
    await expect(locator.first()).toBeVisible();
  }
};

export const shouldNotSee = async (
  page: Page,
  ...texts: (string | RegExp)[]
) => {
  for (const text of texts) {
    const locator =
      typeof text === "string"
        ? page.getByText(text, { exact: false })
        : page.getByText(text);
    await expect(locator.first()).toBeHidden();
  }
};

export function getLocatorByText(
  page: Page,
  [locator, hasText]: [string, TEXT_PATTERN],
) {
  return page.locator(locator, { hasText });
}

export function getButton(page: Page, hasText: TEXT_PATTERN) {
  return getLocatorByText(page, ["button", hasText]);
}

export async function clickButton(page: Page, hasText: TEXT_PATTERN) {
  await getButton(page, hasText).click();
}
