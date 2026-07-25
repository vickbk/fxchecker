import { BiIcon, SROnly } from "@/shared/utils";

export const ChatForm = () => {
  return (
    <form className="flex items-center justify-end gap-2 p-2 sticky bottom-0">
      <label className="relative flex-1 bg-muted/50 focus-within:bg-background border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 rounded-xl transition-all">
        <SROnly>Chat input prompt</SROnly>
        <textarea
          // ref={textareaRef}
          rows={1}
          // value={input}
          // onChange={(e) => setInput(e.target.value)}
          // onKeyDown={handleKeyDown}
          name="prompt"
          placeholder="Ask FINBOT about rates, trends, conversions..."
          // disabled={disabled}
          className="w-full p-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none max-h-30 min-h-10"
        />
      </label>

      {false ? (
        <button
          type="button"
          // onClick={onStop}
          className="p-2  rounded-xl text-destructive self-center action-btn text-red-500 border border-destructive/20 transition-colors shrink-0"
        >
          <SROnly>Stop generation</SROnly>
          <BiIcon name="square-fill" />
        </button>
      ) : (
        <button
          type="submit"
          // disabled={!input.trim() || disabled}
          className="p-2 rounded-xl bg-lime text-background action-btn transition-all shadow-sm shrink-0"
        >
          <SROnly>Send prompt</SROnly>
          <BiIcon name="send" />
        </button>
      )}
    </form>
  );
};
