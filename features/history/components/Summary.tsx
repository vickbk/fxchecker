import { loadHistoricalRates } from "../api";
import { HistorySearchParams } from "../types";
import { Menue } from "./Menue";
import { SummaryCard } from "./SummaryCard";

export const Summary = async (params: HistorySearchParams) => {
  const rates = await loadHistoricalRates(params);

  if (!rates) return null;

  const openRate = rates[0].rate;
  const closeRate = rates[rates.length - 1].rate;
  const diff = closeRate - openRate;
  const increasing = diff >= 0;

  return (
    <>
      <dl className="grid grid-cols-2 gap-4 sm:flex">
        <SummaryCard term="Open">{openRate}</SummaryCard>
        <SummaryCard term="Close">{closeRate}</SummaryCard>
        <SummaryCard term="Change">
          <span className={`${increasing ? "text-green-500" : "text-red-500"}`}>
            <span className="sr-only">
              Rate {increasing ? "raised with" : "declined by"}
            </span>{" "}
            {increasing ? "+" : ""}
            {diff.toFixed(4)}
          </span>
        </SummaryCard>
        <SummaryCard term="% Change">
          <span className={`${increasing ? "text-green-500" : "text-red-500"}`}>
            <span className="sr-only">
              {increasing ? "Increase" : "Drop"} percentage
            </span>
            <i className={`bi bi-caret-${increasing ? "up" : "down"}-fill`} />{" "}
            {((diff * 100) / openRate).toFixed(4)}
          </span>
        </SummaryCard>
      </dl>
      <Menue {...params} />
    </>
  );
};
