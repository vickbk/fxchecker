import { FavoriteSuite } from "@/shared/currencies";
import { SignInInterceptor } from "@/shared/utils";
import { updateFavoriteStatus } from "../actions";
import { FavoriteContent } from "./FavoriteContent";

export const FavoriteProvider = async ({
  getFavorites,
  toggleFavorite,
  SignInInterceptor,
}: FavoriteSuite & { SignInInterceptor: SignInInterceptor }) => {
  let favorites: string[] = [];
  try {
    favorites = (await getFavorites()) ?? [];
  } catch (error) {
    console.log(error);
  }
  const action = await updateFavoriteStatus(toggleFavorite);

  console.log(favorites);

  return (
    <form action={action}>
      <FavoriteContent
        SignInInterceptor={SignInInterceptor}
        favorites={favorites}
      />
    </form>
  );
};
