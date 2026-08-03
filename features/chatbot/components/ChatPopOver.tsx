import { BiIcon, SROnly } from "@/shared/utils";
import { Suspense } from "react";
import { ChatManager } from "./ChatManager";

export const ChatPopOver = async () => {
  return (
    <div className="chat">
      <Suspense>
        <ChatManager />
      </Suspense>
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
