import { expect, test } from "@playwright/test";

test.describe("Navigation bar", () => {
  ["/", "/compare", "/features", "/logs"].forEach((path) =>
    test(`heading levels should be correct navigating to "${path}" `, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page).toHaveValidHeadingHierarchy();
    }),
  );
});
