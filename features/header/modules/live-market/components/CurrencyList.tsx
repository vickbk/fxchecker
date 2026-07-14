"use client";
import { FrankfurterRate } from "@/infra/api/frankfurter/types";
import { BiIcon, getSearchQuery } from "@/shared/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const CurrencyList = ({
  duplicate = false,
  rates,
}: {
  duplicate?: boolean;
  rates: FrankfurterRate[];
}) => {
  const searchParams = useSearchParams();
  return (
    <ul className="flex" aria-hidden={duplicate}>
      {rates.map(({ base, quote, rate, change }, index) => {
        const isGoingUp = change && change >= 0;
        return (
          <li
            key={index}
            className="flex items-center justify-between px-4 gap-4 border-card border"
          >
            <Link
              href={`?${getSearchQuery(searchParams, ["from", base], ["to", quote])}`}
              className="font-medium text-foreground-secondary truncate"
            >
              {base}/{quote}
            </Link>
            <span className="font-bold"> {rate.toFixed(2)}</span>
            {change !== undefined && (
              <span
                className={`flex ${isGoingUp ? "text-green-500" : "text-red-500"}`}
              >
                <BiIcon name={`caret-${isGoingUp ? "up" : "down"}-fill`} />
                {isGoingUp ? "+" : ""}
                {((change * 100) / rate).toFixed(2)}%
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
