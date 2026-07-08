import { Article, Heading } from "@/shared/heading";
import { ConverterActions } from "./ConvertActions";
import { RateCard } from "./RateCard";
import { Swapper } from "./Swapper";

export const ConverterCard = () => {
  return (
    <Article className="p-4">
      <Heading className="uppercase text-xl">Check the rate</Heading>
      <div className="flex flex-col gap-4 bg-background-secondary rounded-2xl md:flex-row mt-4">
        <div className="p-4 flex flex-col gap-4">
          <RateCard isSend />
          <Swapper />
          <RateCard />
        </div>
        <ConverterActions />
      </div>
    </Article>
  );
};
