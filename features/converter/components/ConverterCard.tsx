import { Currency, fetchCurrencies } from "@/infra/api/frankfurter";
import { Article, Heading } from "@/shared/heading";
import { ConverterActions } from "./ConvertActions";
import { RateCard } from "./RateCard";
import { Swapper } from "./Swapper";

export const ConverterCard = async () => {
  let currencies: Currency[] | null = null;
  try {
    currencies = await fetchCurrencies();
  } catch (error) {
    console.error(error);
  }

  if (!currencies) return null;
  return (
    <Article className="p-4">
      <Heading className="uppercase text-xl">Check the rate</Heading>
      <div className="flex flex-col gap-4 bg-background-secondary rounded-2xl mt-4">
        <div className="p-4 flex flex-col sm:grid grid-cols-[1fr_auto_1fr] gap-4 pb-0">
          <RateCard isSend currencies={currencies} />
          <Swapper />
          <RateCard currencies={currencies} />
        </div>
        <ConverterActions />
      </div>
    </Article>
  );
};
