import { clickButton, shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { CHAT_TRIGGER, CLOSE_CHAT_TRIGGER, FIN_BOT_AI_HEADER } from "./utils";

export async function shouldSeeChatbotOpenButton(page: Page) {
  await shouldSee(page, CHAT_TRIGGER);
}

export async function shouldOpenAndCloseChatbot(page: Page) {
  await clickButton(page, CHAT_TRIGGER);
  await shouldSee(
    page,
    FIN_BOT_AI_HEADER,
    [CLOSE_CHAT_TRIGGER, 0],
    [CLOSE_CHAT_TRIGGER, 1],
  );
  //   await clickButton(page,CLOSE_CHAT_TRIGGER)
}
