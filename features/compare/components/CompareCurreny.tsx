import { Currency, FrankfurterRate } from "@/infra/api/frankfurter/types";
import { Heading } from "@/shared/heading";
import {
  CurrencyCard,
  getCurrencyCountry,
  SignInInterceptor,
  SROnly,
} from "@/shared/utils";
import { Flag } from "@/shared/utils/components/Flag";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import Link from "next/link";
import { deleteCompareRate } from "../actions";
import { ConfirmDelete } from "./ConfirmDelete";
import { CurrencyActions } from "./CurrencyActions";

export const CompareCurreny = ({
  LoginTrigger,
  quote,
  rate,
  base,
  amount,
  details: { [quote]: currency },
  quotes,
  searchQuery,
}: FrankfurterRate & {
  details: Partial<Record<string, Currency>>;
  amount: number;
  quotes: string[];
  searchQuery: string;
  LoginTrigger: SignInInterceptor;
}) => {
  const deleteAction = deleteCompareRate.bind(null, {
    toDelete: quote,
    rates: quotes,
  });

  return (
    <CurrencyCard>
      <Flag
        src={`https://flagcdn.com/${getCurrencyCountry(quote)}.svg`}
        alt={""}
      />
      <dl>
        <dt className="text-sm">{quote}</dt>
        <dd className="text-foreground-secondary truncate text-xs">
          <Link href={`?${searchQuery}`}>
            {currency?.name || "unknown currency name"}{" "}
            <span className="absolute inset-0" />
          </Link>
        </dd>
      </dl>
      <dl className="ml-auto">
        <dt>{(amount * rate).toFixed(2)}</dt>
        <dd className="text-foreground-secondary text-xs truncate">
          <SROnly>From {base} at a rate of </SROnly> <SRHidden>@</SRHidden>{" "}
          {rate}
        </dd>
      </dl>

      <CurrencyActions quote={quote} LoginTrigger={LoginTrigger}>
        <form
          action={deleteAction as unknown as (form: FormData) => void}
          popover=""
          id={`delete-${quote}`}
          className={`bg-background/80 shadow-xs shadow-background-secondary max-w-sm text-foreground-secondary p-4 open:grid gap-4 rounded-lg [position-anchor:--delete${quote}] [position-area:bottom_span-left] [position-try:flip-block]`}
        >
          <Heading className="uppercase text-center text-lg font-bold text-lime-500">
            Compare currency deletion ({quote})
          </Heading>
          <p>
            Are you sure you want to delete {quote} ({currency?.name}) from your
            compare list?
          </p>
          <fieldset className="flex justify-center items-center gap-4">
            <ConfirmDelete />
            <button type="button" popoverTarget={"delete-" + quote}>
              Cancel
            </button>
          </fieldset>
        </form>
      </CurrencyActions>
    </CurrencyCard>
  );
};
