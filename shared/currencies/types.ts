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
