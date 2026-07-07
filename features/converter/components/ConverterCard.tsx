import { Article, Heading } from "@/shared/heading";
import { ConverterActions } from "./ConvertActions";
import { RateCard } from "./RateCard";
import { Swapper } from "./Swapper";

export const ConverterCard = () => {
  return (
    <Article>
      <Heading>Check the rate</Heading>
      <div>
        <RateCard isSend />
        <Swapper />
        <RateCard />
      </div>
      <ConverterActions />
    </Article>
  );
};
