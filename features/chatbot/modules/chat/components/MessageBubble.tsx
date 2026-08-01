"use client";

import { BiIcon, joinClasses, scrollIntoView } from "@/shared/utils";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { getMessageText } from "../utils";
import { MarkDown } from "./Markdown";

export const MessageBubble = ({
  message,
  isLast,
}: {
  message: UIMessage;
  isLast?: boolean;
}) => {
  const isUser = message.role === "user";
  const messageText = getMessageText(message).trim();

  if (messageText.length === 0) return null;

  return (
    <div
      className={joinClasses("chat-bubble", isUser && "chat-bubble--user")}
      ref={isLast ? scrollIntoView : null}
    >
      <div className={"chat-bubble__avatar"}>
        {isUser ? <BiIcon name="person-fill" /> : <BiIcon name="robot" />}
      </div>
      <div
        className="chat-bubble__content"
        aria-live={isLast && !isUser ? "polite" : undefined}
      >
        <ReactMarkdown components={MarkDown()}>{messageText}</ReactMarkdown>
      </div>
    </div>
  );
};
