import { Heading } from "@/shared/heading";
import { BiIcon } from "@/shared/utils";
import { CurrencyList } from "./CurrencyList";

export const AddDialog = () => {
  return (
    <form
      popover=""
      id="add-compare-dialog"
      className="bg-card rounded-lg p-4 top-2"
    >
      <Heading className="uppercase text-center text-lime-500 text-xl">
        Add Currencies to compare to list
      </Heading>
      <CurrencyList />
      <button
        type="submit"
        className="p-2 px-4 rounded-lg bg-lime-500 text-background"
      >
        Save selection <BiIcon name="floppy" />
      </button>
    </form>
  );
};
