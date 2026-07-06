import type {
  FrankfurterLatestResponse,
  FrankfurterHistoricalResponse,
  FrankfurterTimeSeriesResponse,
} from "./types";

export async function fetchLatestRates(
  base?: string,
  symbols?: string[],
): Promise<FrankfurterLatestResponse> {
  return Promise.reject(new Error("Not implemented"));
}

export async function fetchHistoricalRates(
  date: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterHistoricalResponse> {
  return Promise.reject(new Error("Not implemented"));
}

export async function fetchTimeSeriesRates(
  startDate: string,
  endDate: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterTimeSeriesResponse> {
  return Promise.reject(new Error("Not implemented"));
}
