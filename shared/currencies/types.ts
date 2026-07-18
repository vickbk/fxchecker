// eslint-disable-next-line boundaries/dependencies
import { Currency } from "@/infra/api/frankfurter";

export type CurrencyContextType = {
  currencies: Currency[];
  isLoading: boolean;
  error: Error | null;
};

export type FavoritePair = {
  base: string;
  quote: string;
};

export type FavoriteEntry = `${string}-${string}`;

export type FavoriteSuite = {
  toggleFavorite: (
    pair: FavoritePair,
  ) => Promise<{ success: boolean; error?: Error }>;
  getFavorites: () => Promise<FavoriteEntry[] | undefined>;
};
