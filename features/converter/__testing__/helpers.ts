import { clickButton, shouldNotSee, shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  ADD_FAVORITE_BUTTON,
  CHANGE_RECEIVE_TRIGGER,
  CHANGE_SEND_TRIGGER,
  CONVERTER_TITLE,
  CURRENT_RATE,
  EUR_USD_SWAP_TEXT,
  INITIAL_RECEIVE_EUR,
  INITIAL_SEND_USD,
  INITIAL_SWAP_TEXT,
  LOG_BUTTON,
  RECEIVE_HEADER,
  RECEIVE_USD_HEADING,
  SEND_EUR_HEADING,
  SEND_HEADER,
  SWAPPER_TEXT,
} from "./utils";

export async function shouldSeeTheConverterSection(page: Page) {
  await shouldSee(
    page,
    CONVERTER_TITLE,
    SEND_HEADER,
    CHANGE_SEND_TRIGGER,
    RECEIVE_HEADER,
    CHANGE_RECEIVE_TRIGGER,
    SWAPPER_TEXT,
    CURRENT_RATE,
    ADD_FAVORITE_BUTTON,
    LOG_BUTTON,
  );
}

export async function shouldHaveUSDToEuroOnStart(page: Page) {
  await shouldSee(
    page,
    INITIAL_SEND_USD,
    INITIAL_RECEIVE_EUR,
    INITIAL_SWAP_TEXT,
  );
}

export async function shouldSwapBetweenUSDandEUR(page: Page) {
  await shouldHaveUSDToEuroOnStart(page);

  await clickButton(page, INITIAL_SWAP_TEXT);

  await shouldNotSee(
    page,
    INITIAL_SEND_USD,
    INITIAL_RECEIVE_EUR,
    INITIAL_SWAP_TEXT,
  );

  await shouldSee(
    page,
    SEND_EUR_HEADING,
    RECEIVE_USD_HEADING,
    EUR_USD_SWAP_TEXT,
  );
}
