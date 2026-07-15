"use client";
import { FrankfurterRate } from "@/infra/api/frankfurter/types";
import { BiIcon, getSearchQuery, SROnly } from "@/shared/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export const CurrencyList = ({
  duplicate = false,
  rates,
}: {
  duplicate?: boolean;
  rates: FrankfurterRate[];
}) => {
  const searchParams = useSearchParams();
  return (
    <dl className="flex" aria-hidden={duplicate}>
      {rates.map(({ base, quote, rate, change }, index) => {
        const isGoingUp = change && change >= 0;
        const ratePercentage = change
          ? ((change * 100) / rate).toFixed(2)
          : null;
        return (
          <Fragment key={index}>
            <dt className="flex items-center justify-between px-4 gap-4 border-card border">
              <Link
                href={`?${getSearchQuery(searchParams, ["from", base], ["to", quote])}`}
                className="font-medium text-foreground-secondary truncate"
              >
                <SROnly>From</SROnly> {base}/{quote}
              </Link>
              <span className="font-bold"> {rate.toFixed(2)}</span>
              {change !== undefined && (
                <span
                  className={`flex ${isGoingUp ? "text-green-500" : "text-red-500"}`}
                >
                  <BiIcon name={`caret-${isGoingUp ? "up" : "down"}-fill`} />
                  {isGoingUp ? "+" : ""}
                  {ratePercentage}%
                </span>
              )}
            </dt>
            <dd className="sr-only">{`from currency ${base} to currency ${quote} the exchange rate is ${rate}.${change ? ` This is ${ratePercentage}% ${isGoingUp ? "more" : "less"} than last week` : ""}`}</dd>
          </Fragment>
        );
      })}
    </dl>
  );
};
