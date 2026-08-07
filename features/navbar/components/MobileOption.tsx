"use client";
import Link from "next/link";
import { useActiveOption } from "../hooks";
import { OptionProps } from "../types";
import { closeDialog } from "../utils";

export const MobileOption = ({ text, children }: OptionProps) => {
  const { isActive, isHistory, queryString } = useActiveOption(text);

  return (
    <li
      className={`p-4 rounded-lg bg-card focus-within:outline focus-within:outline-lime-500 ${isActive ? "outline text-lime-500" : ""}`}
    >
      <Link
        className="flex justify-between items-center focus-visible:outline-none"
        ref={closeDialog}
        href={`/${isHistory ? "" : text}${queryString && "?" + queryString}`}
      >
        {text} {children}
      </Link>
    </li>
  );
};
