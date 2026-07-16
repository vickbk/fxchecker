import { ButtonHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";

export type SignInInterceptor = (
  params: {
    title?: string;
    description?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>,
) => JSX.Element;
