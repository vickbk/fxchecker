"use server";

import { config } from "@/shared/config";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { getPromptWithContext } from "./utils/prompts-helpers";

export async function chat(messages: UIMessage[]) {
  try {
    const result = await streamText({
      model: google(config.GEMINI_VERSION),
      messages: await convertToModelMessages(messages),
      system: getPromptWithContext(),
      stopWhen: stepCountIs(5),
      tools: {},
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
