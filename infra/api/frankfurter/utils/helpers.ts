import { Currency, FrankfurterCurrency } from "../types";

export function getLatestCacheKey(base?: string, symbols?: string[]): string {
  const normalizedBase = base ?? "";
  const normalizedSymbols = symbols ? [...symbols].sort().join(",") : "";
  return `latest:${normalizedBase}:${normalizedSymbols}`;
}

export function getHistoricalCacheKey(
  date: string,
  base?: string,
  symbols?: string[],
): string {
  const normalizedBase = base ?? "";
  const normalizedSymbols = symbols ? [...symbols].sort().join(",") : "";
  return `historical:${date}:${normalizedBase}:${normalizedSymbols}`;
}

export function getTimeSeriesCacheKey(
  startDate: string,
  endDate: string,
  base?: string,
  symbols?: string[],
): string {
  const normalizedBase = base ?? "";
  const normalizedSymbols = symbols ? [...symbols].sort().join(",") : "";
  return `timeseries:${startDate}:${endDate}:${normalizedBase}:${normalizedSymbols}`;
}

export function toCurrency(payload: unknown, fallbackCode?: string): Currency {
  if (typeof payload !== "object" || payload === null) {
    return {
      code: fallbackCode ?? "",
      name: "",
      symbol: "",
    };
  }

  const record = payload as FrankfurterCurrency;

  return {
    code: record.iso_code,
    name: typeof record.name === "string" ? record.name : "",
    symbol: typeof record.symbol === "string" ? record.symbol : "",
  };
}
