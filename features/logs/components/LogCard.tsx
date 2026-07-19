import { BiIcon, CurrencyCard, SROnly } from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import { ReactNode } from "react";
import { deleteLogItem } from "../actions";
import { LogData } from "../types";

export const LogCard = ({
  id,
  data: { base, quote, rate, amount },
  children,
}: {
  id: string;
  editTime: Date;
  data: LogData;
  children: ReactNode;
}) => {
  const results = (rate * amount).toFixed(2);
  const deleteAction = deleteLogItem.bind(null, id);
  return (
    <CurrencyCard>
      <div className="sm:flex gap-4">
        <time dateTime="2026-07-08">
          <SRHidden className="text-foreground-secondary">3M</SRHidden>{" "}
          <SROnly>3 months ago</SROnly>
        </time>

        <p className="truncate">
          {base} <SROnly>to</SROnly>{" "}
          <BiIcon name="arrow-right text-foreground-secondary" /> {quote}
        </p>
      </div>

      <p className="truncate ml-auto sm:flex gap-4  text-foreground-secondary">
        {amount} {base} <SROnly>was equivalent to</SROnly>
        <span className="text-lime-500 block text-right">
          {results} {quote} <SROnly>at a rate of {rate}</SROnly>
        </span>
      </p>

      <form action={deleteAction as () => void}>{children}</form>
    </CurrencyCard>
  );
};
