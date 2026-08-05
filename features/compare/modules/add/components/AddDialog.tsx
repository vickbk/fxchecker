import { AddForm } from "./AddForm";
import { DialogWapper } from "./DialogWrapper";

export const AddDialog = ({ action }: { action: (form: FormData) => void }) => {
  return (
    <DialogWapper>
      <AddForm action={action} />
    </DialogWapper>
  );
};
