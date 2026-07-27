import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useActionState, useCallback, useState } from "react";
import { useChatStorage } from "../modules/storage";
import { sendAutomaticallyWhen } from "../utils/for-hooks";

export function useChatBot() {
  const [error, setError] = useState<string | null>(null);
  const { saveMessages, messages, clearHistory } = useChatStorage();
  const { sendMessage, status, stop, setMessages } = useChat({
    onError: (err) => {
      if ("status" in err && err.status === 429) {
        setError("FinBot is at capacity. Please wait a moment...");
      } else setError("Something went wrong. Please try again.");
    },
    onFinish: ({ messages }) => {
      saveMessages(messages);
    },
    sendAutomaticallyWhen,
    transport: new DefaultChatTransport({ api: "/api/chat", body: {} }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const [, handleSubmit] = useActionState((_: unknown, formData: FormData) => {
    const text = (formData.get("text") as string) ?? "";
    if (!text.trim() || isLoading) return;

    setError(null);
    sendMessage({ text });
  }, null);

  return {
    isLoading,
    handleSubmit,
    stop,
    messages,
    error,
    sendMessage: useCallback(
      (text: string) => {
        setError(null);
        sendMessage({ text });
      },
      [sendMessage],
    ),
    clearHistory() {
      setMessages([]);
      clearHistory();
    },
  };
}
