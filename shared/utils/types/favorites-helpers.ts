import { JSX } from "react/jsx-runtime";
import { SignInInterceptor } from "./auth-helpers";

export type FavoriteWrapper = (params: {
  base: string;
  quote: string;
  SignInInterceptor: SignInInterceptor;
}) => Promise<JSX.Element>;
