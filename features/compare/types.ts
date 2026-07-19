import { Currency } from "@/infra/api/frankfurter";
import { FrankfurterRate } from "@/infra/api/frankfurter/types";
import { FavoriteSuite } from "@/shared/currencies";
import { SignInInterceptor } from "@/shared/utils";

export type CompareSearchParams = { from?: string; amount?: number };

export type CompareItemProps = FrankfurterRate & {
  amount: number;
  details: { [x: string]: Currency };
  searchQuery: string;
  LoginTrigger: SignInInterceptor;
  toggleFavorite: FavoriteSuite["toggleFavorite"];
  isFavorite: boolean;
};
