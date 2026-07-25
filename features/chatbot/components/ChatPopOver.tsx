import { BiIcon, SROnly } from "@/shared/utils";
import { ChatForm } from "./ChatForm";
import { ChatHeader } from "./ChatHeader";
import { PromptSuggestion } from "./PromptSuggestion";

export const ChatPopOver = () => {
  return (
    <div className="chat">
      <article className="chat__box" popover="auto" id="chat-box">
        <ChatHeader />
        <PromptSuggestion />
        <ChatForm />
      </article>
      <button className="chat__btn" type="button" popoverTarget="chat-box">
        <span className="chat__open">
          <SROnly>Open ChatBot</SROnly>
          <BiIcon name="chat-left-fill" />
        </span>
        <span className="chat__close">
          <SROnly>Close Chatbot</SROnly>
          <BiIcon name="x-lg" />
        </span>
      </button>
    </div>
  );
};
