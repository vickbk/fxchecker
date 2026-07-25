import { AISparkleCurrencyIcon } from "../modules/icons";

const QUICK_PROMPTS = [
  "250 EUR to JPY",
  "Top market movers",
  "Compare 1k USD to EUR & GBP",
];

export const PromptSuggestion = () => {
  return (
    <div className="flex items-center justify-center p-2 flex-wrap gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
      {QUICK_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          //   onClick={() => handlePromptSelect(prompt)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors whitespace-nowrap shrink-0"
        >
          <AISparkleCurrencyIcon className="w-3 h-3 text-primary" />
          <span>{prompt}</span>
        </button>
      ))}
    </div>
  );
};
