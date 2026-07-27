import { BiIcon, SROnly } from "@/shared/utils";

export const ThinkingBubble = () => {
  return (
    <div className="chat-bubble">
      <div className="chat-bubble__avatar">
        <BiIcon name="robot" />
      </div>
      <p className="chat-bubble__content thinking" aria-live="polite">
        <SROnly>FinBot Currently thinking... hold on</SROnly>
        <span className="thinking__dot" />
        <span className="thinking__dot" />
        <span className="thinking__dot" />
      </p>
    </div>
  );
};
