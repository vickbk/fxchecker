"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SignInContext, useSignInProvider } from "../hooks/useSignInterceptor";

export const SignInProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <SignInContext value={useSignInProvider()}>{children}</SignInContext>
    </SessionProvider>
  );
};
