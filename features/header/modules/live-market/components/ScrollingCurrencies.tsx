import { getLatestRates } from "../api";
import { ScrollingContainer } from "./ScrollingContainer";

export const ScrollingCurrencies = async () => {
  const rates = await getLatestRates();
  if (!rates) return null;
  return <ScrollingContainer rates={rates} />;
};
