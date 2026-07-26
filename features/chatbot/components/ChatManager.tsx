"use client";

import { useChatBot } from "../hooks/useChatbot";
import { ChatForm } from "./ChatForm";
import { MessageList } from "./MessageList";

export const ChatManager = () => {
  const { messages, handleSubmit, sendMessage, isLoading } = useChatBot();
  return (
    <>
      <MessageList {...{ messages, isLoading, sendMessage }} />
      <ChatForm {...{ isLoading, handleSubmit }} />
    </>
  );
};
