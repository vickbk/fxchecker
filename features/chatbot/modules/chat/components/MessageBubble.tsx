"use client";

import { BiIcon, joinClasses } from "@/shared/utils";
import { UIMessage } from "ai";
import { RefObject } from "react";
import ReactMarkdown from "react-markdown";
import { getMessageText } from "../utils";
import { MarkDown } from "./Markdown";

export const MessageBubble = ({
  message,
  scrollRef,
}: {
  message: UIMessage;
  scrollRef?: RefObject<HTMLDivElement>;
}) => {
  const isUser = message.role === "user";
  const messageText = getMessageText(message).trim();

  if (messageText.length === 0) return null;

  return (
    <div
      className={joinClasses(
        "flex gap-3 max-w-[85%]",
        isUser && "ml-auto flex-row-reverse",
      )}
      ref={scrollRef}
    >
      <div
        className={joinClasses(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-btn" : "bg-lime-500 text-background",
        )}
      >
        {isUser ? <BiIcon name="person-fill" /> : <BiIcon name="robot" />}
      </div>
      <div
        className={joinClasses(
          "p-3 rounded-2xl text-sm",
          isUser
            ? "bg-lime-500 text-background rounded-tr-none"
            : "bg-btn rounded-tl-none border border-card",
        )}
      >
        <ReactMarkdown components={MarkDown()}>{messageText}</ReactMarkdown>
      </div>
    </div>
  );
};
