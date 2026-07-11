import { PAGE_TITLE } from "@/tests/common/utils/constants";
import { test } from "@playwright/test";
import { shouldSee } from "../utils/dsl";

test("has title", async ({ page }) => {
  await page.goto("/");

  await shouldSee(page, PAGE_TITLE);
});
