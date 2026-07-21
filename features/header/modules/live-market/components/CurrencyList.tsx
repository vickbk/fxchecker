"use client";
import { BiIcon, getSearchQuery, SROnly } from "@/shared/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import { CurrencyListProps } from "../types";

export const CurrencyList = ({
  duplicate = false,
  rates,
  isItemVisible,
  registerItem,
}: CurrencyListProps) => {
  const searchParams = useSearchParams();
  return (
    <dl className="flex">
      {rates.map(({ base, quote, rate, change }) => {
        const isGoingUp = change && change >= 0;
        const ratePercentage = change
          ? ((change * 100) / rate).toFixed(2)
          : null;

        const key = `${duplicate ? "trackB" : "trackA"}-${base}-${quote}`;
        const visible = isItemVisible(key, !duplicate);
        return (
          <Fragment key={key}>
            <dt className="flex items-center justify-between px-4 gap-4 border-card border">
              <Link
                ref={registerItem(key)}
                tabIndex={visible ? 0 : -1}
                aria-hidden={!visible}
                href={`?${getSearchQuery(searchParams, ["from", base], ["to", quote])}`}
                className="font-medium text-foreground-secondary truncate focus-visible:outline-none focus-visible:underline hover:underline hover:text-lime-500 focus-visible:text-lime-500"
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
