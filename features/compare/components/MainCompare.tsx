import { Heading, Section } from "@/shared/heading";
import { getSearchQuery, type SignInInterceptor, SROnly } from "@/shared/utils";
import { getCompareRates } from "../actions";
import { CompareSearchParams } from "../types";
import { Actions } from "./Actions";
import { CompareCurreny } from "./CompareCurreny";

export const MainCompare = async ({
  LoginTrigger,
  ...searchParams
}: CompareSearchParams & {
  LoginTrigger: SignInInterceptor;
}) => {
  const { from = "USD", amount = 100 } = searchParams;
  const searchQuery = new URLSearchParams({
    ...searchParams,
    amount: amount + "",
  });
  const rates = await getCompareRates(from);
  const quotes = rates.map((rate) => rate.quote);

  return (
    <Section aria-describedby="compare-description" className="p-4">
      <div className="flex flex-wrap rounded-lg p-4 gap-4 bg-background-secondary items-center justify-between">
        <Heading id="compare-heading" className="uppercase">
          <SROnly>Compare </SROnly>{" "}
          <span className="text-foreground-secondary"> Multi-Currencies</span>{" "}
          {amount} FROM {from}
        </Heading>
        <Actions rates={quotes} LoginTrigger={LoginTrigger} />
        <ul className="w-full grid gap-4">
          {rates.map((rate) => (
            <CompareCurreny
              key={rate.quote}
              {...rate}
              amount={amount}
              quotes={quotes}
              LoginTrigger={LoginTrigger}
              searchQuery={getSearchQuery(searchQuery, ["to", rate.quote])}
            />
          ))}
        </ul>
      </div>
    </Section>
  );
};
