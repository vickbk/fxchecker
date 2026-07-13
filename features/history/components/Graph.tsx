import { Heading } from "@/shared/heading";
import { LoadingPlacehoder } from "@/shared/utils";
import { loadHistoricalRates } from "../api";
import { HistorySearchParams } from "../types";
import { codeToPeriod } from "../utils/date";

export const Graph = async ({
  from = "USD",
  to = "EUR",
  period = "1D",
}: HistorySearchParams) => {
  const rates = await loadHistoricalRates({ from, to, period });

  if (!rates) return null;

  const last = rates.at(-1);
  const today = new Date();

  return (
    <figure className="rounded-lg bg-background-secondary w-full">
      <figcaption className="p-4 border-b border-dashed border-card">
        <Heading className="sr-only">
          The currency exchange story for {codeToPeriod(period)}
        </Heading>
        <dl className="flex justify-between gap-4">
          <div className="flex">
            <dt className="sr-only">from</dt>
            <dd>{from}/</dd>
            <dt className="sr-only">to</dt>
            <dd>{to}</dd>
          </div>
          <div className="text-foreground-secondary">
            <dt className="sr-only">Current Currency</dt>
            <dd className="flex">
              {last?.rate} <i className="bi bi-dot" />{" "}
              <time className="truncate w-40 sm:w-auto" dateTime={last?.date}>
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                  hour12: false,
                }).format(today)}
              </time>
            </dd>
          </div>
        </dl>
      </figcaption>
      <div className="min-h-30">
        <LoadingPlacehoder className="bg-card h-64" />
      </div>
    </figure>
  );
};
