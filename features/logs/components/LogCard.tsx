import { BiIcon, CurrencyCard, getSearchQuery, SROnly } from "@/shared/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { deleteLogItem } from "../actions";
import { LogData } from "../types";
import { LogTime } from "./LogTime";

export const LogCard = ({
  id,
  editTime,
  data: { base, quote, rate, amount },
  children,
  searchParams,
}: {
  id: string;
  editTime: string;
  data: LogData;
  children: ReactNode;
  searchParams: Record<string, string>;
}) => {
  const results = (rate * amount).toFixed(2);
  const deleteAction = deleteLogItem.bind(null, id);

  const searchQuery = getSearchQuery(
    new URLSearchParams(searchParams),
    ["from", base],
    ["to", quote],
    ["amount", amount + ""],
  );
  return (
    <CurrencyCard>
      <div className="sm:flex gap-4">
        <LogTime time={editTime} />

        <Link
          href={`?${searchQuery}`}
          className="truncate focus-visible:outline-none"
        >
          {base} <SROnly>to</SROnly> <span className="absolute inset-0" />
          <BiIcon name="arrow-right text-foreground-secondary" /> {quote}
        </Link>
      </div>

      <p className="truncate ml-auto sm:flex gap-4  text-foreground-secondary">
        {amount} {base} <SROnly>was equivalent to</SROnly>
        <span className="text-lime-500 block text-right">
          {results} {quote} <SROnly>at a rate of {rate}</SROnly>
        </span>
      </p>

      <form className="z-1" action={deleteAction as () => void}>
        {children}
      </form>
    </CurrencyCard>
  );
};
