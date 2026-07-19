import {
  BiIcon,
  CurrencyCard,
  SignInInterceptor,
  SROnly,
} from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import { LogData } from "../types";

export const LogCard = ({
  data: { base, quote, rate, amount },
}: {
  id: string;
  editTime: Date;
  data: LogData;
  SignInInterceptor: SignInInterceptor;
}) => {
  const results = (rate * amount).toFixed(2);
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
