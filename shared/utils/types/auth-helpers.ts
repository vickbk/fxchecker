import { ButtonHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";

export type LoginTrigger = (
  params: {
    title?: string;
    description?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>,
) => JSX.Element;
