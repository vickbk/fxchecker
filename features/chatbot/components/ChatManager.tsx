"use client";

import { useChatBot } from "../hooks/useChatbot";
import { ChatForm } from "./ChatForm";
import { MessageList } from "./MessageList";

export const ChatManager = () => {
  const { messages, handleSubmit, sendMessage, isLoading, stop, error } =
    useChatBot();
  return (
    <>
      <MessageList {...{ messages, isLoading, sendMessage, error }} />
      <ChatForm {...{ isLoading, handleSubmit, stop }} />
    </>
  );
};
