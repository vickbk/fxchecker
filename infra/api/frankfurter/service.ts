import { SWREngine } from "@/shared/cache";
import { config } from "@/shared/config";
import { getLookbackDate, parseTimeToMs } from "@/shared/utils";
import type {
  Currency,
  FrankfurterCurrency,
  FrankfurterRate,
  FrankfurterTimeSeriesResponse,
} from "./types";
import {
  FrankfurterError,
  FrankfurterOfflineError,
  FrankfurterRateLimitError,
  FrankfurterValidationError,
  getHistoricalCacheKey,
  getLatestCacheKey,
  getTimeSeriesCacheKey,
  toCurrency,
} from "./utils/";

export const frankfurterCache = new SWREngine({ ttlMs: 3 * 60 * 1000 });

const BASE_URL = config.FRANKFURTER_URL;

async function request<T>(
  path: string,
  queryParams?: Record<string, string | string[] | undefined>,
): Promise<T> {
  const url = new URL("/v2" + path, BASE_URL);

  const queryEntries: string[] = [];

  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const normalizedValue = Array.isArray(value) ? value.join(",") : value;
    if (!normalizedValue) {
      return;
    }

    const encodedValue =
      key === "quotes" ? normalizedValue : encodeURIComponent(normalizedValue);
    queryEntries.push(`${key}=${encodedValue}`);
  });

  if (queryEntries.length > 0) {
    url.search = `?${queryEntries.join("&")}`;
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

export async function fetchCurrencies(): Promise<Currency[]> {
  return frankfurterCache.execute(
    "currencies",
    async () => {
      const payload = await request<FrankfurterCurrency[]>("/currencies");
      if (Array.isArray(payload)) {
        return payload.map((entry) => {
          if (typeof entry === "object" && entry !== null) {
            return {
              code: entry.iso_code,
              name: entry.name || "",
              symbol: entry.symbol || "",
            };
          }

          return { code: "", name: "", symbol: "" };
        });
      }

      return Object.entries(payload ?? {}).map(([code, details]) =>
        toCurrency(details, code),
      );
    },
    { ttlMs: parseTimeToMs("7d") },
  );
}

export async function fetchCurrenciesMap(): Promise<Record<string, Currency>> {
  return frankfurterCache.execute(
    "currencies-map",
    async () => {
      const currencyMap: Record<string, Currency> = {};
      const currencies = await fetchCurrencies();
      currencies.forEach((currency) => (currencyMap[currency.code] = currency));
      return currencyMap;
    },
    {
      ttlMs: parseTimeToMs("7d"),
    },
  );
}

export async function fetchCurrencyDetails(code: string): Promise<Currency> {
  const normalizedCode = code.toUpperCase();
  return frankfurterCache.execute(
    `currency:${normalizedCode}`,
    async () => {
      const payload = await request<FrankfurterCurrency>(
        `/currency/${normalizedCode}`,
      );
      return toCurrency(payload);
    },
    { ttlMs: parseTimeToMs("1d") },
  );
}

export async function getRate(
  from: string,
  to: string,
): Promise<FrankfurterRate> {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();

  return frankfurterCache.execute(
    `rate:${fromCode}:${toCode}`,
    async () => {
      const query = `/rate/${fromCode}/${toCode}`;

      const [payload, aWeekback] = await Promise.all([
        await request<FrankfurterRate>(query),
        await request<FrankfurterRate>(`${query}?date=${getLookbackDate(7)}`),
      ]);
      return {
        date: payload.date || "",
        base: fromCode,
        quote: toCode,
        rate: payload.rate || 0,
        change: payload.rate - aWeekback.rate,
      };
    },
    { ttlMs: parseTimeToMs("30s") },
  );
}

export async function fetchLatestRates(
  base?: string,
  symbols?: string[],
): Promise<FrankfurterRate[]> {
  const key = getLatestCacheKey(base, symbols);
  return frankfurterCache.execute(
    key,
    () =>
      request<FrankfurterRate[]>("/rates", {
        base: base?.toUpperCase(),
        quotes: symbols?.map((symbol) => symbol.toUpperCase()),
      }),
    { ttlMs: parseTimeToMs("30s") },
  );
}

export async function fetchHistoricalRates(
  date: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterRate[]> {
  const key = getHistoricalCacheKey(date, base, symbols);
  return frankfurterCache.execute(
    key,
    () =>
      request<FrankfurterRate[]>("/rates", {
        from: date,
        base: base?.toUpperCase(),
        quotes: symbols
          ?.filter((symbol) => symbol && !!symbol.trim())
          .map((symbol) => symbol.toUpperCase()),
      }),
    { ttlMs: parseTimeToMs("1d") },
  );
}

export async function fetchTimeSeriesRates(
  startDate: string,
  endDate: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterTimeSeriesResponse> {
  const key = getTimeSeriesCacheKey(startDate, endDate, base, symbols);
  return frankfurterCache.execute(
    key,
    () =>
      request<FrankfurterTimeSeriesResponse>(`/${startDate}..${endDate}`, {
        from: base,
        to: symbols,
      }),
    { ttlMs: parseTimeToMs("1d") },
  );
}
