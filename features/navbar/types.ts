import { ReactNode } from "react";

export type NavbarProps = Record<
  "history" | "compare" | "favorites" | "logs",
  { badge?: Promise<number> }
>;

export type OptionProps = {
  text: string;
  children: ReactNode;
};
