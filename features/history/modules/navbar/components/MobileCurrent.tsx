"use client";
import { useActiveOption } from "../hooks";
import { NavbarProps } from "../types";
import { Badge } from "./Badge";

export const MobileCurrent = (props: NavbarProps) => {
  const { text } = useActiveOption();

  return (
    <>
      {text}{" "}
      <Badge
        value={props[text as keyof NavbarProps].badge || Promise.resolve(null)}
      />
    </>
  );
};
