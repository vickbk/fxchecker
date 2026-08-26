import { TEXT_PATTERN } from "@/tests/common";
import {
  clickBodyCorner,
  clickLabelInput,
  fillLocatorWith,
  shouldNotSee,
  shouldSee,
} from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  FAVORITES_HEADER,
  OTHER_CURRENCIES_HEADER,
  SEARCH_BASE_PLACEHOLDER,
  SEARCH_CURRENCY_LABEL,
  SEARCH_QUOTE_PLACEHOLDER,
} from "./utils";

export async function shouldSeeSearchOptions(page: Page, index = 0) {
  await shouldSee(
    page,
    [SEARCH_CURRENCY_LABEL, index],
    FAVORITES_HEADER,
    OTHER_CURRENCIES_HEADER,
  );
}

export async function shouldSearchForCurrencyAndSelectIt(
  page: Page,
  {
    search,
    matcher = search,
    isSend = false,
  }: { search: string; matcher?: TEXT_PATTERN; isSend?: boolean },
) {
  const input = await page.getByPlaceholder(
    isSend ? SEARCH_BASE_PLACEHOLDER : SEARCH_QUOTE_PLACEHOLDER,
  );
  await fillLocatorWith(input, search);

  await shouldSee(page, matcher);
  await clickLabelInput(page, matcher);
  await clickBodyCorner(page);

  await shouldNotSee(page, FAVORITES_HEADER, OTHER_CURRENCIES_HEADER);
}
