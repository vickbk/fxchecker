import {
  lastAssistantMessageIsCompleteWithToolCalls,
  UIDataTypes,
  UIMessage,
  UITools,
} from "ai";

export async function sendAutomaticallyWhen(state: {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
}) {
  const toolCallRounds = state.messages.filter(
    (m) =>
      m.role === "assistant" && m.parts?.some((p) => p.type === "tool-call"),
  ).length;

  if (toolCallRounds >= 5) {
    console.warn("Max multi-step rounds reached. Halting automatic execution.");
    return false;
  }

  return lastAssistantMessageIsCompleteWithToolCalls(state);
}
