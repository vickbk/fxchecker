import { Heading } from "@/shared/heading";
import { HistorySearchParams } from "../types";

export const Graph = ({}: HistorySearchParams) => {
  return (
    <figure className="rounded-lg bg-background-secondary w-full">
      <figcaption className="p-4 border-b border-dashed border-card">
        <Heading className="sr-only">
          The currency exchange story for 3months
        </Heading>
        <dl className="flex justify-between gap-4">
          <div className="flex">
            <dt className="sr-only">from</dt>
            <dd>USD/</dd>
            <dt className="sr-only">to</dt>
            <dd>EUR</dd>
          </div>
          <div className="text-foreground-secondary">
            <dt className="sr-only">Current Currency</dt>
            <dd className="flex">
              0.8532 <i className="bi bi-dot" />{" "}
              <time className="truncate w-40 sm:w-auto" dateTime="2026-07-09">
                July 09 16:00 CET
              </time>
            </dd>
          </div>
        </dl>
      </figcaption>
      <div className="min-h-30">Graph will be here</div>
    </figure>
  );
};
