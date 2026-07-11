import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  CHANGE_PERCENTAGE,
  CLOSE_CARD,
  HISTORY_TITLE,
  OPEN_CARD,
} from "./utils";

export async function shouldSeeHistorySection(page: Page) {
  await shouldSee(
    page,
    HISTORY_TITLE,
    OPEN_CARD,
    CLOSE_CARD,
    CHANGE_PERCENTAGE,
  );
}
