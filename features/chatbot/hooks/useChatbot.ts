import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useState } from "react";
import { useChatStorage } from "../modules/storage";
import { sendAutomaticallyWhen, shouldRefresh } from "../utils/for-hooks";

export function useChatBot() {
  const [error, setError] = useState<string | null>(null);
  const { saveMessages, messages, clearHistory } = useChatStorage();
  const router = useRouter();
  const {
    sendMessage,
    messages: chatMessages,
    status,
    stop,
    setMessages,
  } = useChat({
    messages,
    onError: (err) => {
      if ("status" in err && err.status === 429) {
        setError("FinBot is at capacity. Please wait a moment...");
      } else setError("Something went wrong. Please try again.");
    },
    onFinish({ messages, message }) {
      saveMessages(messages);

      if (shouldRefresh(message.parts)) router.refresh();
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

  useEffect(() => {
    const lastMessage = chatMessages.at(-1);
    if (lastMessage?.role === "user") saveMessages(chatMessages);
  }, [chatMessages, saveMessages, status]);
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
