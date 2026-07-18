import { Heading } from "@/shared/heading";
import { SectionsWrapper, SROnly } from "@/shared/utils";
import { getFavorites } from "../actions";
import { Actions } from "./Actions";
import { EmptyFavorite } from "./EmptyFavorite";
import { FavoriteCard } from "./FavoriteCard";

export const MainFavorite = async () => {
  const favorites = await getFavorites();
  if (!favorites || favorites.length === 0) return <EmptyFavorite />;
  return (
    <SectionsWrapper sectionId="favorite-heading">
      <Heading id="favorite-heading" className="uppercase">
        Pin Paired <SROnly>currencies</SROnly>
      </Heading>
      <Actions />
      <ul className="w-full">
        {favorites.map((favorite) => {
          return <FavoriteCard key={favorite} favorite={favorite} />;
        })}
      </ul>
    </SectionsWrapper>
  );
};
