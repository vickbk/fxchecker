import { SignInInterceptor } from "@/shared/utils";
import { getFavorites, toggleFavorite } from "../actions";
import { FavoriteToggleSubmit } from "./FavoriteToggleSubmit";

export const FavoriteToggleWrapper = async ({
  base,
  quote,
  isFavorite,
  SignInInterceptor,
}: {
  base: string;
  quote: string;
  isFavorite?: boolean;
  SignInInterceptor: SignInInterceptor;
}) => {
  const action = toggleFavorite.bind(null, { base, quote });

  isFavorite =
    isFavorite ?? !!(await getFavorites())?.includes(`${base}-${quote}`);

  return (
    <form action={action as () => void}>
      <FavoriteToggleSubmit {...{ isFavorite, SignInInterceptor }} />
    </form>
  );
};
