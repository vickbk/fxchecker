import { SignInInterceptor } from "@/shared/utils";
import { Suspense } from "react";
import { getFavorites } from "../actions";
import { mainToggleFavorite } from "../utils/helpers";
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

  return (
    <form action={mainToggleFavorite}>
      <Suspense>
        <MainToggleContent
          SignInInterceptor={SignInInterceptor}
          favorites={favorites}
        />
      </Suspense>
    </form>
  );
};
