import { clickLink, shouldNotSee, shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import {
  CHANGE_PERCENTAGE,
  CLOSE_CARD,
  FIVE_YEARS,
  FIVE_YEARS_TITLE,
  HISTORY_TITLE,
  ONE_DAY,
  ONE_DAY_TITLE,
  ONE_MONTH,
  ONE_MONTH_TITLE,
  ONE_WEEK,
  ONE_WEEK_TITLE,
  ONE_YEAR,
  ONE_YEAR_TITLE,
  OPEN_CARD,
  THREE_MONTHS,
  THREE_MONTHS_TITLE,
} from "./utils";

export async function shouldSeeHistorySection(page: Page) {
  await shouldSee(
    page,
    HISTORY_TITLE,
    OPEN_CARD,
    CLOSE_CARD,
    CHANGE_PERCENTAGE,
  );
  await shouldSeePeriodMenue(page);
}

export async function shouldSeePeriodMenue(page: Page) {
  await shouldSee(
    page,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTHS,
    ONE_YEAR,
    FIVE_YEARS,
  );
}

export async function shouldNavigateBetweenDiffentChartPeriods(page: Page) {
  await shouldSeePeriodMenue(page);
  await clickLink(page, ONE_DAY);
  await shouldSee(page, ONE_DAY_TITLE);

  await clickLink(page, ONE_WEEK);
  await shouldNotSee(page, ONE_DAY_TITLE);
  await shouldSee(page, ONE_WEEK_TITLE);

  await clickLink(page, ONE_MONTH);
  await shouldNotSee(page, ONE_WEEK_TITLE);
  await shouldSee(page, ONE_MONTH_TITLE);

  await clickLink(page, THREE_MONTHS);
  await shouldNotSee(page, ONE_MONTH_TITLE);
  await shouldSee(page, THREE_MONTHS_TITLE);

  await clickLink(page, ONE_YEAR);
  await shouldNotSee(page, THREE_MONTHS_TITLE);
  await shouldSee(page, ONE_YEAR_TITLE);

  await clickLink(page, FIVE_YEARS);
  await shouldNotSee(page, ONE_YEAR_TITLE);
  await shouldSee(page, FIVE_YEARS_TITLE);
}
