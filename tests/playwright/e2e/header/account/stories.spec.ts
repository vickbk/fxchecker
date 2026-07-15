import {
  shouldCloseTheLoginDialogByClickingOutise,
  shouldSeeTheHeaderOnLoginModal,
} from "@/features/account/__testing__";
import test from "@playwright/test";

test.describe("Test account management", () => {
  test.describe("Interactivity with the dialog box", () => {
    test("should show the login dialog when requested", async ({ page }) => {
      await page.goto("/");
      await shouldSeeTheHeaderOnLoginModal(page);
    });
    test("should dismiss the login dialog when clicked outside it", async ({
      page,
    }) => {
      await page.goto("/");
      await shouldCloseTheLoginDialogByClickingOutise(page);
    });
  });
});
