import { URLState } from "../types";
import {
  DEFAULT_FROM,
  DEFAULT_TO,
  normalizeAmount,
  normalizeCurrency,
} from "./formatting";
import { getSearchQueryObject } from "./get-search-query-object";

export function readState(
  searchParams: URLSearchParams | null | undefined,
): Pick<URLState, "amount" | "from" | "to"> {
  const from = normalizeCurrency(searchParams?.get("from"), DEFAULT_FROM);
  const to = normalizeCurrency(searchParams?.get("to"), DEFAULT_TO);
  const amount = normalizeAmount(searchParams?.get("amount"));

  return {
    from,
    to,
    amount,
  };
}

export function buildStateQuery(
  {
    from,
    to,
    amount,
  }: {
    from?: string;
    to?: string;
    amount?: number;
  },
  searchParams?: URLSearchParams,
): string {
  const params = {
    from: from && normalizeCurrency(from, DEFAULT_FROM),
    to: to && normalizeCurrency(to, DEFAULT_TO),
    amount: amount && normalizeAmount(amount + ""),
  };

  if (!from) delete params.from;
  if (!to) delete params.to;
  if (!amount) delete params.amount;

  return getSearchQueryObject(searchParams, params);
}
