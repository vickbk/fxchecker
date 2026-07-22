import { Heading, Section } from "@/shared/heading";
import {
  CurrencyCardContainer,
  FavoriteWrapper,
  getSearchQuery,
  type SignInInterceptor,
  SROnly,
} from "@/shared/utils";
import { getCompareRates } from "../actions";
import { CompareSearchParams } from "../types";
import { Actions } from "./Actions";
import { CompareCurrency } from "./CompareCurrency";
import { EmptyCompare } from "./EmptyCompare";

export const MainCompare = async ({
  LoginTrigger,
  FavoriteWrapper,
  ...searchParams
}: CompareSearchParams & {
  LoginTrigger: SignInInterceptor;
  FavoriteWrapper: FavoriteWrapper;
}) => {
  const { from = "USD", amount = 100 } = searchParams;
  const searchQuery = new URLSearchParams({
    ...searchParams,
    amount: amount + "",
  });
  const rates = await getCompareRates(from);

  if (rates.length === 0) return <EmptyCompare LoginTrigger={LoginTrigger} />;
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
        <CurrencyCardContainer>
          {rates.map((rate) => (
            <CompareCurrency
              key={rate.quote}
              {...rate}
              amount={amount}
              LoginTrigger={LoginTrigger}
              searchQuery={getSearchQuery(searchQuery, ["to", rate.quote])}
            >
              <FavoriteWrapper
                base={from}
                quote={rate.quote}
                SignInInterceptor={LoginTrigger}
              />
            </CompareCurrency>
          ))}
        </CurrencyCardContainer>
      </div>
    </Section>
  );
};
