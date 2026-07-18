"use client";
import { HTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

export const LoadingSubmit = ({
  text = "Submitting...",
  icon = "arrow-repeat",
  children,
  ...props
}: {
  text?: string;
  icon?: string;
} & HTMLAttributes<HTMLButtonElement>) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      {...props}
      disabled={pending}
      className={(props.className ?? "") + (pending ? " opacity-50" : "")}
    >
      {!pending ? (
        children
      ) : (
        <>
          {text} <i className={`bi bi-${icon} inline-block animate-spin`} />
        </>
      )}
    </button>
  );
};
