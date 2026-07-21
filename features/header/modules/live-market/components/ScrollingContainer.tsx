"use client";

import { FrankfurterRate } from "@/infra/api/frankfurter";
import { useMarqueeVisibility } from "../hooks";
import { CurrencyList } from "./CurrencyList";

export const ScrollingContainer = ({ rates }: { rates: FrankfurterRate[] }) => {
  const { containerRef, ...props } = useMarqueeVisibility();
  return (
    <div
      className="grow overflow-x-auto flex gap-2 scrollbar-none relative infinite-container"
      ref={containerRef}
    >
      <div className="track flex">
        <CurrencyList rates={rates} {...props} />
        <CurrencyList duplicate rates={rates} {...props} />
      </div>
    </div>
  );
};
