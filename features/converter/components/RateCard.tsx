"use client";
import { Heading, Section } from "@/shared/heading";
import { SROnly } from "@/shared/utils";
import { useURLState } from "../hooks/useURLState";
import { AmountSetter } from "./AmountSetter";
import { ConvertDisplay } from "./ConvertDisplay";
import { CurrencyCard } from "./CurrencyCard";

export const RateCard = ({ isSend = false }: { isSend?: boolean }) => {
  const id = isSend ? "send-rate-header" : "receive-rate-header";
  const { from, to } = useURLState();
  return (
    <Section aria-describedby={id} className="bg-card p-4 rounded-lg">
      <Heading className="uppercase text-foreground-secondary" id={id}>
        {isSend ? "Send" : "Receive"}{" "}
        <SROnly>rate ({isSend ? from : to})</SROnly>
      </Heading>
      <div className="flex justify-between items-center sm:mt-4">
        {isSend ? <AmountSetter /> : <ConvertDisplay />}
        <CurrencyCard isSend={isSend} />
      </div>
    </Section>
  );
};
