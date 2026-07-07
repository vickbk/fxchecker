import { Heading, Section } from "@/shared/heading";
import { CurrencyList } from "./CurrencyList";

export const LiveMarket = () => {
  return (
    <Section aria-describedby="live-market">
      <Heading id="live-market">Live Market</Heading>
      <div>
        <CurrencyList />
        <CurrencyList />
      </div>
    </Section>
  );
};
