import { Heading } from "@/shared/heading";
import { ConfirmDelete } from "./ConfirmDelete";

export const CompareDelete = ({
  quote,
  name = "Unknown Currency name",
  deleteAction,
}: {
  quote: string;
  name?: string;
  deleteAction: (form: FormData) => void;
}) => {
  return (
    <form
      action={deleteAction}
      popover=""
      id={`delete-${quote}`}
      className={`bg-background/80 shadow-xs shadow-background-secondary max-w-sm text-foreground-secondary p-4 open:grid gap-4 rounded-lg [position-anchor:--delete${quote}] [position-area:bottom_span-left] [position-try:flip-block]`}
    >
      <Heading className="uppercase text-center text-lg font-bold text-lime-500">
        Compare currency deletion ({quote})
      </Heading>
      <p>
        Are you sure you want to delete {quote} ({name}) from your compare list?
      </p>
      <fieldset className="flex justify-center items-center gap-4">
        <ConfirmDelete />
        <button type="button" popoverTarget={"delete-" + quote}>
          Cancel
        </button>
      </fieldset>
    </form>
  );
};
