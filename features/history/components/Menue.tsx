import { getSearchQuery, SROnly } from "@/shared/utils";
import Link from "next/link";
import { HistorySearchParams } from "../types";

const timePeriods = [
  ["1D", "One day"],
  ["1W", "One week"],
  ["1M", "One month"],
  ["3M", "Three months"],
  ["1Y", "One Year"],
  ["5Y", "Five years"],
];

export const Menue = ({
  from = "USD",
  to = "EUR",
  period = "1D",
}: HistorySearchParams) => {
  const searchParams = new URLSearchParams({ from, to, period });

  return (
    <ul className="flex bg-background-secondary self-start rounded-lg md:self-center">
      {timePeriods.map(([key, text]) => (
        <li key={key}>
          <Link
            href={`?${getSearchQuery(searchParams, ["period", key])}`}
            className={`p-2 hover:bg-card rounded-lg block${key === period ? " bg-card" : ""}`}
          >
            <SROnly>{text}</SROnly>
            <span aria-hidden>{key}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
