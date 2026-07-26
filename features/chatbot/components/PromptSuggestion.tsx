import { Article, Heading } from "@/shared/heading";

const QUICK_PROMPTS = [
  "250 EUR to JPY",
  "Top market movers",
  "Compare 1k USD to EUR & GBP",
];

export const PromptSuggestion = ({
  sendMessage,
}: {
  sendMessage: (text: string) => void;
}) => {
  return (
    <Article className="grid gap-4 items center text-center">
      <Heading className="text-center uppercase font-bold text-2xl text-lime-500">
        Don&apos;t know where to start from?
      </Heading>
      <p>Pick one of the predifined prompts below</p>
      <ul className="flex items-center justify-center m-auto flex-wrap gap-2 overflow-x-auto no-scrollbar text-xs py-2">
        {QUICK_PROMPTS.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => sendMessage(prompt)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-lime-500 text-foreground outline transition-colors whitespace-nowrap shrink-0 action-btn"
            >
              <span>{prompt}</span>
            </button>
          </li>
        ))}
      </ul>
    </Article>
  );
};
