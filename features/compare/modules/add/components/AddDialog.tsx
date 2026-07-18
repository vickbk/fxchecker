import { Heading } from "@/shared/heading";
import { BiIcon, LoadingSubmit } from "@/shared/utils";
import { CurrencyList } from "./CurrencyList";

export const AddDialog = ({ action }: { action: (form: FormData) => void }) => {
  return (
    <form
      action={action}
      popover=""
      id="add-compare-dialog"
      className="add-compare"
    >
      <Heading className="uppercase text-center text-lime-500 text-xl">
        Add Currencies to compare to list
      </Heading>
      <CurrencyList />
      <LoadingSubmit
        className="p-2 px-4 rounded-lg bg-lime-500 text-background"
        text="Saving selection..."
      >
        Save selection <BiIcon name="floppy" />
      </LoadingSubmit>
    </form>
  );
};
