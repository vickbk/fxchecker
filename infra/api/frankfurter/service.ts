import {
  FrankfurterError,
  FrankfurterOfflineError,
  FrankfurterRateLimitError,
  FrankfurterValidationError,
} from "./errors";
import type {
  CacheEntry,
  FrankfurterHistoricalResponse,
  FrankfurterLatestResponse,
  FrankfurterTimeSeriesResponse,
} from "./types";
import {
  getHistoricalCacheKey,
  getLatestCacheKey,
  getTimeSeriesCacheKey,
} from "./utils";

const cache = new Map<string, CacheEntry>();
const inFlightPromises = new Map<string, Promise<unknown>>();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export function _clearCache(): void {
  cache.clear();
  inFlightPromises.clear();
}

const BASE_URL = "https://api.frankfurter.app";

async function request<T>(
  path: string,
  queryParams: { from?: string; to?: string[] },
): Promise<T> {
  const url = new URL(path, BASE_URL);

  if (queryParams.from) {
    url.searchParams.set("from", queryParams.from);
  }

  if (queryParams.to && queryParams.to.length > 0) {
    url.searchParams.set("to", queryParams.to.join(","));
  }

  try {
    const response = await globalThis.fetch(url.toString());

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

async function executeCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
): Promise<T> {
  const entry = cache.get(key);
  const now = Date.now();

  if (entry && now - entry.createdAt < CACHE_TTL) {
    return entry.data as T;
  }

  if (entry) {
    if (!entry.isRevalidating) {
      entry.isRevalidating = true;
      fetchFn()
        .then((freshData) => {
          cache.set(key, {
            data: freshData,
            createdAt: Date.now(),
            isRevalidating: false,
          });
        })
        .catch(() => {
          entry.isRevalidating = false;
        });
    }
    return entry.data as T;
  }

  const inFlight = inFlightPromises.get(key);
  if (inFlight) {
    return inFlight as Promise<T>;
  }

  const promise = fetchFn()
    .then((data) => {
      cache.set(key, {
        data,
        createdAt: Date.now(),
        isRevalidating: false,
      });
      inFlightPromises.delete(key);
      return data;
    })
    .catch((err) => {
      inFlightPromises.delete(key);
      throw err;
    });

  inFlightPromises.set(key, promise);
  return promise;
}

export async function fetchLatestRates(
  base?: string,
  symbols?: string[],
): Promise<FrankfurterLatestResponse> {
  const key = getLatestCacheKey(base, symbols);
  return executeCached(key, () =>
    request<FrankfurterLatestResponse>("/latest", { from: base, to: symbols }),
  );
}

export async function fetchHistoricalRates(
  date: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterHistoricalResponse> {
  const key = getHistoricalCacheKey(date, base, symbols);
  return executeCached(key, () =>
    request<FrankfurterHistoricalResponse>(`/${date}`, {
      from: base,
      to: symbols,
    }),
  );
}

export async function fetchTimeSeriesRates(
  startDate: string,
  endDate: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterTimeSeriesResponse> {
  const key = getTimeSeriesCacheKey(startDate, endDate, base, symbols);
  return executeCached(key, () =>
    request<FrankfurterTimeSeriesResponse>(`/${startDate}..${endDate}`, {
      from: base,
      to: symbols,
    }),
  );
}
