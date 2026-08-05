import { Heading } from "@/shared/heading";
import { BiIcon, LoadingSubmit } from "@/shared/utils";
import { CurrencyList } from "./CurrencyList";

export const AddForm = ({ action }: { action: (form: FormData) => void }) => {
  return (
    <form action={action}>
      <Heading className="uppercase text-center text-lime-500 text-xl">
        Add Currencies to compare to list
      </Heading>
      <CurrencyList />
      <LoadingSubmit
        className="p-2 px-4 rounded-lg action-btn bg-lime-500 text-background add-compare__submit"
        text="Saving selection..."
      >
        Save selection <BiIcon name="floppy" />
      </LoadingSubmit>
    </form>
  );
};
