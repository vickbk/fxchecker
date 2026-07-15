import { FrankfurterRate } from "@/infra/api/frankfurter/types";
import { getLatestRates } from "../api";
import { CurrencyList } from "./CurrencyList";

export const ScrollingCurrencies = async () => {
  const rates = (await getLatestRates()) as FrankfurterRate[];
  if (!rates) return null;
  return (
    <div className="grow overflow-x-auto flex gap-2 scrollbar-none relative infinite-container">
      <div className="track flex">
        <CurrencyList rates={rates} />
        <CurrencyList duplicate rates={rates} />
      </div>
    </div>
  );
};
