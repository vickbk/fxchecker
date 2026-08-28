import { FrankfurterRate } from "@/infra/api/frankfurter";
import { getSearchQueryObject } from "@/shared/url";
import { SROnly } from "@/shared/utils";
import Link from "next/link";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Fragment } from "react";
import { ItemRegister, VisibleChecker } from "../types";
import { ChangeCard } from "./ChangeCard";

export const RateCard = ({
  base,
  quote,
  rate,
  change,
  duplicate,
  searchParams,
  registerItem,
  isItemVisible,
}: FrankfurterRate & {
  duplicate?: boolean;
  registerItem: ItemRegister;
  isItemVisible: VisibleChecker;
  searchParams: ReadonlyURLSearchParams;
}) => {
  const isGoingUp = change && change >= 0;
  const ratePercentage = change ? ((change * 100) / rate).toFixed(2) : null;

  const key = `${duplicate ? "trackB" : "trackA"}-${base}-${quote}`;
  const visible = isItemVisible(key, !duplicate);
  return (
    <Fragment key={key}>
      <dt className="flex items-center justify-between px-4 gap-4 border-card border">
        <Link
          ref={registerItem(key)}
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
          href={`?${getSearchQueryObject(searchParams, { from: base, to: quote })}`}
          className="font-medium text-foreground-secondary truncate focus-visible:outline-none focus-visible:underline hover:underline hover:text-lime-500 focus-visible:text-lime-500"
        >
          <SROnly>From</SROnly> {base}/{quote}
        </Link>
        <span className="font-bold"> {rate.toFixed(2)}</span>
        {change !== undefined && (
          <ChangeCard {...{ isGoingUp: !!isGoingUp, ratePercentage }} />
        )}
      </dt>
      <dd className="sr-only">{`from currency ${base} to currency ${quote} the exchange rate is ${rate}.${change ? ` This is ${ratePercentage}% ${isGoingUp ? "more" : "less"} than last week` : ""}`}</dd>
    </Fragment>
  );
};
