import { FavoriteSuite } from "@/shared/currencies";
import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { ReactNode } from "react";
import { FavoriteForm, SubmitButton } from "../modules/favorite";

export const CurrencyActions = ({
  LoginTrigger,
  children,
  quote,
  isFavorite,
  favoriteAction,
}: {
  LoginTrigger: SignInInterceptor;
  children: ReactNode;
  quote: string;
  isFavorite: boolean;
  favoriteAction: FavoriteSuite["toggleFavorite"];
}) => {
  return (
    <ul className="flex gap-2 text-foreground-secondary z-1">
      <li className="text-lime-500">
        <FavoriteForm favoriteAction={favoriteAction}>
          <SubmitButton isFavorite={isFavorite} LoginTrigger={LoginTrigger} />
        </FavoriteForm>
      </li>
      <li>
        <LoginTrigger
          className={`[anchor-name:--delete${quote}]`}
          popoverTarget={"delete-" + quote}
          description="Login to use the remove currency from compare list feature and many more options."
        >
          <SROnly> Remove from compare</SROnly> <BiIcon name="trash" />
        </LoginTrigger>
        {children}
      </li>
    </ul>
  );
};
