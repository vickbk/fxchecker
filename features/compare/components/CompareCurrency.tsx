import { CurrencyCard, getCurrencyCountry, SROnly } from "@/shared/utils";
import { Flag } from "@/shared/utils/components/Flag";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import Link from "next/link";
import { deleteCompareCurrency } from "../actions";
import { CompareDelete } from "../modules/delete";
import { CompareItemProps } from "../types";
import { CurrencyActions } from "./CurrencyActions";

export const CompareCurrency = ({
  LoginTrigger,
  quote,
  rate,
  base,
  amount,
  details: { [quote]: currency },

  searchQuery,
  children,
}: CompareItemProps) => {
  const deleteAction = deleteCompareCurrency.bind(null, quote);

  return (
    <CurrencyCard>
      <Flag country={getCurrencyCountry(quote)} alt={""} />
      <dl>
        <dt className="text-sm">{quote}</dt>
        <dd className="text-foreground-secondary truncate text-xs">
          <Link href={`?${searchQuery}`}>
            <SROnly>Update quote currency to </SROnly>
            {currency.name || "unknown currency name"}{" "}
            <span className="absolute inset-0" />
          </Link>
        </dd>
      </dl>
      <dl className="ml-auto text-right">
        <dt>{(amount * rate).toFixed(2)}</dt>
        <dd className="text-foreground-secondary text-xs truncate">
          <SROnly>From {base} at a rate of </SROnly> <SRHidden>@</SRHidden>{" "}
          {rate}
        </dd>
      </dl>

      <CurrencyActions
        {...{
          quote,
          LoginTrigger,
          favoriteWrapper: children,
        }}
      >
        <CompareDelete
          quote={quote}
          name={currency.name}
          deleteAction={deleteAction}
        />
      </CurrencyActions>
    </CurrencyCard>
  );
};
