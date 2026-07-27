"use server";

import { config } from "@/shared/config";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  Tool,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { compare_currencies } from "./tools/compare-currencies";
import { convert_currency } from "./tools/convert-currency";
import { get_rate_history } from "./tools/get-rate-history";
import { get_currencies, search_currency } from "./tools/search-currencies";
import { buildSystemPrompt } from "./utils/prompts-helpers";

export async function chat({
  messages,
  tools,
}: {
  messages: UIMessage[];
  tools?: Record<string, Tool>;
}) {
  try {
    const result = await streamText({
      model: google(config.GEMINI_VERSION),
      messages: await convertToModelMessages(messages),
      system: buildSystemPrompt(),
      stopWhen: stepCountIs(5),
      tools: {
        ...tools,
        convert_currency,
        compare_currencies,
        get_rate_history,
        search_currency,
        get_currencies,
      },
    });

    return createUIMessageStreamResponse({ stream: toUIMessageStream(result) });
  } catch (error: unknown) {
    if ((error as { status: number })?.status === 429) {
      console.error(
        "Gemini Free Tier Rate Limit Reached (429):",
        (error as Error).message,
      );
      return new Response(
        JSON.stringify({
          error: "CineBot is at capacity. Please wait a moment...",
        }),
        {
          status: 429,
          headers: { "content-type": "application/json" },
        },
      );
    }

    throw error;
  }
}
