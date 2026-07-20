import { FavoriteSuite } from "@/shared/currencies";
import { Heading, Section } from "@/shared/heading";
import {
  CurrencyCardContainer,
  getSearchQuery,
  type SignInInterceptor,
  SROnly,
} from "@/shared/utils";
import { getCompareRates } from "../actions";
import { CompareSearchParams } from "../types";
import { Actions } from "./Actions";
import { CompareCurreny } from "./CompareCurreny";
import { EmptyCompare } from "./EmptyCompare";

export const MainCompare = async ({
  LoginTrigger,
  favoriteSuite,
  ...searchParams
}: CompareSearchParams & {
  LoginTrigger: SignInInterceptor;
  favoriteSuite: FavoriteSuite;
}) => {
  const { from = "USD", amount = 100 } = searchParams;
  const searchQuery = new URLSearchParams({
    ...searchParams,
    amount: amount + "",
  });
  const rates = await getCompareRates(from);

  if (rates.length === 0) return <EmptyCompare LoginTrigger={LoginTrigger} />;
  const quotes = rates.map((rate) => rate.quote);

  const favorites = new Set(await favoriteSuite.getFavorites());

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
            <CompareCurreny
              key={rate.quote}
              {...rate}
              amount={amount}
              LoginTrigger={LoginTrigger}
              isFavorite={favorites.has(`${from}-${rate.quote}`)}
              toggleFavorite={favoriteSuite.toggleFavorite}
              searchQuery={getSearchQuery(searchQuery, ["to", rate.quote])}
            />
          ))}
        </CurrencyCardContainer>
      </div>
    </Section>
  );
};
