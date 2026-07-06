import { URLState } from "../types";

export const DEFAULT_FROM = "USD";
export const DEFAULT_TO = "EUR";
export const DEFAULT_AMOUNT = 100;

export function normalizeCurrency(
  value: string | null | undefined,
  fallback: string,
): string {
  const candidate = value?.trim().toUpperCase();
  return candidate ? candidate : fallback;
}

export function normalizeAmount(value: string | null | undefined): number {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_AMOUNT;
}

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
  };
}

export function buildStateQuery(
  updates: keyof URLState,
  searchParams: URLSearchParams,
  value: string | number,
): string {
  const params = new URLSearchParams(searchParams?.toString() ?? "");

  if (updates === "amount") {
    params.set("amount", String(value));
  } else {
    params.set(updates, normalizeCurrency(value as string, DEFAULT_FROM));
  }
  return params.toString();
}
