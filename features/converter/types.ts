export type URLState = {
  from: string;
  to: string;
  amount: number;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  setAmount: (value: number) => void;
  swapCurrencies: () => void;
};

export type CurrencyOption = {
  code: string;
  name: string;
  symbol: string;
};

export type CurrencyPickerProps = {
  currencies: CurrencyOption[];
  onSelect?: (currency: CurrencyOption) => void;
};

export type UseCurrencyFilterOptions = {
  currencies: CurrencyOption[];
  onSelect?: (currency: CurrencyOption) => void;
};

export type UseCurrencyFilterReturn = {
  isOpen: boolean;
  query: string;
  highlightedIndex: number;
  filteredCurrencies: CurrencyOption[];
  setQuery: (value: string) => void;
  openMenu: () => void;
  closeMenu: () => void;
  handleKeyDown: (event: { key: string }) => void;
  handleMouseEnter: (index: number) => void;
  handleBlur: () => void;
  selectHighlighted: () => void;
};
