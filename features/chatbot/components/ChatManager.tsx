"use client";

import { LoadingPlaceholder } from "@/shared/utils";
import { useState } from "react";
import { useChatBot } from "../hooks/useChatbot";
import { ChatForm } from "./ChatForm";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";

export const ChatManager = () => {
  const { messages, handleSubmit, sendMessage, isLoading, stop, error } =
    useChatBot();
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
          <MessageList {...{ messages, isLoading, sendMessage, error }} />
          <ChatForm {...{ isLoading, handleSubmit, stop }} />
        </>
      ) : (
        <LoadingPlaceholder className="py-40 bg-card" />
      )}
    </article>
  );
};
