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

export type FilterState = {
  isOpen: boolean;
  query: string;
  highlightedIndex: number;
};

export type FilterAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "OPEN" }
  | { type: "RESET" }
  | { type: "SET_HIGHLIGHT"; payload: number }
  | { type: "KEY_NAVIGATE"; key: "ArrowDown" | "ArrowUp"; totalLength: number };

type ActionHandler<T extends FilterAction["type"]> = (
  state: FilterState,
  action: Extract<FilterAction, { type: T }>,
) => FilterState;

export type Handlers = {
  [K in FilterAction["type"]]: ActionHandler<K>;
};
