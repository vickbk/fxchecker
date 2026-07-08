import { Article, Heading } from "@/shared/heading";
import { BiIcon } from "@/shared/utils";
import "../styles.css";
import { CurrencyList } from "./CurrencyList";

export const LiveMarket = () => {
  return (
    <Article
      className="flex bg-background-secondary"
      aria-describedby="live-market"
    >
      <Heading
        className="bg-lime-500 text-background p-4 whitespace-nowrap"
        id="live-market"
      >
        <BiIcon name="circle-fill" /> Live Market
      </Heading>
      <div className="grow overflow-x-auto flex gap-2 scrollbar-none items-center relative infinite-container">
        <div className="track flex">
          <CurrencyList />
          <CurrencyList duplicate />
          <CurrencyList duplicate />
          <CurrencyList duplicate />
        </div>
      </div>
    </Article>
  );
};
