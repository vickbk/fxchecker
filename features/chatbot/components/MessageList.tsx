import { UIDataTypes, UIMessage, UITools } from "ai";
import { MessageBubble } from "../modules/chat";
import { PromptSuggestion } from "./PromptSuggestion";

export const MessageList = ({
  messages,
  sendMessage,
  error,
}: {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  sendMessage: (text: string) => void;
  error: string | null;
}) => {
  const { length } = messages;
  return (
    <div className="min-h-64  max-w-full flex flex-col gap-2 p-4">
      {length === 0 && <PromptSuggestion sendMessage={sendMessage} />}
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLast={index === length - 1}
        />
      ))}
      {error && (
        <p className="p-2 bg-card text-red-500 text-center mt-auto rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
};
