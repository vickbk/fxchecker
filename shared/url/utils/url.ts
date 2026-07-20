import { URLState } from "../types";
import {
  DEFAULT_FROM,
  DEFAULT_TO,
  normalizeAmount,
  normalizeCurrency,
} from "./formatting";

export function readState(
  searchParams: URLSearchParams | null | undefined,
): URLState {
  const from = normalizeCurrency(searchParams?.get("from"), DEFAULT_FROM);
  const to = normalizeCurrency(searchParams?.get("to"), DEFAULT_TO);
  const amount = normalizeAmount(searchParams?.get("amount"));

  return {
    from,
    to,
    amount,
    setFrom: () => undefined,
    setTo: () => undefined,
    setAmount: () => undefined,
    swapCurrencies: () => undefined,
  };
}

export function buildStateQuery(
  updates: {
    from?: string;
    to?: string;
    amount?: number;
  },
  searchParams: URLSearchParams,
): string {
  const params = new URLSearchParams(searchParams?.toString() ?? "");

  if (updates.from !== undefined)
    params.set("from", normalizeCurrency(updates.from, DEFAULT_FROM));
  if (updates.to !== undefined)
    params.set("to", normalizeCurrency(updates.to, DEFAULT_TO));
  if (updates.amount !== undefined)
    params.set("amount", normalizeAmount(String(updates.amount)).toString());

  return params.toString();
}
