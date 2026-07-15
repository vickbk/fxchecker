import { Article, Heading } from "@/shared/heading";
import { BiIcon, LoadingPlaceholder } from "@/shared/utils";
import { Suspense } from "react";
import "../styles.css";
import { ScrollingCurrencies } from "./ScrollingCurrencies";

export const LiveMarket = async () => {
  return (
    <Article
      className="flex uppercase bg-background-secondary sticky top-0 z-10"
      aria-describedby="live-market"
    >
      <Heading
        className="bg-lime-500 text-background p-4 whitespace-nowrap"
        id="live-market"
      >
        <BiIcon name="circle-fill" /> Live Market
      </Heading>
      <Suspense
        fallback={
          <LoadingPlaceholder
            className="bg-card h-full"
            text="Loading live rate exchange"
          />
        }
      >
        <ScrollingCurrencies />
      </Suspense>
    </Article>
  );
};
