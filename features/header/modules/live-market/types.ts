import { FrankfurterRate } from "@/infra/api/frankfurter";

export type ItemRegister = (key: string) => (node: HTMLElement | null) => void;
export type VisibleChecker = (key: string, isTrackA?: boolean) => boolean;

export type CurrencyListProps = {
  rates: FrankfurterRate[];
  duplicate?: boolean;
  registerItem: ItemRegister;
  isItemVisible: VisibleChecker;
};
