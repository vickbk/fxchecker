"use client";
import { ButtonHTMLAttributes } from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthDescription } from "../types";

export const SignInTrigger = ({
  title,
  description,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & AuthDescription) => {
  const { setDescriptions, ...descs } = useAuth();
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
