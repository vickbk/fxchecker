"use client";
import { useSignIn } from "../hooks/useSignInterceptor";
import { SignInTriggerProps } from "../types";

export const SignInTrigger = ({
  title,
  description,
  children,
  ...props
}: SignInTriggerProps) => {
  const { setDescriptions, ...descs } = useSignIn();
  return (
    <button
      type="button"
      popoverTarget="sign-in-dialog"
      {...props}
      onClick={() =>
        setDescriptions({
          title: title ?? descs.title,
          description: description ?? descs.description,
        })
      }
    >
      {children}
    </button>
  );
};
