import { Heading, Section } from "@/shared/heading";
import { Actions } from "./Actions";
import { FavoriteCard } from "./FavoriteCard";

export const MainFavorite = () => {
  return (
    <Section aria-describedby="favorite-heading">
      <Heading id="favorite-heading">Pin Paired currencies</Heading>
      <Actions />
      <ul>
        <FavoriteCard />
      </ul>
    </Section>
  );
};
