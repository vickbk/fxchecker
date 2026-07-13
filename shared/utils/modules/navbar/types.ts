import { ReactNode } from "react";

export type NavLinkProps = {
  text: string;
  children: ReactNode;
};
export type NavbarProps = Record<
  "history" | "compare" | "favorites" | "logs",
  { badge?: Promise<number> }
>;

export type QueryParams = Record<"from" | "to" | "compare" | "range", string>;

export type OptionProps = {
  text: string;
  children: ReactNode;
};
