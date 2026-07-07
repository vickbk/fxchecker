import { Section } from "@/shared/heading";
import { CurrencyCard } from "./CurrencyCard";

export const RateCard = ({ isSend = false }: { isSend?: boolean }) => {
  return (
    <Section>
      {isSend ? "Send rate" : "Receive rate"}
      <label htmlFor="sss">Exchange amount</label>
      <input type="number" placeholder="100" defaultValue={100} />
      <CurrencyCard />
    </Section>
  );
};
