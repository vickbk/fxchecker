import { UIDataTypes, UIMessage, UITools } from "ai";
import { MessageBubble } from "../modules/chat";
import { PromptSuggestion } from "./PromptSuggestion";

export const MessageList = ({
  messages,
}: {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  sendMessage: (text: string) => void;
}) => {
  return (
    <div className="min-h-96 max-w-full flex flex-col gap-2 p-4">
      {messages.length === 0 && <PromptSuggestion />}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
};
