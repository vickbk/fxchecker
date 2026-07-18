import { HTMLAttributes } from "react";

export type SignInDescription = { title?: string; description?: string };

export type SignInCtx = SignInDescription & {
  setDescriptions: (params: SignInDescription) => void;
};

export type SignInTriggerProps = HTMLAttributes<HTMLButtonElement> &
  SignInDescription & { type?: "button" | "submit" | "reset" };
