import { BiIcon, SROnly } from "@/shared/utils";

export const ChatForm = ({
  handleSubmit,
  isLoading,
}: {
  isLoading: boolean;
  handleSubmit: (formdata: FormData) => void;
}) => {
  return (
    <form
      className="flex [align-items:start] justify-end gap-2 p-2 sticky bottom-0"
      action={handleSubmit}
    >
      <label className="relative flex-1 bg-muted/50 focus-within:bg-background border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 rounded-xl transition-all">
        <SROnly>Chat input prompt</SROnly>
        <textarea
          // ref={textareaRef}
          rows={1}
          autoFocus
          // value={input}
          // onChange={(e) => setInput(e.target.value)}
          // onKeyDown={handleKeyDown}
          name="text"
          placeholder="Ask FINBOT about rates, trends, conversions..."
          disabled={isLoading}
          className="w-full p-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none max-h-30 min-h-10"
        />
      </label>

      {isLoading ? (
        <button
          type="button"
          // onClick={onStop}
          className="px-2 aspect-square rounded-full text-red-500 action-btn bg-background border border-red-500 transition-colors shrink-0"
        >
          <SROnly>Stop generation</SROnly>
          <BiIcon name="square-fill" />
        </button>
      ) : (
        <button
          type="submit"
          // disabled={!input.trim() || disabled}
          className="px-2 aspect-square rounded-full bg-lime-500 text-background action-btn transition-all shadow-sm shrink-0"
        >
          <SROnly>Send prompt</SROnly>
          <BiIcon name="send-fill" />
        </button>
      )}
    </form>
  );
};
