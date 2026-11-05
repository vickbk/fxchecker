import { getRandomElement } from "@/shared/random";
import { themeTests } from "@/shared/theme/__testing__";
import test from "@playwright/test";

function pathToPage(path: string) {
  return { name: path.substring(1) || "history", path };
}
test.describe("Theme Switching accross all pages", () => {
  const paths = ["/", "/compare", "/favorites", "/logs"].map(pathToPage);

  test.describe("Prefers Light Mode", () => {
    const { path } = getRandomElement(paths);

    themeTests.light.forEach(([testName, testFunction]) =>
      test(testName, async ({ page }) => {
        await page.goto(path);
        await testFunction(page);
      }),
    );
  });

  test.describe("Prefers Dark Mode", () => {
    test.use({ colorScheme: "dark" });

    const { path } = getRandomElement(paths);

    themeTests.dark.forEach(([testName, testFunction]) =>
      test(testName, async ({ page }) => {
        await page.goto(path);
        await testFunction(page);
      }),
    );
  });
});
