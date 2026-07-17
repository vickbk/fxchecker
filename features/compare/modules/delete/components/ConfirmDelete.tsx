"use client";
import { useFormStatus } from "react-dom";

export const ConfirmDelete = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-lime-500 ${pending ? "opacity-50" : ""} text-background p-2 rounded-lg`}
    >
      {pending ? "Deleting... " : "Confirm "}
      <i
        className={`bi bi-${!pending ? "trash" : "arrow-repeat inline-block animate-spin"}`}
      />
    </button>
  );
};
