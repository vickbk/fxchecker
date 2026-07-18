import { createContext, useContext, useState } from "react";
import { SignInCtx, SignInDescription } from "../types";

export const SignInContext = createContext({} as SignInCtx);

export function useSignIn() {
  return useContext(SignInContext);
}

export function useSignInProvider() {
  const [descriptions, setDescriptions] = useState<SignInDescription>({});
  return { ...descriptions, setDescriptions };
}
