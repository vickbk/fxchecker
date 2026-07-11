import { Page, expect } from "@playwright/test";

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
