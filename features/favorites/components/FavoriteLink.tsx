"use client";
import { Currency } from "@/infra/api/frankfurter";
import { getSearchQuery } from "@/shared/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

export const FavoriteLink = ({
  children,
  base,
  quote,
}: { children: ReactNode } & Record<"base" | "quote", Currency>) => {
  const searchQuery = useSearchParams();
  const query = getSearchQuery(
    searchQuery,
    ["from", base.code],
    ["to", quote.code],
  );

  return (
    <Link href={`?${query}`} className="focus-visible:outline-none">
      {children}
    </Link>
  );
};
