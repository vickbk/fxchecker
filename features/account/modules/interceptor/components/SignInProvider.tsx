"use client";
import { ReactNode } from "react";
import { SignInContext, useSignIn } from "../hooks/useSignInterceptor";

export const SignInProvider = ({ children }: { children: ReactNode }) => {
  return <SignInContext value={useSignIn()}>{children}</SignInContext>;
};
