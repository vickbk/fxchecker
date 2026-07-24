import { Currency } from "@/infra/api/frankfurter";

export type UseCurrencyFilterOptions = {
  currencies: Currency[];
  onSelect?: (currency: Currency) => void;
};

export type UseCurrencyFilterReturn = {
  isOpen: boolean;
  query: string;
  highlightedIndex: number;
  filteredCurrencies: Currency[];
  setQuery: (value: string) => void;
  openMenu: () => void;
  closeMenu: () => void;
  handleKeyDown: (event: { key: string }) => void;
  handleMouseEnter: (index: number) => void;
  handleBlur: () => void;
  selectHighlighted: () => void;
};
