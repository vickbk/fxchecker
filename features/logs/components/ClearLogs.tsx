import { Heading } from "@/shared/heading";
import { BiIcon, LoadingSubmit } from "@/shared/utils";
import { clearAllLogs } from "../actions";

export const ClearLogs = () => {
  return (
    <form
      className="[position-area:bottom_span-left] p-4 rounded-lg bg-card text-center open:grid gap-4 max-w-xs"
      popover=""
      id="clear-logs"
      action={clearAllLogs as () => void}
    >
      <Heading className="uppercase font-bold text-xl text-lime-500">
        Clearing logs
      </Heading>
      <p>Are you sure you want to clear all your logged data?</p>
      <div className="flex justify-center gap-4">
        <LoadingSubmit
          text="Clearing"
          className="bg-lime-500 text-background p-2 rounded-lg"
        >
          <BiIcon name="trash" /> Clear
        </LoadingSubmit>
        <button type="button" popoverTarget="clear-logs">
          Cancel
        </button>
      </div>
    </form>
  );
};
