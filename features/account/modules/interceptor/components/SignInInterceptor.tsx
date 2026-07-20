"use client";
import { useSession } from "next-auth/react";
import { MouseEvent, useTransition } from "react";
import { SignInTriggerProps } from "../types";
import { SignInTrigger } from "./SignInTrigger";

export const SignInInterceptor = ({
  onClick,
  children,
  type = "button",
  description,
  ...props
}: SignInTriggerProps) => {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isPending) return;
    setTimeout(() => {
      startTransition(async () => await onClick?.(e));
    }, 0);
  };

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        {...props}
        className={props.className + " opacity-50 cursor-wait"}
      >
        {children}
      </button>
    );
  }
  if (!isAuthenticated)
    return (
      <SignInTrigger {...{ ...props, description }}>{children}</SignInTrigger>
    );
  return (
    <button type={type} {...props} onClick={handleClick} disabled={isPending}>
      {children}
    </button>
  );
};
