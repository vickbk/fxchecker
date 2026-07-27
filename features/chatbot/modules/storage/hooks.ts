import { UIMessage } from "ai";
import { useCallback, useEffect, useState } from "react";
import { clearAllMessages, getAllMessages, saveAllMessages } from "./utils";

export function useChatStorage() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const history = await getAllMessages();
        if (active) setMessages(history);
      } catch (error) {
        console.error("Failed to load local chat history:", error);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return {
    messages,
    loading,
    saveMessages: useCallback(async (messages: UIMessage[]) => {
      try {
        await saveAllMessages(messages);
        setMessages(await getAllMessages());
      } catch (error) {
        console.error(error);
      }
    }, []),
    clearHistory: useCallback(async () => {
      await clearAllMessages();
      setMessages([]);
    }, []),
  };
}
