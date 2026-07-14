import { themeTests } from "@/shared/theme/__testing__";
import test from "@playwright/test";

function pathToPage(path: string) {
  return { name: path.substring(1) || "history", path };
}
test.describe("Theme Switching accross all pages", () => {
  const paths = ["/", "/compare", "/favorites", "/logs"] as const;

  test.describe("Prefers Light Mode", () => {
    paths.map(pathToPage).forEach(({ name, path }) => {
      themeTests.light.forEach(([t, func]) =>
        test(`${name} - ${t}`, async ({ page }) => {
          await page.goto(path);
          await func(page);
        }),
      );
    });
  });

  test.describe("Prefers Dark Mode", () => {
    test.use({ colorScheme: "dark" });

    paths.map(pathToPage).forEach(({ name, path }) => {
      themeTests.dark.forEach(([t, func]) =>
        test(`${name} - ${t}`, async ({ page }) => {
          await page.goto(path);
          await func(page);
        }),
      );
    });
  });
});
