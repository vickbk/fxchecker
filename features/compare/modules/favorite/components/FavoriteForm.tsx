import { FavoriteSuite } from "@/shared/currencies";
import { ReactNode } from "react";

export const FavoriteForm = async ({
  favoriteAction,
  children,
}: {
  favoriteAction: FavoriteSuite["toggleFavorite"];
  children: ReactNode;
}) => {
  "use server";
  return (
    <form action={favoriteAction as unknown as (form: FormData) => void}>
      {children}
    </form>
  );
};
