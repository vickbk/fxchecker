import { fetchCurrenciesMap } from "@/infra/api/frankfurter";
import { Heading } from "@/shared/heading";
import { SectionsWrapper, SROnly } from "@/shared/utils";
import { getFavorites } from "../actions";
import { Actions } from "./Actions";
import { EmptyFavorite } from "./EmptyFavorite";
import { FavoriteCard } from "./FavoriteCard";

export const MainFavorite = async () => {
  const favorites = await getFavorites();
  if (!favorites || favorites.length === 0) return <EmptyFavorite />;

  const currencies = await fetchCurrenciesMap();
  const withDetails = favorites.map((favorite) => {
    const [base, quote] = favorite.split("-");
    return { base: currencies[base]!, quote: currencies[quote]! };
  });
  return (
    <SectionsWrapper sectionId="favorite-heading">
      <Heading id="favorite-heading" className="uppercase">
        Pin Paired <SROnly>currencies</SROnly>
      </Heading>
      <Actions />
      <ul className="w-full grid gap-4">
        {withDetails.map((favorite) => {
          const { base, quote } = favorite;
          return <FavoriteCard key={base.code + quote.code} {...favorite} />;
        })}
      </ul>
    </SectionsWrapper>
  );
};
