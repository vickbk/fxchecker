"use client";

import Link from "next/link";
import { useActiveOption } from "../hooks";
import { OptionProps } from "../types";

export const OptionMenue = ({ text, children }: OptionProps) => {
  const { isActive, isHistory, queryString } = useActiveOption(text);
  return (
    <li
      className={`p-4 border-b-2 hover:border-lime-500 ${isActive ? "border-lime-500" : "border-transparent"}`}
    >
      <Link
        className="block"
        href={`/${isHistory ? "" : text}${queryString && "?" + queryString}`}
      >
        {text} {children}
      </Link>
    </li>
  );
};
