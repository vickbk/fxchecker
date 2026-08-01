import { UIMessage } from "ai";

/**
 * Extracts plain text from an AI SDK v6 UIMessage.
 * Iterates the parts array for text parts; falls back to content for compatibility.
 */
export const getMessageText = (message: UIMessage): string => {
  if (message.parts?.length) {
    return message.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
  }
  return "";
};
