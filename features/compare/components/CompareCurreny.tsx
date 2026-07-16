import { Currency, FrankfurterRate } from "@/infra/api/frankfurter/types";
import {
  CurrencyCard,
  getCurrencyCountry,
  SignInInterceptor,
} from "@/shared/utils";
import { Flag } from "@/shared/utils/components/Flag";
import { CurrencyActions } from "./CurrencyActions";

export const CompareCurreny = ({
  LoginTrigger,
  quote,
  rate,
  amount,
  details: { [quote]: currency },
}: FrankfurterRate & { details: Partial<Record<string, Currency>> } & {
  LoginTrigger: SignInInterceptor;
  amount: number;
}) => {
  return (
    <CurrencyCard>
      <Flag
        src={`https://flagcdn.com/${getCurrencyCountry(quote)}.svg`}
        alt={""}
      />
      <dl>
        <dt className="text-sm">{quote}</dt>
        <dd className="text-foreground-secondary truncate text-xs">
          {currency?.name || "unknown currency name"}
        </dd>
      </dl>
      <dl className="ml-auto">
        <dt>{(amount * rate).toFixed(2)}</dt>
        <dd className="text-foreground-secondary text-xs truncate">@ {rate}</dd>
      </dl>

      <CurrencyActions LoginTrigger={LoginTrigger} />
    </CurrencyCard>
  );
};
