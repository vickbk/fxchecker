import { config } from "@/shared/config";
import {
  FrankfurterError,
  FrankfurterOfflineError,
  FrankfurterRateLimitError,
  FrankfurterValidationError,
} from "./errors";
import type {
  FrankfurterHistoricalResponse,
  FrankfurterLatestResponse,
  FrankfurterTimeSeriesResponse,
} from "./types";

async function request<T>(
  path: string,
  queryParams: { from?: string; to?: string[] },
): Promise<T> {
  const url = new URL(path, config.FRANKFURTER_URL);

  if (queryParams.from) {
    url.searchParams.set("from", queryParams.from);
  }

  if (queryParams.to && queryParams.to.length > 0) {
    url.searchParams.set("to", queryParams.to.join(","));
  }

  try {
    const response = await fetch(url.toString());

    if (response.status === 200) {
      const contentType = response.headers?.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        throw new FrankfurterError(
          `Invalid content-type: expected application/json but received ${contentType}`,
        );
      }
      return await response.json();
    }

    if (response.status === 429) {
      throw new FrankfurterRateLimitError(
        "Frankfurter API rate limit exceeded (429).",
      );
    }

    if (response.status === 422) {
      throw new FrankfurterValidationError(
        "Invalid currency parameters or malformed request payload (422).",
      );
    }

    throw new FrankfurterError(
      `Frankfurter API returned unclassified response: HTTP ${response.status}`,
    );
  } catch (error: unknown) {
    if (error instanceof FrankfurterError) {
      throw error;
    }
    throw new FrankfurterOfflineError(
      `Network connectivity issue / offline: ${(error as Error).message || String(error)}`,
    );
  }
}

export async function fetchLatestRates(
  base?: string,
  symbols?: string[],
): Promise<FrankfurterLatestResponse> {
  return request<FrankfurterLatestResponse>("/latest", {
    from: base,
    to: symbols,
  });
}

export async function fetchHistoricalRates(
  date: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterHistoricalResponse> {
  return request<FrankfurterHistoricalResponse>(`/${date}`, {
    from: base,
    to: symbols,
  });
}

export async function fetchTimeSeriesRates(
  startDate: string,
  endDate: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterTimeSeriesResponse> {
  return request<FrankfurterTimeSeriesResponse>(`/${startDate}..${endDate}`, {
    from: base,
    to: symbols,
  });
}
