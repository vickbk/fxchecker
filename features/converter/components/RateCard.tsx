import { Currency } from "@/infra/api/frankfurter";
import { Heading, Section } from "@/shared/heading";
import { SROnly } from "@/shared/utils";
import { AmountSetter } from "./AmountSetter";
import { CurrencyCard } from "./CurrencyCard";

export const RateCard = ({
  isSend = false,
  currencies,
}: {
  currencies: Currency[];
  isSend?: boolean;
}) => {
  const id = isSend ? "send-rate-header" : "receive-rate-header";
  return (
    <Section aria-describedby={id} className="bg-card p-4 rounded-lg">
      <Heading className="uppercase text-foreground-secondary" id={id}>
        {isSend ? "Send" : "Receive"} <SROnly>rate</SROnly>
      </Heading>
      <div className="flex justify-between items-center sm:mt-4">
        {isSend ? (
          <AmountSetter />
        ) : (
          <p className="text-4xl font-bold text-lime-500">{100}</p>
        )}
        <CurrencyCard currencies={currencies} isSend={isSend} />
      </div>
    </Section>
  );
};
