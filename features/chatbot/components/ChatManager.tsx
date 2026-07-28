"use client";

import { LoadingPlaceholder } from "@/shared/utils";
import { useState } from "react";
import { useChatBot } from "../hooks/useChatbot";
import { ThinkingBubble } from "../modules/chat";
import { ClearButton } from "../modules/storage";
import { ChatForm } from "./ChatForm";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";

export const ChatManager = () => {
  const {
    messages,
    handleSubmit,
    sendMessage,
    isLoading,
    stop,
    error,
    clearHistory,
  } = useChatBot();
  const [isOpen, setOpen] = useState(false);
  return (
    <article
      className="chat__box"
      popover="auto"
      id="chat-box"
      onToggle={(e) => {
        setOpen(e.newState === "open");
      }}
    >
      <ChatHeader />
      {isOpen ? (
        <>
          {messages.length > 0 && <ClearButton handleClear={clearHistory} />}
          <MessageList {...{ messages, sendMessage }}>
            {isLoading && <ThinkingBubble />}
            {error && (
              <p className="p-2 bg-card text-red-500 text-center mt-auto rounded-lg">
                {error}
              </p>
            )}
          </MessageList>
          <ChatForm {...{ isLoading, handleSubmit, stop }} />
        </>
      ) : (
        <LoadingPlaceholder className="py-40 bg-card" />
      )}
    </article>
  );
};
