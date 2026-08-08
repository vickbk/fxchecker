import { expect, Page } from "@playwright/test";

export async function shouldHaveCorrectLevelHeading(page: Page) {
  await expect(page).toBeValidHeadingHierarchy();
}
