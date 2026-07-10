"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NavLinkProps } from "../../../types/navbar";

export const NavLink = ({ badge, text }: NavLinkProps) => {
  const query = useSearchParams();
  const queryString = query.toString().trim();
  return (
    <Link
      className="block"
      href={`/${text === "history" ? "" : text}${queryString && "?" + queryString}`}
    >
      {text} {badge && <span>{badge}</span>}
    </Link>
  );
};
