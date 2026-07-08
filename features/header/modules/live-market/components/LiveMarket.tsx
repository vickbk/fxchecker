import { Article, Heading } from "@/shared/heading";
import { BiIcon } from "@/shared/utils";
import "../styles.css";
import { CurrencyList } from "./CurrencyList";

export const LiveMarket = () => {
  const rates = [
    {
      date: "2026-01-03",
      base: "USD",
      quote: "EUR",
      rate: 0.85,
      change: -0.01,
    },
    { date: "2026-01-03", base: "EUR", quote: "GBP", rate: 0.75, change: 0.02 },
  ];
  return (
    <Article
      className="flex uppercase bg-background-secondary sticky top-0"
      aria-describedby="live-market"
    >
      <Heading
        className="bg-lime-500 text-background p-4 whitespace-nowrap"
        id="live-market"
      >
        <BiIcon name="circle-fill" /> Live Market
      </Heading>
      <div className="grow overflow-x-auto flex gap-2 scrollbar-none relative infinite-container">
        <div className="track flex">
          <CurrencyList rates={rates} />
          <CurrencyList duplicate rates={rates} />
        </div>
      </div>
    </Article>
  );
};
