import { Heading, Section } from "@/shared/heading";
import { type SignInInterceptor, SROnly } from "@/shared/utils";
import { getCompareRates } from "../actions";
import { CompareSearchParams } from "../types";
import { Actions } from "./Actions";
import { CompareCurreny } from "./CompareCurreny";

export const MainCompare = async ({
  LoginTrigger,
  from = "USD",
  amount = 100,
}: CompareSearchParams & {
  LoginTrigger: SignInInterceptor;
}) => {
  const rates = await getCompareRates(from);

  return (
    <Section aria-describedby="compare-description" className="p-4">
      <div className="flex flex-wrap rounded-lg p-4 gap-4 bg-background-secondary items-center justify-between">
        <Heading id="compare-heading" className="uppercase">
          <SROnly>Compare </SROnly>{" "}
          <span className="text-foreground-secondary"> Multi-Currencies</span>{" "}
          {amount} FROM {from}
        </Heading>
        <Actions LoginTrigger={LoginTrigger} />
        <ul className="w-full grid gap-4">
          {rates.map((rate) => (
            <CompareCurreny
              key={rate.quote}
              {...rate}
              amount={amount}
              LoginTrigger={LoginTrigger}
            />
          ))}
        </ul>
      </div>
    </Section>
  );
};
