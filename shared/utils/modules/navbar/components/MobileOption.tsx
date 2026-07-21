"use client";
import Link from "next/link";
import { useActiveOption } from "../hooks";
import { OptionProps } from "../types";
import { closeDialog } from "../utils";

export const MobileOption = ({ text, children }: OptionProps) => {
  const { isActive, isHistory, queryString } = useActiveOption(text);

  return (
    <li
      className={`p-4 rounded-lg bg-card ${isActive ? "outline text-lime-500" : ""}`}
    >
      <Link
        className="block"
        ref={closeDialog}
        href={`/${isHistory ? "" : text}${queryString && "?" + queryString}`}
      >
        {text} {children}
      </Link>
    </li>
  );
};
