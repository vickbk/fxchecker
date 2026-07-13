import type {
  LABEL_LOCATOR,
  TEXT_MATCHER,
  TEXT_PATTERN,
} from "@/tests/common/types";
import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export async function shouldSee(page: Page, ...textes: TEXT_MATCHER[]) {
  for (const text of textes) {
    if (Array.isArray(text)) {
      const [matcher, nth] = text;
      await expect(page.getByText(matcher).nth(nth)).toBeVisible();
    } else {
      await expect(page.getByText(text)).toBeVisible();
    }
  }
}

export async function shouldNotSee(page: Page, ...textes: TEXT_MATCHER[]) {
  for (const text of textes) {
    if (Array.isArray(text)) {
      const [matcher, nth] = text;
      await expect(page.getByText(matcher).nth(nth)).not.toBeVisible();
    } else {
      await expect(page.getByText(text)).not.toBeVisible();
    }
  }
}

export async function fillLocatorWith(locator: Locator, value: string) {
  await locator.click();
  await locator.fill(value);
}

export async function setLocatorValue(
  page: Page,
  [locator, value]: LABEL_LOCATOR,
) {
  const element = page.locator("label", { hasText: locator });
  await element.click();
  await element.fill(value);
}

export async function setValueForLocators(
  page: Page,
  locatorsAndValues: LABEL_LOCATOR[],
) {
  for (const locatorAndValue of locatorsAndValues) {
    await setLocatorValue(page, locatorAndValue);
  }
}

export function getLocatorByText(
  page: Page,
  [locator, hasText]: [string, TEXT_PATTERN],
) {
  return page.locator(locator, { hasText });
}

export function getButton(page: Page, hasText: TEXT_PATTERN) {
  return getLocatorByText(page, ["button", hasText]);
}

export function getLabel(page: Page, hasText: TEXT_PATTERN) {
  return getLocatorByText(page, ["label", hasText]);
}

export function getLink(page: Page, hasText: TEXT_PATTERN) {
  return page.getByRole("link", { name: hasText });
}

export async function clickButton(page: Page, hasText: TEXT_PATTERN) {
  await getButton(page, hasText).click();
}

export async function clickLink(page: Page, hasText: TEXT_PATTERN) {
  await getLink(page, hasText).click();
}

export async function clickLabelInput(page: Page, labelText: TEXT_PATTERN) {
  const label = getLabel(page, labelText);
  await label.click();
}

export async function clickMultipleLabelInputs(
  page: Page,
  labelTexts: TEXT_PATTERN[],
) {
  for (const labelText of labelTexts) {
    await clickLabelInput(page, labelText);
  }
}

export async function isChecked(
  page: Page,
  selector: string,
): Promise<Locator> {
  const locator = page.locator(selector);
  await expect(locator).toBeChecked();
  return locator;
}

export async function isNotChecked(
  page: Page,
  selector: string,
): Promise<Locator> {
  const locator = page.locator(selector);
  await expect(locator).not.toBeChecked();
  return locator;
}
