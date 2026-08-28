"use client";
import { useSearchParams } from "next/navigation";
import { CurrencyListProps } from "../types";
import { RateCard } from "./RateCard";

export const CurrencyList = ({
  duplicate = false,
  rates,
  isItemVisible,
  registerItem,
}: CurrencyListProps) => {
  const searchParams = useSearchParams();
  return (
    <dl className="flex">
      {rates.map((rate) => (
        <RateCard
          {...{ ...rate, isItemVisible, registerItem, searchParams }}
          key={`track-${duplicate ? "A" : "B"}-${rate.base}-${rate.quote}`}
        />
      ))}
    </dl>
  );
};
