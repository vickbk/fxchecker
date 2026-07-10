import { Heading } from "@/shared/heading";
import { SectionsWrapper, SROnly } from "@/shared/utils";
import { Actions } from "./Actions";
import { FavoriteCard } from "./FavoriteCard";

export const MainFavorite = () => {
  return (
    <SectionsWrapper sectionId="favorite-heading">
      <Heading id="favorite-heading" className="uppercase">
        Pin Paired <SROnly>currencies</SROnly>{" "}
      </Heading>
      <Actions />
      <ul className="w-full">
        <FavoriteCard />
      </ul>
    </SectionsWrapper>
  );
};
