"use client";

import Link from "next/link";
import { useActiveOption } from "../hooks";
import { OptionProps } from "../types";

export const OptionMenue = ({ text, children }: OptionProps) => {
  const { isActive, isHistory, queryString } = useActiveOption(text);
  return (
    <li
      className={`p-4 border-b-2 hover:border-lime-500 has-focus-visible:outline has-focus-visible:outline-lime-500 has-focus-visible:border-transparent has-focus-visible:rounded-lg ${isActive ? "border-lime-500" : "border-transparent"}`}
    >
      <Link
        className="block focus-visible:outline-none"
        href={`/${isHistory ? "" : text}${queryString && "?" + queryString}`}
      >
        {text} {children}
      </Link>
    </li>
  );
};
