import { HTMLAttributes } from "react";

export type AuthDescription = { title?: string; description?: string };

export type SignInTriggerProps = HTMLAttributes<HTMLButtonElement> &
  AuthDescription;
