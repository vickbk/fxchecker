import { Header, Heading } from "@/shared/heading";
import { BiIcon, SROnly } from "@/shared/utils";
import { FinancialBotIcon } from "../modules/icons";

export const ChatHeader = () => {
  return (
    <Header className="flex justify-between items-center gap-2 bg-lime-500 text-background p-2 sticky top-0">
      <span className="flex items-center relative px-2 aspect-square rounded-full text-primary border-2">
        <FinancialBotIcon className="w-5 h-5" />
      </span>
      <Heading className="flex flex-col">
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-sm tracking-tight">FINBOT</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-lime-500 bg-background uppercase tracking-wider">
            {" "}
            AI{" "}
          </span>
        </span>
        <span className="text-xs text-background-secondary">
          Your Personal FX Assistant
        </span>
      </Heading>
      <button
        type="button"
        popoverTarget="chat-box"
        className="p-2 action-btn hover:text-red-500"
      >
        <SROnly>Close chatbot</SROnly>
        <BiIcon name="x-lg" />
      </button>
    </Header>
  );
};
