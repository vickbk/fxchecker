import { Currency } from "@/infra/api/frankfurter";

export type CurrencyPickerProps = {
  currencies: Currency[];
  onSelect?: (currency: Currency) => void;
  title?: string;
};
