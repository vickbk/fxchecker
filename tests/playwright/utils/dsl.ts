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

export const userClicks = async (page: Page, target: string | RegExp) => {
  let locator =
    typeof target === "string"
      ? page.getByRole("button", { name: target })
      : page.getByRole("button", { name: target });

  if ((await locator.count()) === 0) {
    locator =
      typeof target === "string"
        ? page.getByText(target, { exact: false })
        : page.getByText(target);
  }

  await locator.first().click();
};

export const userTypes = async (
  page: Page,
  target: string | RegExp,
  text: string,
) => {
  let locator =
    typeof target === "string"
      ? page.getByLabel(target)
      : page.getByLabel(target);

  if ((await locator.count()) === 0) {
    locator =
      typeof target === "string"
        ? page.getByPlaceholder(target)
        : page.getByPlaceholder(target);
  }

  await locator.first().fill(text);
};
