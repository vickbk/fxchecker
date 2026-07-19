import { BiIcon, CurrencyCard, SROnly } from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import { LogData } from "../types";

export const LogCard = ({
  id,
  data: { base, quote, rate, amount },
}: {
  id: string;
  editTime: Date;
  data: LogData;
}) => {
  return (
    <CurrencyCard>
      <div className="sm:flex gap-4">
        <time dateTime="2026-07-08">
          <SRHidden className="text-foreground-secondary">3M</SRHidden>{" "}
          <SROnly>3 months ago</SROnly>
        </time>

        <SRHidden className="truncate block">
          {base} <BiIcon name="arrow-right text-foreground-secondary" /> {quote}
        </SRHidden>
      </div>
      <SROnly>
        {base} to {quote}
      </SROnly>

      <SRHidden className="truncate ml-auto sm:flex gap-4  text-foreground-secondary">
        {amount} USD{" "}
        <span className="text-lime-500 block text-right">
          {(amount * rate).toFixed(2)} {quote}
        </span>
      </SRHidden>
      <SROnly>1 000 USD is 875 EUR</SROnly>

      <button
        type="button"
        className="bg-background-secondary text-foreground-secondary p-2 rounded-lg"
      >
        <SROnly>Delete</SROnly>
        <BiIcon name="trash" />
      </button>
    </CurrencyCard>
  );
};
