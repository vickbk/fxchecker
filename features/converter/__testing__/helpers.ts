import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  CONVERTER_TITLE,
  CURRENT_RATE,
  FAVORITE_BUTTON,
  LOG_BUTTON,
  RECEIVE_HEADER,
  SEND_HEADER,
  SWAPPER_TEXT,
} from "./utils";

export async function shouldSeeTheConverterSection(page: Page) {
  await shouldSee(
    page,
    CONVERTER_TITLE,
    SEND_HEADER,
    RECEIVE_HEADER,
    SWAPPER_TEXT,
    CURRENT_RATE,
    FAVORITE_BUTTON,
    LOG_BUTTON,
  );
}
