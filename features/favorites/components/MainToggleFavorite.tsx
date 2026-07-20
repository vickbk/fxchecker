import { SignInInterceptor } from "@/shared/utils";
import { getFavorites } from "../actions";
import { mainToggleFavorite } from "../utils";
import { MainToggleContent } from "./MainToggleContent";

export const MainToggleFavorite = async ({
  SignInInterceptor,
}: {
  SignInInterceptor: SignInInterceptor;
}) => {
  let favorites: string[] = [];
  try {
    favorites = (await getFavorites()) ?? [];
  } catch (error) {
    console.log(error);
  }
  const action = mainToggleFavorite;

  return (
    <form action={action}>
      <MainToggleContent
        SignInInterceptor={SignInInterceptor}
        favorites={favorites}
      />
    </form>
  );
};
